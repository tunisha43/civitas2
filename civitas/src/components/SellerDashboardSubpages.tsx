import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  PlusCircle,
  FileText,
  TrendingUp,
  Users,
  Folder,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  Coins,
  Package,
  Truck,
  Layers,
  ArrowRight,
  ChevronRight,
  Filter,
  DollarSign,
  X
} from 'lucide-react';

interface SellerSubpagesProps {
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  profile: any;
  activeTab: string;
}

export const SellerDashboardSubpages: React.FC<SellerSubpagesProps> = ({
  addToast,
  profile,
  activeTab
}) => {
  // Products state
  const [products, setProducts] = useState([
    { id: 'p-1', name: 'Dangote Cement 3X (Grade 42.5R)', category: 'Cement', price: 9500, unit: 'bag', stock: 350, description: 'Premium grade rapid hardening portland limestone cement suitable for structural concrete decks.' },
    { id: 'p-2', name: 'Sharp River Sand (20-Ton Tipper)', category: 'Sand & Aggregates', price: 180000, unit: 'tipper', stock: 12, description: 'Clean, course river sand for structural concrete casting and brick masonry.' },
    { id: 'p-3', name: '16mm High-Yield Steel Reinforcement Bars', category: 'Steel & Metals', price: 980000, unit: 'ton', stock: 5, description: 'High tensile reinforcement steel bars compliant with BS 4449 grade specifications.' },
    { id: 'p-4', name: 'Premium Red Clay Building Bricks', category: 'Blocks & Bricks', price: 350000, unit: 'per 1,000 blocks', stock: 18, description: 'Kiln-fired durable red clay facing blocks with high compressive strength.' }
  ]);

  // Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Cement',
    price: '',
    unit: 'bag',
    stock: '',
    description: ''
  });

  // Orders State
  const [orders, setOrders] = useState([
    { id: 'ORD-9824', customerName: 'Alhaji Bello Musa', product: 'Dangote Cement 3X (Grade 42.5R)', qty: 50, total: 475000, date: '2026-07-04', status: 'Pending Shipment', escrow: 'Held in Escrow' },
    { id: 'ORD-9541', customerName: 'Engr. Kola Adeyemi', product: '16mm High-Yield Steel Reinforcement Bars', qty: 2, total: 1960000, date: '2026-07-01', status: 'Shipped', escrow: 'Pending Release Approval' },
    { id: 'ORD-9023', customerName: 'Josephine Sintei', product: 'Sharp River Sand (20-Ton Tipper)', qty: 1, total: 180000, date: '2026-06-25', status: 'Fulfilled & Completed', escrow: 'Released to Wallet' }
  ]);

  // Low stock warning threshold
  const [minStockWarning, setMinStockWarning] = useState(15);

  // Customers State
  const customers = [
    { name: 'Alhaji Bello Musa', email: 'bello.musa@outlook.com', phone: '08031234567', totalSpent: 475000, lastOrder: '2026-07-04', orderCount: 1 },
    { name: 'Engr. Kola Adeyemi', email: 'kola.adeyemi@consultants.ng', phone: '08022223333', totalSpent: 1960000, lastOrder: '2026-07-01', orderCount: 1 },
    { name: 'Josephine Sintei', email: 'josephinesinteh@gmail.com', phone: '09071790795', totalSpent: 180000, lastOrder: '2026-06-25', orderCount: 1 }
  ];

  // Payments / Payout history
  const [payouts] = useState([
    { ref: 'PAY-REF-908234', amount: 180000, fee: 3600, net: 176400, date: '2026-06-26', status: 'Settled to Bank Account' }
  ]);

  // Format money helper
  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Add / Edit product handlers
  const handleOpenAddModal = () => {
    setProductForm({ name: '', category: 'Cement', price: '', unit: 'bag', stock: '', description: '' });
    setIsEditing(false);
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price.toString(),
      unit: prod.unit,
      stock: prod.stock.toString(),
      description: prod.description
    });
    setEditingProductId(prod.id);
    setIsEditing(true);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast('success', 'Product Discarded', `Successfully removed "${name}" from your marketplace catalog.`);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(productForm.price);
    const stockNum = parseInt(productForm.stock);

    if (!productForm.name.trim() || isNaN(priceNum) || isNaN(stockNum)) {
      addToast('error', 'Incomplete Form', 'Please input valid name, price, and stock quantities.');
      return;
    }

    if (isEditing && editingProductId) {
      setProducts(prev => prev.map(p => {
        if (p.id === editingProductId) {
          return {
            ...p,
            name: productForm.name,
            category: productForm.category,
            price: priceNum,
            unit: productForm.unit,
            stock: stockNum,
            description: productForm.description
          };
        }
        return p;
      }));
      addToast('success', 'Product Recalibrated', `Successfully updated the specifications of "${productForm.name}".`);
    } else {
      const newProduct = {
        id: `p-${Date.now()}`,
        name: productForm.name,
        category: productForm.category,
        price: priceNum,
        unit: productForm.unit,
        stock: stockNum,
        description: productForm.description
      };
      setProducts([newProduct, ...products]);
      addToast('success', 'Listing Uplinked', `"${productForm.name}" is now live on the materials marketplace.`);
    }

    setProductModalOpen(false);
  };

  // Mark Order as Shipped
  const handleShipOrder = (orderId: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: 'Shipped', escrow: 'Pending Release Approval' };
      }
      return ord;
    }));
    addToast('success', 'Cargo Dispatched', `Order ${orderId} marked as Shipped. Customer has been notified to inspect and release escrow.`);
  };

  // Quick Restock Handler
  const handleQuickRestock = (prodId: string, amt: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        const nextStock = p.stock + amt;
        return { ...p, stock: nextStock };
      }
      return p;
    }));
    addToast('success', 'Inventory Restocked', 'Item count increments synchronized successfully.');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Dynamic Subpage Header */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black uppercase text-[#1A56A0] tracking-wider">Supplies Merchant Console</span>
          <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mt-0.5">{activeTab}</h1>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer font-bold"
        >
          <Plus className="h-4 w-4" /> Add Product Listing
        </button>
      </div>

      {/* ==========================================
          SUBPAGE: MY PRODUCTS
         ========================================== */}
      {activeTab === 'My Products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Active Market Listings</h3>
            <div className="space-y-4">
              {products.map(prod => (
                <div key={prod.id} className="p-4 border border-gray-100 dark:border-slate-700 rounded-2xl hover:bg-gray-50/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-700 dark:text-sky-400 text-gray-600 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">{prod.category}</span>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide truncate mt-1">{prod.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate leading-relaxed">{prod.description}</p>
                    <div className="flex gap-3 text-[10px] font-extrabold text-[#1A56A0] dark:text-sky-400 mt-1">
                      <span>Rate: {formatNaira(prod.price)} / {prod.unit}</span>
                      <span className={prod.stock < minStockWarning ? 'text-amber-600 font-bold' : 'text-gray-400'}>
                        Stock: {prod.stock} left {prod.stock < minStockWarning && '⚠️ Low'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="p-2 bg-slate-50 hover:bg-blue-50 text-gray-600 hover:text-[#1A56A0] dark:bg-slate-700 dark:text-gray-300 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Quick Payout Metrics</h4>
              <div className="p-4 bg-[#059669]/10 text-[#059669] rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Released Balance</p>
                  <p className="text-sm font-black mt-1">₦180,000</p>
                </div>
                <Coins className="h-6 w-6" />
              </div>
              <div className="p-4 bg-amber-500/10 text-amber-700 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Escrow Pending</p>
                  <p className="text-sm font-black mt-1">₦2,435,000</p>
                </div>
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: ORDERS
         ========================================== */}
      {activeTab === 'Orders' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Client Aggregates & Cement Orders</h3>
          <div className="space-y-4">
            {orders.map(ord => (
              <div key={ord.id} className="p-4 border border-gray-50 dark:border-slate-700 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-extrabold">{ord.id}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">| Ordered on: {ord.date}</span>
                  </div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">{ord.product}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">Buyer: {ord.customerName} | Quantity: {ord.qty} units</p>
                  <div className="flex gap-2.5 text-[10px] font-bold mt-1.5">
                    <span className="text-[#1A56A0] uppercase">Total: {formatNaira(ord.total)}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-emerald-600">Escrow: {ord.escrow}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                    ord.status === 'Fulfilled & Completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : ord.status === 'Shipped'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}>
                    {ord.status}
                  </span>
                  {ord.status === 'Pending Shipment' && (
                    <button
                      onClick={() => handleShipOrder(ord.id)}
                      className="px-4 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Ship Cargo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: INVENTORY
         ========================================== */}
      {activeTab === 'Inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Stock Levels Dashboard</h3>
            <div className="space-y-4">
              {products.map(prod => (
                <div key={prod.id} className="p-4 border border-gray-50 dark:border-slate-700 rounded-xl flex items-center justify-between text-left">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">{prod.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Category: {prod.category} | Restock trigger threshold: {minStockWarning} units</p>
                    <p className="text-xs font-extrabold text-[#1A56A0] mt-1.5">Stock Level: {prod.stock} {prod.unit}s</p>
                  </div>
                  <div className="flex gap-2.5 shrink-0">
                    <button
                      onClick={() => handleQuickRestock(prod.id, 50)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-[#1A56A0] text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      +50 bags
                    </button>
                    <button
                      onClick={() => handleQuickRestock(prod.id, 1)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-[#1A56A0] text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      +1 unit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Inventory Rules</h4>
              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Minimum Stock Alert Target</label>
                <input
                  type="number"
                  value={minStockWarning}
                  onChange={(e) => setMinStockWarning(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold focus:outline-none focus:border-[#1A56A0]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: CUSTOMERS
         ========================================== */}
      {activeTab === 'Customers' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Customer Accounts Database</h3>
          <div className="space-y-4">
            {customers.map(c => (
              <div key={c.name} className="p-4 border border-gray-50 dark:border-slate-700 rounded-xl hover:bg-gray-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">{c.name}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">Email: {c.email} | Tel: {c.phone}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 text-xs font-bold text-gray-500">
                  <span className="text-gray-900 dark:text-white">Aggregate Orders: {c.orderCount} purchases</span>
                  <span className="text-[#1A56A0] font-black">Gross Revenue: {formatNaira(c.totalSpent)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: REPORTS & PAYMENTS
         ========================================== */}
      {(activeTab === 'Reports' || activeTab === 'Payments') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Paystack Payout & Settlement Logs</h3>
            <div className="space-y-4">
              {payouts.map(pay => (
                <div key={pay.ref} className="p-4 border border-gray-50 dark:border-slate-700 rounded-xl flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-extrabold">{pay.ref}</p>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">Gross Payout: {formatNaira(pay.amount)}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold">Settled On: {pay.date} | Escrow Processing commission: {formatNaira(pay.fee)}</p>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                    {pay.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Merchant Commissions</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Escrow payouts are settled directly via Paystack gateway into your registered bank account 24 hours after customer delivery verification has been authorized.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT LISTING MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleProductSubmit} className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-gray-100 shadow-xl overflow-hidden text-left animate-slide-in">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-black tracking-wider text-[#1A56A0]">Materials Marketplace</span>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase">{isEditing ? 'Configure Specifications' : 'Add Material Listing'}</h3>
              </div>
              <button type="button" onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dangote Cement 3X..."
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:border-[#1A56A0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    <option value="Cement">Cement</option>
                    <option value="Sand & Aggregates">Sand & Aggregates</option>
                    <option value="Steel & Metals">Steel & Metals</option>
                    <option value="Blocks & Bricks">Blocks & Bricks</option>
                    <option value="Wood & Timber">Wood & Timber</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Unit</label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    <option value="bag">per bag</option>
                    <option value="tipper">per tipper</option>
                    <option value="ton">per ton</option>
                    <option value="unit">per unit</option>
                    <option value="per 1,000 blocks">per 1,000 blocks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Price (₦ Rate)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 9500"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Stock Level Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 100"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Material Description</label>
                <textarea
                  rows={3}
                  placeholder="Detail aggregate particle size, concrete strength compatibility, or compliance certificates..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#1A56A0]"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-50 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setProductModalOpen(false)} className="px-4 py-2 text-xs font-black uppercase text-gray-400 hover:text-gray-600">
                Discard
              </button>
              <button type="submit" className="px-5 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow">
                {isEditing ? 'Save Recalibrations' : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
