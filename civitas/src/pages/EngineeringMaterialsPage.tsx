import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mDb, MaterialProduct } from '../lib/marketplaceDb';
import { 
  Search, Filter, MapPin, Heart, ShoppingCart, Info, Star, ChevronRight, CheckCircle, 
  ArrowLeft, Truck, ShieldAlert, Award, ArrowUpDown, X, Layers, Percent, SlidersHorizontal, Eye
} from 'lucide-react';
import { MarketplaceCart } from '../components/MarketplaceCart';

interface EngineeringMaterialsPageProps {
  onNavigate: (page: string) => void;
  addToast?: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

const CATEGORIES = [
  { name: 'Cement & Concrete', count: '10+ brands', icon: '🧱' },
  { name: 'Steel & Iron Rods', count: '5 brands', icon: '🏗️' },
  { name: 'Sand & Granite', count: '12 quarries', icon: '⏳' },
  { name: 'Blocks & Bricks', count: '15 suppliers', icon: '🧱' },
  { name: 'Roofing Materials', count: '8 systems', icon: '🏠' },
  { name: 'Electrical Materials', count: '20 brands', icon: '🔌' },
  { name: 'Plumbing & Pipes', count: '14 fittings', icon: '🚰' },
  { name: 'Paint & Coatings', count: '9 brands', icon: '🎨' },
  { name: 'Tiles & Flooring', count: '11 showrooms', icon: '📐' },
  { name: 'Doors & Windows', count: '7 woodworks', icon: '🚪' },
  { name: 'Timber & Wood', count: '6 sawmills', icon: '🪵' },
  { name: 'Waterproofing', count: '8 chemicals', icon: '🧪' },
];

export const EngineeringMaterialsPage: React.FC<EngineeringMaterialsPageProps> = ({ onNavigate, addToast }) => {
  const { user, profile } = useAuth();
  const userId = user?.id || 'usr_guest';

  // DB States
  const [materials, setMaterials] = useState<MaterialProduct[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // UI Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<MaterialProduct | null>(null);
  const [calcQty, setCalcQty] = useState<number>(10);
  const [calcState, setCalcState] = useState<string>('Lagos');

  // Cart Modal State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Load Data
  const loadData = async () => {
    const [mats, wishItems, cartItems] = await Promise.all([
      mDb.getMaterials(),
      mDb.getWishlist(userId),
      mDb.getCart(userId),
    ]);
    setMaterials(mats);
    setWishlist(wishItems.map(i => i.item_id));
    setCartCount(cartItems.length);
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  // Wishlist Toggle
  const toggleWishlist = async (product: MaterialProduct) => {
    if (userId === 'usr_guest') {
      addToast?.('warning', 'Authentication Required', 'Please log in to add items to your wishlist.');
      onNavigate('login');
      return;
    }

    if (wishlist.includes(product.id)) {
      await mDb.removeFromWishlist(userId, product.id);
      addToast?.('success', 'Wishlist Updated', `Removed "${product.name}" from your wishlist.`);
    } else {
      await mDb.addToWishlist(userId, product.id, 'material', product.price);
      addToast?.('success', 'Wishlist Updated', `Saved "${product.name}" to your wishlist.`);
    }
    loadData();
  };

  // Add to Cart
  const handleAddToCart = async (product: MaterialProduct, qty: number = 1) => {
    await mDb.addToCart(userId, product.id, 'material', product.price, qty);
    addToast?.('success', 'Added to Cart', `Added ${qty} ${product.unit}(s) of "${product.name}" to your cart.`);
    setIsCartOpen(true);
    loadData();
  };

  // Calculations for detail modal
  const handleCalcQtyChange = (val: number) => {
    if (val < 1) return;
    setCalcQty(val);
  };

  const getPriceForQty = (product: MaterialProduct, qty: number) => {
    let finalPrice = product.price;
    for (const tier of product.bulk_pricing) {
      if (qty >= tier.min_qty && (tier.max_qty === 'unlimited' || qty <= (tier.max_qty as number))) {
        finalPrice = tier.price;
        break;
      }
    }
    return finalPrice;
  };

  // Filtering Logic
  const filteredProducts = materials.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || product.location === selectedLocation;
    
    const numPrice = product.price;
    const matchesMinPrice = minPrice === '' || numPrice >= minPrice;
    const matchesMaxPrice = maxPrice === '' || numPrice <= maxPrice;

    return matchesSearch && matchesCategory && matchesLocation && matchesMinPrice && matchesMaxPrice;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviews_count - a.reviews_count; // popular default
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-16" id="materials-marketplace-wrapper">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-[#1A56A0] to-blue-800 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner text-left relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <span className="bg-blue-800/80 text-blue-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-700">
              Escrow Protection Active
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Engineering Materials
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-medium">
              Source quality construction materials from verified Nigerian suppliers. All purchases protected by secure escrow.
            </p>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 text-[#1A56A0] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            <span>Shopping Cart ({cartCount})</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        
        {/* 2. Category Chips slider */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-left">
            Material Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#1A56A0] border-[#1A56A0] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
              }`}
            >
              <span>✨ All Materials</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-[#1A56A0] border-[#1A56A0] text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* 3. Search & Filters Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          
          {/* Search Box */}
          <div className="relative w-full md:flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search cement, iron rods, granite, paint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] text-gray-900 dark:text-white"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            {/* Location Select */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-600 dark:text-gray-300">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-[11px] font-bold uppercase cursor-pointer"
              >
                <option value="All">All States</option>
                <option value="Lagos">Lagos</option>
                <option value="Ogun">Ogun</option>
                <option value="Oyo">Oyo</option>
                <option value="Rivers">Rivers</option>
                <option value="Abuja">Abuja</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-600 dark:text-gray-300">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-[11px] font-bold uppercase cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setShowFiltersModal(true)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* 4. Product Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-left">
            <div>
              <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider">
                Products Available
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredProducts.length} verified listings matching selection
              </p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl p-12 text-center">
              <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No matching materials found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                Try modifying your search keywords, broadening your state filters, or clearing your price boundaries.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => {
                const isSaved = wishlist.includes(product.id);
                const hasBulk = product.bulk_pricing.length > 1;
                const lowestBulk = hasBulk ? product.bulk_pricing[product.bulk_pricing.length - 1].price : product.price;

                return (
                  <div 
                    key={product.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group text-left"
                    id={`material-card-${product.id}`}
                  >
                    {/* Visual Card Image area */}
                    <div className="h-44 bg-gray-100 dark:bg-slate-900 relative flex items-center justify-center p-4">
                      {/* Brand Label */}
                      <span className="absolute top-3 left-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-[9px] font-black uppercase tracking-wider px-2 py-0.5 text-gray-500 dark:text-gray-300 rounded border border-gray-100 dark:border-slate-700">
                        {product.brand}
                      </span>
                      
                      {/* Heart Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur bg-white/85 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition-colors cursor-pointer ${
                          isSaved ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                      </button>

                      <span className="text-5xl">{CATEGORIES.find(c => c.name === product.category)?.icon || '🧱'}</span>

                      {/* Stock Status Banner */}
                      <span className={`absolute bottom-3 left-3 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        product.stock_status === 'In Stock' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : product.stock_status === 'Low Stock' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_status}
                      </span>
                    </div>

                    {/* Card Description */}
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                        <span>{product.category}</span>
                      </div>

                      <h4 className="text-xs font-black text-gray-900 dark:text-white group-hover:text-[#1A56A0] transition-colors leading-snug line-clamp-2">
                        {product.name}
                      </h4>

                      {/* Supplier & Vetting info */}
                      <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-gray-500">
                        <span className="font-extrabold truncate max-w-[120px]">
                          {product.supplier_name}
                        </span>
                        {product.is_verified && (
                          <span className="bg-blue-50 text-[#1A56A0] font-black text-[8px] uppercase px-1 rounded flex items-center gap-0.5 flex-shrink-0">
                            <CheckCircle className="h-2 w-2 text-[#1A56A0]" /> Vetted
                          </span>
                        )}
                      </div>

                      {/* Pricing block */}
                      <div className="mt-4 pt-3.5 border-t border-gray-50 dark:border-slate-700 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Price</p>
                          <p className="text-sm font-black text-gray-950 dark:text-white">
                            ₦{product.price.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold">/ {product.unit}</span>
                          </p>
                          {hasBulk && (
                            <p className="text-[9px] text-emerald-600 font-black uppercase mt-0.5">
                              Bulk as low as ₦{lowestBulk.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-0.5">
                          ⭐ {product.rating} <span className="opacity-60">({product.reviews_count})</span>
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setCalcQty(product.min_order);
                          }}
                          className="py-2.5 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-100 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100 dark:border-slate-600 flex items-center justify-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> Details
                        </button>
                        <button
                          onClick={() => handleAddToCart(product, product.min_order)}
                          disabled={product.stock_status === 'Out of Stock'}
                          className="py-2.5 bg-[#1A56A0] hover:bg-blue-700 disabled:opacity-40 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Buy
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          MODALS
         ========================================================= */}

      {/* A. Advanced Filters Drawer */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md h-full shadow-2xl p-6 flex flex-col text-left">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-700">
              <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white">Advanced Filters</h3>
              <button onClick={() => setShowFiltersModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-grow py-4 space-y-6 overflow-y-auto">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {/* Price Limits */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Price Range (₦)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Verified Only */}
              <div className="p-4 bg-blue-50/40 dark:bg-slate-900/60 border border-blue-50 rounded-2xl flex items-start gap-3">
                <Award className="h-5 w-5 text-[#1A56A0] mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200">Escrow Protected</h5>
                  <p className="text-[10px] text-gray-400 leading-snug mt-0.5">
                    Every supplier is pre-screened. Your payment stays frozen in escrow until goods are physically delivered to your site.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLocation('All');
                  setMinPrice('');
                  setMaxPrice('');
                  setSortBy('popular');
                  setShowFiltersModal(false);
                }}
                className="flex-grow py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-black uppercase text-center cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="flex-grow py-3 bg-[#1A56A0] text-white rounded-xl text-xs font-black uppercase text-center cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. Product Details Modal with Bulk Calculator */}
      {selectedProduct && (() => {
        const product = selectedProduct;
        const finalPrice = getPriceForQty(product, calcQty);
        const subtotal = finalPrice * calcQty;
        const discountAmount = (product.price - finalPrice) * calcQty;
        const deliveryDays = product.delivery_info[calcState] || 3;

        return (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 text-left animate-fade-in relative shadow-2xl">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {/* Image and specs */}
                <div className="space-y-6">
                  <div className="h-64 bg-gray-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-7xl shadow-inner border border-gray-50 dark:border-slate-800">
                    {CATEGORIES.find(c => c.name === product.category)?.icon || '🧱'}
                  </div>

                  {/* Specs Table */}
                  <div className="space-y-2.5">
                    <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Technical Specifications</h5>
                    <div className="border border-gray-50 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                      {Object.entries(product.specs).map(([key, val], i) => (
                        <div key={key} className={`grid grid-cols-2 p-3 ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-slate-900/20' : 'bg-white dark:bg-slate-800'}`}>
                          <span className="font-bold text-gray-500">{key}</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing, Descriptions, Bulk Calculator */}
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] bg-blue-50 text-[#1A56A0] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-blue-100">
                      {product.brand}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      Supplier: <span className="font-extrabold text-[#1A56A0]">{product.supplier_name}</span>
                      {product.is_verified && <span className="text-[8px] bg-emerald-50 text-emerald-800 font-extrabold px-1 rounded uppercase">Vetted</span>}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-yellow-500">★ {product.rating}</span>
                    <span className="text-gray-400">{product.reviews_count} verified site reviews</span>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-black uppercase text-gray-400">Description</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Bulk Tier List */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-gray-400">Bulk Pricing Discount Tiers</h5>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {product.bulk_pricing.map((tier, idx) => (
                        <div key={idx} className="p-2.5 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-xl">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">
                            {tier.max_qty === 'unlimited' ? `${tier.min_qty}+` : `${tier.min_qty}-${tier.max_qty}`} {product.unit}s
                          </p>
                          <p className="font-black text-gray-950 dark:text-white mt-1">
                            ₦{tier.price.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Calculator */}
                  <div className="p-4 bg-blue-50/30 dark:bg-slate-900/40 rounded-2xl border border-blue-50/50 dark:border-slate-800 space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5 text-[#1A56A0]" />
                      <span>Bulk Price & Delivery Estimator</span>
                    </h5>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Quantity Input */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 block">Quantity ({product.unit}s)</span>
                        <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                          <button 
                            onClick={() => handleCalcQtyChange(calcQty - 1)}
                            className="p-2.5 font-black hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-500 cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={calcQty}
                            onChange={(e) => handleCalcQtyChange(Number(e.target.value))}
                            className="w-full text-center text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
                          />
                          <button 
                            onClick={() => handleCalcQtyChange(calcQty + 1)}
                            className="p-2.5 font-black hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-500 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold block mt-1">Min order: {product.min_order} {product.unit}s</span>
                      </div>

                      {/* State Input */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 block">Site Delivery State</span>
                        <select
                          value={calcState}
                          onChange={(e) => setCalcState(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer focus:outline-none"
                        >
                          <option value="Lagos">Lagos</option>
                          <option value="Ogun">Ogun</option>
                          <option value="Oyo">Oyo</option>
                          <option value="Rivers">Rivers</option>
                          <option value="Abuja">Abuja (FCT)</option>
                        </select>
                        <span className="text-[9px] text-gray-400 font-bold block mt-1 flex items-center gap-1">
                          <Truck className="h-3 w-3 text-gray-400" /> Lead time: {deliveryDays} day(s)
                        </span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="pt-3.5 border-t border-gray-100 dark:border-slate-700 space-y-1.5 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Unit Price ({calcQty >= product.min_order ? 'Bulk Discount Applied' : 'Standard'}):</span>
                        <span className="font-extrabold text-gray-900 dark:text-white">₦{finalPrice.toLocaleString()} / {product.unit}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-extrabold">
                          <span>Total Bulk Saving:</span>
                          <span>-₦{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm pt-2 border-t border-dashed border-gray-100 dark:border-slate-700">
                        <span className="font-bold text-gray-800 dark:text-gray-200">Subtotal Estimation:</span>
                        <span className="font-black text-gray-950 dark:text-white">₦{subtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleAddToCart(product, calcQty);
                        setSelectedProduct(null);
                      }}
                      className="flex-grow py-3 bg-[#1A56A0] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4.5 w-4.5" />
                      <span>Add to Cart (₦{subtotal.toLocaleString()})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* C. Marketplace Shopping Cart Drawer */}
      <MarketplaceCart 
        isOpen={isCartOpen} 
        onClose={() => {
          setIsCartOpen(false);
          loadData();
        }} 
        addToast={addToast} 
        onNavigate={onNavigate}
      />

    </div>
  );
};
