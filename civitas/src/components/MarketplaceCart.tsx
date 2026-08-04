import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mDb, CartItem, MaterialProduct, Order } from '../lib/marketplaceDb';
import { PAYSTACK_CALLBACK_URL, PAYSTACK_PUBLIC_KEY } from '../config/env';
import { 
  X, ShoppingBag, Trash2, Heart, ShieldCheck, MapPin, Phone, Truck, 
  CreditCard, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Ticket, Percent, Sparkles, Printer
} from 'lucide-react';

interface MarketplaceCartProps {
  isOpen: boolean;
  onClose: () => void;
  addToast?: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  onNavigate: (page: string) => void;
}

export const MarketplaceCart: React.FC<MarketplaceCartProps> = ({ isOpen, onClose, addToast, onNavigate }) => {
  const { user, profile } = useAuth();
  const userId = user?.id || 'usr_guest';
  const userRole = profile?.role || 'Customer';

  // Checkout Steps: 'cart' | 'shipping' | 'summary' | 'payment' | 'success'
  const [step, setStep] = useState<'cart' | 'shipping' | 'summary' | 'payment' | 'success'>('cart');
  
  // Cart Items
  const [cartItems, setCartItems] = useState<(CartItem & { details: MaterialProduct })[]>([]);
  
  // Shipping details form
  const [address, setAddress] = useState({
    state: 'Lagos',
    city: '',
    street: '',
    landmark: '',
    phone: '',
    instructions: ''
  });

  // Payment states
  const [paystackOtp, setPaystackOtp] = useState('');
  const [paystackLoading, setPaystackLoading] = useState(false);
  const [paystackScreen, setPaystackScreen] = useState<'card_input' | 'otp_challenge' | 'completed'>('card_input');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Load items
  const loadCartItems = async () => {
    const [items, materials] = await Promise.all([mDb.getCart(userId), mDb.getMaterials()]);

    // Join details
    const joined = items.map(item => {
      const details = materials.find(m => m.id === item.item_id);
      return details ? { ...item, details } : null;
    }).filter(i => i !== null) as (CartItem & { details: MaterialProduct })[];

    setCartItems(joined);
  };

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
      setStep('cart');
      setPaystackScreen('card_input');
      setPaystackOtp('');
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems
    .filter(item => !item.saved_for_later)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 10% Engineer Discount for Professionals and Companies
  const isEngineer = userRole === 'Professional' || userRole === 'Company';
  const discountRate = isEngineer ? 0.10 : 0;
  const discountAmount = subtotal * discountRate;

  // VAT (7.5%)
  const vat = (subtotal - discountAmount) * 0.075;

  // Delivery Fee (Constant simulation)
  const deliveryFee = subtotal > 0 ? 12500 : 0;

  // Escrow protection Fee (1%)
  const escrowFee = (subtotal - discountAmount) * 0.01;

  // Total
  const grandTotal = subtotal - discountAmount + vat + deliveryFee + escrowFee;

  // Cart operations
  const handleQtyChange = async (cartId: string, current: number, delta: number) => {
    await mDb.updateCartQty(userId, cartId, current + delta);
    loadCartItems();
  };

  const handleRemove = async (cartId: string) => {
    await mDb.removeFromCart(userId, cartId);
    addToast?.('success', 'Cart Updated', 'Item removed from your cart.');
    loadCartItems();
  };

  const handleSaveForLater = async (cartId: string) => {
    await mDb.toggleSaveForLater(userId, cartId);
    addToast?.('info', 'Cart Updated', 'Item saved for later.');
    loadCartItems();
  };

  const handleMoveToCart = async (cartId: string) => {
    await mDb.toggleSaveForLater(userId, cartId);
    addToast?.('success', 'Cart Updated', 'Item moved to active cart list.');
    loadCartItems();
  };

  // Start checkout transition
  const handleProceedToShipping = () => {
    if (userId === 'usr_guest') {
      addToast?.('warning', 'Secure Checkout', 'Please login or register to complete your order.');
      onClose();
      onNavigate('login');
      return;
    }
    if (subtotal === 0) {
      addToast?.('error', 'Cart is Empty', 'No active items in cart to checkout.');
      return;
    }
    setStep('shipping');
  };

  const handleProceedToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.city.trim() || !address.street.trim() || !address.phone.trim()) {
      addToast?.('error', 'Required Fields', 'Please fill in City, Street Address, and Phone Number.');
      return;
    }
    setStep('summary');
  };

  const handleInitiatePaystack = () => {
    setStep('payment');
    setPaystackScreen('card_input');
  };

  const handlePaystackSubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    setPaystackLoading(true);
    setTimeout(() => {
      setPaystackLoading(false);
      setPaystackScreen('otp_challenge');
    }, 1500);
  };

  const handlePaystackVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (paystackOtp !== '123456') {
      addToast?.('error', 'Invalid OTP', 'Simulated Paystack OTP is "123456". Please try again.');
      return;
    }
    
    setPaystackLoading(true);
    setTimeout(async () => {
      // 1. Create order record
      const activeItems = cartItems.filter(i => !i.saved_for_later);
      const itemsForOrder = activeItems.map(item => ({
        product_id: item.item_id,
        product_name: item.details.name,
        product_type: 'material' as const,
        supplier_id: item.details.supplier_id,
        supplier_name: item.details.supplier_name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const newOrder = await mDb.createOrder({
        buyer_id: userId,
        buyer_name: profile?.fullName || user?.email || 'Vetted Buyer',
        delivery_address: address,
        subtotal,
        delivery_fee: deliveryFee,
        platform_fee: escrowFee,
        vat,
        discount: discountAmount,
        total: grandTotal
      }, itemsForOrder);

      // 2. Clear Active Cart Items
      await Promise.all(activeItems.map(item => mDb.removeFromCart(userId, item.id)));

      setCreatedOrder(newOrder);
      setPaystackLoading(false);
      setPaystackScreen('completed');
      setStep('success');
      addToast?.('success', 'Payment Successful', 'Your escrow order was placed successfully.');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" id="marketplace-cart-drawer">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg h-full shadow-2xl flex flex-col text-left animate-slide-in">
        
        {/* Header */}
        <div className="h-20 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#1A56A0]" />
            <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white">
              {step === 'cart' && 'Shopping Cart'}
              {step === 'shipping' && 'Delivery Address'}
              {step === 'summary' && 'Order Summary'}
              {step === 'payment' && 'Paystack Secure Escrow'}
              {step === 'success' && 'Order Confirmed'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Dynamic Steps Content */}
        <div className="flex-grow overflow-y-auto p-6">
          
          {/* STEP 1: CART REVISION */}
          {step === 'cart' && (
            <div className="space-y-6">
              {/* Active list */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Active Items</h4>
                {cartItems.filter(i => !i.saved_for_later).length === 0 ? (
                  <div className="py-12 border border-dashed border-gray-100 dark:border-slate-800 rounded-2xl text-center text-gray-400">
                    <p className="text-xs font-bold">Your active cart is empty</p>
                    <p className="text-[10px] mt-0.5">Add construction materials from the marketplace list.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.filter(i => !i.saved_for_later).map(item => (
                      <div key={item.id} className="p-3 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-xl flex gap-3 items-start">
                        <span className="text-3xl p-1.5 bg-white dark:bg-slate-900 rounded-lg">🧱</span>
                        <div className="flex-grow min-w-0">
                          <p className="text-[11px] text-gray-400 font-bold uppercase">{item.details.brand}</p>
                          <h5 className="text-xs font-black text-gray-900 dark:text-white truncate">{item.details.name}</h5>
                          <p className="text-xs font-extrabold text-[#1A56A0] mt-1">₦{item.price.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold">/ {item.details.unit}</span></p>
                          
                          {/* Qty & Save Actions */}
                          <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-gray-100/60 dark:border-slate-800">
                            <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                              <button onClick={() => handleQtyChange(item.id, item.quantity, -1)} className="px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer">-</button>
                              <span className="px-3 text-xs font-bold">{item.quantity}</span>
                              <button onClick={() => handleQtyChange(item.id, item.quantity, 1)} className="px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer">+</button>
                            </div>

                            <div className="flex gap-2">
                              <button onClick={() => handleSaveForLater(item.id)} className="p-1.5 text-gray-400 hover:text-[#1A56A0] rounded-lg text-xs font-bold uppercase tracking-wider">Save Later</button>
                              <button onClick={() => handleRemove(item.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved for Later list */}
              {cartItems.some(i => i.saved_for_later) && (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-500 tracking-wider">Saved For Later</h4>
                  <div className="space-y-3">
                    {cartItems.filter(i => i.saved_for_later).map(item => (
                      <div key={item.id} className="p-3 border border-gray-100 dark:border-slate-800 rounded-xl flex gap-3 items-center opacity-70">
                        <span className="text-2xl p-1 bg-gray-50 dark:bg-slate-900 rounded-lg">🧱</span>
                        <div className="flex-grow min-w-0">
                          <h5 className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.details.name}</h5>
                          <p className="text-xs font-bold text-gray-500 mt-0.5">₦{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => handleMoveToCart(item.id)} className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1A56A0] text-[9px] font-black uppercase rounded-lg">Move to Cart</button>
                          <button onClick={() => handleRemove(item.id)} className="p-1.5 text-rose-400"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SHIPPING FORM */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToSummary} className="space-y-4 text-xs">
              <p className="text-xs text-gray-400 mb-2 leading-relaxed">
                Provide the exact physical construction site address in Nigeria. Materials are dispatched with flat-bed trucks.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400">Site State</label>
                <select
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Ogun">Ogun</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Abuja">Abuja (FCT)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">City / LGA</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki, Ikeja"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">Site Site Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08031234567"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 14, Kola Street, off expressway"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400">Prominent Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Near GTBank or beside the local quarry"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400">Truck Delivery Instructions</label>
                <textarea
                  placeholder="e.g. Narrow roads, dump cement under dry awning..."
                  value={address.instructions}
                  onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <button type="submit" id="submit-shipping-btn" className="hidden" />
            </form>
          )}

          {/* STEP 3: ORDER SUMMARY */}
          {step === 'summary' && (
            <div className="space-y-6">
              {/* Product mini list */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Order Items</h4>
                <div className="space-y-1.5 border border-gray-50 dark:border-slate-800/80 p-3 rounded-2xl bg-gray-50/30">
                  {cartItems.filter(i => !i.saved_for_later).map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="truncate max-w-[240px] font-semibold text-gray-700 dark:text-gray-300">
                        {item.quantity}x {item.details.name}
                      </span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Review */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Delivery Site Details</h4>
                <div className="p-3 border border-gray-50 rounded-xl bg-gray-50/20 text-xs space-y-1 text-gray-600 dark:text-gray-300">
                  <p className="font-bold flex items-center gap-1 text-gray-900 dark:text-white">
                    <MapPin className="h-3.5 w-3.5 text-[#1A56A0]" />
                    {address.street}, {address.city}, {address.state}
                  </p>
                  {address.landmark && <p>Landmark: {address.landmark}</p>}
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-400" /> Site Representative Phone: {address.phone}
                  </p>
                </div>
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-slate-800">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Escrow Price Details</h4>
                <div className="p-4 bg-gray-50/50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800 rounded-2xl text-xs space-y-2.5">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Cart Subtotal:</span>
                    <span className="font-mono">₦{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {isEngineer && (
                    <div className="flex justify-between text-emerald-600 font-extrabold items-center">
                      <span className="flex items-center gap-1">
                        <Percent className="h-3.5 w-3.5" /> 10% Engineer Discount:
                      </span>
                      <span className="font-mono">-₦{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>VAT (7.5%):</span>
                    <span className="font-mono">₦{vat.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Truck Dispatch Flat rate:</span>
                    <span className="font-mono">₦{deliveryFee.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-400 items-center">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#1A56A0]" /> 1% Escrow Security Fee:
                    </span>
                    <span className="font-mono">₦{escrowFee.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm pt-3 border-t border-dashed border-gray-100 dark:border-slate-800">
                    <span className="font-black text-gray-800 dark:text-gray-200">Escrow Total Payment:</span>
                    <span className="font-black text-base text-gray-950 dark:text-white font-mono">₦{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Escrow Guarantee Statement */}
              <div className="p-3 bg-blue-50/40 border border-blue-50 rounded-xl text-[10px] text-gray-500 leading-snug">
                ⚠️ **Escrow Protection**: Payment is held securely by My Engineering App platform. The supplier is paid ONLY when you inspect and confirm delivery on site. You can file a return or dispute at any time.
              </div>
            </div>
          )}

          {/* STEP 4: PAYSTACK SIMULATION POPUP */}
          {step === 'payment' && (
            <div className="space-y-6">
              {paystackScreen !== 'completed' && (
                <div className="p-5 border border-emerald-500 bg-emerald-50/10 rounded-3xl space-y-4 shadow-inner text-center">
                  <div className="flex flex-col items-center justify-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                      <span className="text-xs font-black uppercase text-emerald-600 tracking-wider font-mono">Paystack Simulated Sandbox</span>
                    </div>
                    <div className="w-full text-left bg-gray-50 dark:bg-slate-900 rounded-xl p-2.5 border border-emerald-500/10 font-mono text-[9px] text-gray-500 dark:text-gray-400 space-y-1">
                      <div><span className="font-semibold text-emerald-600">Public Key:</span> {PAYSTACK_PUBLIC_KEY}</div>
                      <div className="break-all"><span className="font-semibold text-emerald-600">Callback:</span> {PAYSTACK_CALLBACK_URL}</div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Paying <span className="font-black text-gray-900 dark:text-white">₦{grandTotal.toLocaleString()}</span> securely. 
                  </p>

                  {paystackLoading ? (
                    <div className="py-12 flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Contacting Banking Gateway...</p>
                    </div>
                  ) : paystackScreen === 'card_input' ? (
                    <form onSubmit={handlePaystackSubmitCard} className="space-y-3.5 text-left text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-emerald-600 font-mono">Card Holder Name</label>
                        <input
                          type="text"
                          required
                          defaultValue={profile?.fullName || "Vetted Professional"}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-emerald-100 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-emerald-600 font-mono">Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="4000 1234 5678 9010"
                          defaultValue="5061 1234 5678 9010"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-emerald-100 rounded-xl font-mono text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-emerald-600 font-mono">Expiry</label>
                          <input
                            type="text"
                            required
                            placeholder="MM / YY"
                            defaultValue="12 / 29"
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-emerald-100 rounded-xl text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-emerald-600 font-mono">CVV</label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            placeholder="123"
                            defaultValue="123"
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-emerald-100 rounded-xl text-center"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer mt-2"
                      >
                        Simulate Payment Authorized
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handlePaystackVerifyOtp} className="space-y-4 text-left text-xs">
                      <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-[10px] text-amber-800">
                        🔑 Enter the simulated Paystack sandbox SMS authentication OTP **123456** to complete escrow transaction.
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-emerald-600 font-mono">SMS OTP Code</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="------"
                          value={paystackOtp}
                          onChange={(e) => setPaystackOtp(e.target.value)}
                          className="w-full px-3 py-3.5 bg-white dark:bg-slate-800 border border-emerald-300 rounded-xl text-center font-mono text-sm tracking-widest focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                      >
                        Verify OTP & Lock Escrow
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: SUCCESS INVOICE */}
          {step === 'success' && createdOrder && (
            <div className="space-y-6 text-center">
              <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-600 mb-2">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">Escrow Payment Locked</h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                Invoice generated! Your ₦{createdOrder.total.toLocaleString()} payment is safe under our strict escrow contract. Delivery trucks are packing aggregates at the quarry now.
              </p>

              {/* Invoice slip */}
              <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-2xl text-left text-xs space-y-3 font-sans" id="invoice-receipt">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-1">
                  <div>
                    <p className="font-extrabold text-[#1A56A0] uppercase text-[10px] tracking-widest">My Engineering App</p>
                    <p className="text-[9px] text-gray-400">Materials Division Lagos</p>
                  </div>
                  <span className="text-[10px] bg-[#1A56A0]/10 text-[#1A56A0] font-mono px-2 py-0.5 rounded font-bold">
                    {createdOrder.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                  <p>Date: {new Date(createdOrder.created_at).toLocaleDateString()}</p>
                  <p>Status: Escrow Held</p>
                  <p className="col-span-2">Site: {createdOrder.delivery_address.street}, {createdOrder.delivery_address.city}</p>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-2 text-[10px] space-y-1">
                  <div className="flex justify-between text-gray-500">
                    <span>Items Subtotal:</span>
                    <span>₦{createdOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {createdOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Professional Discount (10%):</span>
                      <span>-₦{createdOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>VAT (7.5%):</span>
                    <span>₦{createdOrder.vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping Dispatch:</span>
                    <span>₦{createdOrder.delivery_fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>1% Escrow Commission:</span>
                    <span>₦{createdOrder.platform_fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black text-gray-900 border-t border-gray-200/80 pt-2">
                    <span>Total Paid (Paystack):</span>
                    <span>₦{createdOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Visual Timeline Tracking link */}
              <div className="p-3 bg-blue-50/30 border border-blue-50 rounded-xl text-[10px] text-gray-600 leading-snug flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#1A56A0] flex-shrink-0" />
                <p>
                  You can track this truck and view real-time delivery logs directly under the **Customer Dashboard &rarr; Orders** tab.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => {
                    // Print simulation
                    window.print();
                  }}
                  className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" /> Invoice
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('dashboard/customer');
                  }}
                  className="py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Track Order
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer (Actions) */}
        {step !== 'success' && step !== 'payment' && (
          <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/60">
            {/* Totals */}
            {step !== 'shipping' && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">₦{subtotal.toLocaleString()}</span>
                </div>
                {isEngineer && (
                  <div className="flex justify-between text-xs text-emerald-600 font-extrabold">
                    <span>Engineer Discount (10%):</span>
                    <span className="font-mono">-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-800 dark:text-gray-300 font-bold">
                  <span>Estimated Total:</span>
                  <span className="font-mono text-sm text-gray-950 dark:text-white">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {step === 'cart' && (
                <button
                  onClick={handleProceedToShipping}
                  className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow"
                >
                  <span>Secure Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {step === 'shipping' && (
                <>
                  <button
                    onClick={() => setStep('cart')}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const btn = document.getElementById('submit-shipping-btn');
                      if (btn) btn.click();
                    }}
                    className="flex-grow py-3 bg-[#1A56A0] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Summary Review</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {step === 'summary' && (
                <>
                  <button
                    onClick={() => setStep('shipping')}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleInitiatePaystack}
                    className="flex-grow py-3 bg-[#1A56A0] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4.5 w-4.5" />
                    <span>Pay with Paystack</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
