/**
 * Engineering Marketplace Simulation & Storage Layer
 * Persists all Marketplace, Equipment, Skilled Labour, Cart, and Order Tracking states in localStorage.
 */

export interface MaterialProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  supplier_name: string;
  supplier_id: string;
  is_verified: boolean;
  location: string;
  price: number;
  unit: string;
  min_order: number;
  stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stock_qty: number;
  rating: number;
  reviews_count: number;
  description: string;
  specs: Record<string, string>;
  bulk_pricing: { min_qty: number; max_qty: number | 'unlimited'; price: number }[];
  delivery_info: Record<string, number>; // State name -> estimated days
}

export interface MarketplaceListing {
  id: string;
  seller_id: string;
  seller_name: string;
  is_verified: boolean;
  category: string;
  title: string;
  condition: 'New' | 'Used' | 'Refurbished';
  description: string;
  price: number;
  negotiable: boolean;
  location_state: string;
  location_city: string;
  status: 'Active' | 'Draft' | 'Sold' | 'Paused';
  views: number;
  saves: number;
  created_at: string;
  specs: Record<string, string>;
}

export interface MarketplaceOffer {
  id: string;
  listing_id: string;
  buyer_id: string;
  buyer_name: string;
  amount: number;
  message: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Countered';
  counter_amount?: number;
  created_at: string;
}

export interface EquipmentListing {
  id: string;
  owner_id: string;
  owner_name: string;
  is_verified: boolean;
  name: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  condition: 'Excellent' | 'Good' | 'Fair';
  specs: Record<string, string>;
  rent_daily: number;
  rent_weekly: number;
  rent_monthly: number;
  purchase_price?: number; // optional if available for purchase
  includes_operator: boolean;
  operator_rate: number;
  mobilisation_fee: number;
  min_rental_days: number;
  location_states: string[];
  location_city: string;
  status: 'Available' | 'Rented' | 'Under Maintenance' | 'Paused';
  rating: number;
  reviews_count: number;
  created_at: string;
}

export interface EquipmentBooking {
  id: string;
  equipment_id: string;
  renter_id: string;
  renter_name: string;
  start_date: string;
  end_date: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  includes_operator: boolean;
  daily_rate: number;
  rental_days: number;
  subtotal: number;
  mobilisation_fee: number;
  operator_cost: number;
  platform_fee: number;
  total_amount: number;
  escrow_status: 'Held' | 'Released' | 'Refunded' | 'Disputed';
  status: 'Pending Confirmation' | 'Confirmed' | 'Active Rental' | 'Completed' | 'Declined';
  created_at: string;
}

export interface LabourProfile {
  id: string;
  user_id: string;
  fullName: string;
  gender: 'Female' | 'Male';
  trade: string;
  experience_years: number;
  daily_rate: number;
  skills: string[];
  availability: boolean;
  location_state: string;
  location_city: string;
  bio: string;
  rating: number;
  reviews_count: number;
  projects_completed: number;
  portfolio_photos: string[];
  certifications: string[];
}

export interface LabourBooking {
  id: string;
  worker_id: string;
  worker_name: string;
  employer_id: string;
  project_type: string;
  location: string;
  start_date: string;
  duration_days: number;
  daily_rate: number;
  total_amount: number;
  escrow_status: 'Held' | 'Released' | 'Refunded' | 'Disputed';
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  item_id: string;
  type: 'material' | 'marketplace';
  quantity: number;
  price: number;
  saved_for_later: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_type: 'material' | 'marketplace';
  supplier_id: string;
  supplier_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  delivery_status: 'Order Placed' | 'Confirmed' | 'Prepared' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
}

export interface Order {
  id: string;
  buyer_id: string;
  buyer_name: string;
  delivery_address: {
    state: string;
    city: string;
    street: string;
    landmark?: string;
    phone: string;
    instructions?: string;
  };
  subtotal: number;
  delivery_fee: number;
  platform_fee: number;
  vat: number;
  discount: number;
  total: number;
  payment_status: 'Paid' | 'Unpaid';
  escrow_status: 'Held' | 'Released' | 'Refunded' | 'Disputed';
  created_at: string;
  delivery_timeline: { status: string; note: string; created_at: string }[];
}

export interface OrderReturn {
  id: string;
  order_id: string;
  reason: string;
  description: string;
  status: 'Pending Review' | 'Approved' | 'Refunded' | 'Rejected';
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'material' | 'marketplace' | 'equipment' | 'labour' | 'drawing';
  price_at_save: number;
  saved_at: string;
}

export interface ProductReview {
  id: string;
  entity_id: string; // Product id, equipment id, worker id, supplier id
  entity_type: 'material' | 'equipment' | 'labour' | 'marketplace' | 'supplier';
  reviewer_name: string;
  rating: number; // 1-5
  quality_rating?: number;
  value_rating?: number;
  delivery_speed_rating?: number;
  comment: string;
  photos?: string[];
  created_at: string;
}

// LOCALSTORAGE KEYS
const M_KEYS = {
  MATERIALS: 'me_materials',
  P2P_LISTINGS: 'me_p2p_listings',
  P2P_OFFERS: 'me_p2p_offers',
  EQUIPMENT: 'me_equipment',
  EQUIPMENT_BOOKINGS: 'me_equipment_bookings',
  LABOUR_PROFILES: 'me_labour_profiles',
  LABOUR_BOOKINGS: 'me_labour_bookings',
  CART: 'me_cart_items',
  ORDERS: 'me_orders',
  ORDER_ITEMS: 'me_order_items',
  ORDER_RETURNS: 'me_order_returns',
  WISHLIST: 'me_wishlist_items',
  REVIEWS: 'me_marketplace_reviews',
};

// INITIAL SEED DATA DEFINITIONS
const SEED_MATERIALS: MaterialProduct[] = [
  {
    id: 'mat-1',
    name: 'Dangote Cement 42.5R',
    brand: 'Dangote Cement',
    category: 'Cement & Concrete',
    supplier_name: 'Dangote Group PLC',
    supplier_id: 'sup-dangote',
    is_verified: true,
    location: 'Lagos',
    price: 8500,
    unit: 'bag',
    min_order: 10,
    stock_status: 'In Stock',
    stock_qty: 2500,
    rating: 4.9,
    reviews_count: 312,
    description: 'Dangote Cement 3X 42.5R is a premium grade cement designed for higher concrete strengths, superior yield, and faster setting times. Excellent for casting slabs, columns, and heavy foundations.',
    specs: {
      'Grade': '42.5R Rapid Hardening',
      'Standard': 'NIS ISO 9001:2015',
      'Bag Weight': '50kg',
      'Applications': 'Structural concrete, block making, plastering'
    },
    bulk_pricing: [
      { min_qty: 1, max_qty: 49, price: 8500 },
      { min_qty: 50, max_qty: 199, price: 8300 },
      { min_qty: 200, max_qty: 'unlimited', price: 8100 }
    ],
    delivery_info: { 'Lagos': 1, 'Ogun': 2, 'Oyo': 3, 'FCT Abuja': 4, 'Rivers': 5 }
  },
  {
    id: 'mat-2',
    name: 'Reinforcement Steel Iron Rod 16mm Y16',
    brand: 'Tungsten Steel Nigeria',
    category: 'Steel & Iron Rods',
    supplier_name: 'Nigeria Steel Distributors',
    supplier_id: 'sup-nisteel',
    is_verified: true,
    location: 'Lagos',
    price: 85000,
    unit: 'tonne',
    min_order: 1,
    stock_status: 'In Stock',
    stock_qty: 120,
    rating: 4.8,
    reviews_count: 89,
    description: 'High tensile 16mm iron rods (Y16) complying with British Standard BS 4449. Ideal for lintels, beam reinforcements, and columns in medium to high-rise building structures.',
    specs: {
      'Diameter': '16mm (Y16)',
      'Yield Strength': '500 N/mm²',
      'Length per rod': '12 meters',
      'Standard': 'BS 4449 / NIS compliance'
    },
    bulk_pricing: [
      { min_qty: 1, max_qty: 4, price: 85000 },
      { min_qty: 5, max_qty: 19, price: 83500 },
      { min_qty: 20, max_qty: 'unlimited', price: 81000 }
    ],
    delivery_info: { 'Lagos': 2, 'Ogun': 3, 'Oyo': 4, 'FCT Abuja': 5, 'Rivers': 5 }
  },
  {
    id: 'mat-3',
    name: 'Sharp Sand (Tipper Load)',
    brand: 'Lekki Marine Dredging',
    category: 'Sand & Granite',
    supplier_name: 'Dredge Nigeria Co.',
    supplier_id: 'sup-dredge',
    is_verified: true,
    location: 'Lagos',
    price: 45000,
    unit: 'tipper',
    min_order: 1,
    stock_status: 'In Stock',
    stock_qty: 500,
    rating: 4.6,
    reviews_count: 57,
    description: 'Clean dredged sharp sand, free of clay and organic debris. Excellent for concrete mixing, rendering, and block molding.',
    specs: {
      'Volume': '20 Tons / Tipper',
      'Moisture Content': 'Low (<4%)',
      'Debris Content': 'Nil',
      'Source': 'Dredged Lagos Lagoon'
    },
    bulk_pricing: [
      { min_qty: 1, max_qty: 4, price: 45000 },
      { min_qty: 5, max_qty: 'unlimited', price: 43000 }
    ],
    delivery_info: { 'Lagos': 1, 'Ogun': 2 }
  },
  {
    id: 'mat-4',
    name: 'Granite 3/4 Inch (Tipper Load)',
    brand: 'Abeokuta Quarry Corp',
    category: 'Sand & Granite',
    supplier_name: 'Abeokuta Quarry Corp',
    supplier_id: 'sup-quarry',
    is_verified: true,
    location: 'Lagos',
    price: 65000,
    unit: 'tipper',
    min_order: 1,
    stock_status: 'In Stock',
    stock_qty: 300,
    rating: 4.9,
    reviews_count: 74,
    description: 'Coarse granite aggregate sized precisely at 3/4 inch (19mm). Essential for high-strength concrete mixes in slabs, columns, and foundations.',
    specs: {
      'Aggregate Size': '3/4 inch (19mm)',
      'Weight': '30 Tons / Tipper',
      'Crush Strength': 'High (Tested up to 45MPa)',
      'Source': 'Abeokuta Quarry'
    },
    bulk_pricing: [
      { min_qty: 1, max_qty: 2, price: 65000 },
      { min_qty: 3, max_qty: 'unlimited', price: 63000 }
    ],
    delivery_info: { 'Lagos': 2, 'Ogun': 1, 'Oyo': 2 }
  },
  {
    id: 'mat-5',
    name: '9 Inch Vibrated Blocks',
    brand: 'Supreme Blocks PLC',
    category: 'Blocks & Bricks',
    supplier_name: 'Supreme Blocks PLC',
    supplier_id: 'sup-supreme',
    is_verified: true,
    location: 'Lagos',
    price: 750,
    unit: 'unit',
    min_order: 100,
    stock_status: 'In Stock',
    stock_qty: 8000,
    rating: 4.7,
    reviews_count: 98,
    description: 'Heavy-duty machine-vibrated 9-inch load-bearing sandcrete blocks. Moulded with high-quality Dangote Cement for structural integrity and maximum crush resistance.',
    specs: {
      'Size': '9" x 9" x 18" (load-bearing)',
      'Mix Ratio': '1:6 (Cement to Sand)',
      'Curing Time': '21 Days Fully Cured',
      'Vibration': 'Automated High-Frequency Vibrator'
    },
    bulk_pricing: [
      { min_qty: 100, max_qty: 999, price: 750 },
      { min_qty: 1000, max_qty: 'unlimited', price: 720 }
    ],
    delivery_info: { 'Lagos': 2, 'Ogun': 3 }
  },
  {
    id: 'mat-6',
    name: 'Gerard Stone Coated Roofing Tile',
    brand: 'Gerard Roofing Systems',
    category: 'Roofing Materials',
    supplier_name: 'Gerard Roofing Nigeria',
    supplier_id: 'sup-gerard',
    is_verified: true,
    location: 'Lagos',
    price: 4500,
    unit: 'sqm',
    min_order: 50,
    stock_status: 'In Stock',
    stock_qty: 4500,
    rating: 4.9,
    reviews_count: 142,
    description: 'Original Gerard Stone-Coated steel roofing tile imported from New Zealand. Lifetime corrosion protection, fireproof, and designed to look classy and modern for over 50 years.',
    specs: {
      'Material': 'Alu-Zinc Steel Sheet with natural stone chips',
      'Thickness': '0.45mm base steel',
      'Tile Weight': '2.8 kg / sheet',
      'Lifespan': '50+ Years Guarantee'
    },
    bulk_pricing: [
      { min_qty: 50, max_qty: 299, price: 4500 },
      { min_qty: 300, max_qty: 'unlimited', price: 4200 }
    ],
    delivery_info: { 'Lagos': 2, 'Ogun': 3, 'Oyo': 3, 'FCT Abuja': 4, 'Rivers': 4 }
  },
  {
    id: 'mat-7',
    name: 'Coleman 2.5mm Single Core Copper Cable',
    brand: 'Coleman Wires & Cables',
    category: 'Electrical Materials',
    supplier_name: 'Coleman Cable Factory Store',
    supplier_id: 'sup-coleman',
    is_verified: true,
    location: 'Lagos',
    price: 45000,
    unit: 'roll',
    min_order: 1,
    stock_status: 'In Stock',
    stock_qty: 210,
    rating: 4.8,
    reviews_count: 110,
    description: '100% Pure Copper 2.5mm single-core electrical cable from Coleman. Excellent conductivity, heat resistance, and fire protection. Made in Nigeria, certified by SON.',
    specs: {
      'Conductor Size': '2.5mm²',
      'Core Type': 'Single Core Solid Copper',
      'Length': '100 Meters / Roll',
      'Certification': 'SON, NIS ISO 9001'
    },
    bulk_pricing: [
      { min_qty: 1, max_qty: 9, price: 45000 },
      { min_qty: 10, max_qty: 'unlimited', price: 43500 }
    ],
    delivery_info: { 'Lagos': 1, 'Ogun': 2, 'Oyo': 2, 'FCT Abuja': 3, 'Rivers': 3 }
  },
  {
    id: 'mat-8',
    name: 'PPR Pipes 25mm (High Pressure PN20)',
    brand: 'VeraPlast Germany',
    category: 'Plumbing & Pipes',
    supplier_name: 'Pipes & Fittings Ltd',
    supplier_id: 'sup-pipes',
    is_verified: true,
    location: 'Lagos',
    price: 2800,
    unit: 'length',
    min_order: 10,
    stock_status: 'In Stock',
    stock_qty: 850,
    rating: 4.5,
    reviews_count: 36,
    description: 'Premium PN20 grade PPR pipe, 25mm diameter, suitable for hot and cold high-pressure water supply. Thermal fusion welding ensures absolutely leakproof joints.',
    specs: {
      'Diameter': '25mm',
      'Pressure Rating': 'PN20 (20 Bar)',
      'Length': '4 Meters per pipe',
      'Material': 'Random Copolymer Polypropylene (PPR)'
    },
    bulk_pricing: [
      { min_qty: 10, max_qty: 99, price: 2800 },
      { min_qty: 100, max_qty: 'unlimited', price: 2600 }
    ],
    delivery_info: { 'Lagos': 1, 'Ogun': 2, 'Oyo': 3, 'FCT Abuja': 3, 'Rivers': 4 }
  },
  {
    id: 'mat-9',
    name: 'Dulux Weathershield Paint (Classic White)',
    brand: 'Dulux Paint',
    category: 'Paint & Coatings',
    supplier_name: 'Dulux Premium Centre Lagos',
    supplier_id: 'sup-dulux',
    is_verified: true,
    location: 'Lagos',
    price: 35000,
    unit: '20L',
    min_order: 2,
    stock_status: 'Low Stock',
    stock_qty: 14,
    rating: 4.9,
    reviews_count: 81,
    description: 'Dulux Weathershield is a top-of-the-range exterior acrylic paint. Keeps outer walls clean and bright by fighting algae, mold, UV weathering, and rainfall stains. Guaranteed protection for 8 years.',
    specs: {
      'Volume': '20 Litres Drum',
      'Finish': 'Low Sheen Smooth Acrylic',
      'Coverage': 'Up to 140 sqm per drum',
      'Special property': 'Anti-Fungal & Anti-Algae Smart shield'
    },
    bulk_pricing: [
      { min_qty: 2, max_qty: 9, price: 35000 },
      { min_qty: 10, max_qty: 'unlimited', price: 33500 }
    ],
    delivery_info: { 'Lagos': 1, 'Ogun': 2, 'Oyo': 2, 'FCT Abuja': 3, 'Rivers': 3 }
  },
  {
    id: 'mat-10',
    name: '60x60 Porcelain Glazed Floor Tiles',
    brand: 'Royal Ceramic PLC',
    category: 'Tiles & Flooring',
    supplier_name: 'Royal Ceramic Gallery',
    supplier_id: 'sup-royal',
    is_verified: true,
    location: 'Lagos',
    price: 18000,
    unit: 'sqm',
    min_order: 20,
    stock_status: 'In Stock',
    stock_qty: 1400,
    rating: 4.7,
    reviews_count: 65,
    description: 'High-density glazed porcelain floor tiles (60x60cm). Extremely glossy, scratch resistant, with a modern ivory marble pattern. Ideal for sitting rooms and premium hallways.',
    specs: {
      'Size': '600mm x 600mm (4 tiles/box)',
      'Material': 'Polished Porcelain',
      'Tile Thickness': '9.5mm',
      'Box Coverage': '1.44 sqm per carton'
    },
    bulk_pricing: [
      { min_qty: 20, max_qty: 99, price: 18000 },
      { min_qty: 100, max_qty: 'unlimited', price: 16800 }
    ],
    delivery_info: { 'Lagos': 2, 'Ogun': 2, 'Oyo': 3, 'FCT Abuja': 4, 'Rivers': 4 }
  },
  {
    id: 'mat-11',
    name: 'Mahogany Hardwood Flush Door',
    brand: 'Sapele Joineries',
    category: 'Doors & Windows',
    supplier_name: 'Sapele Joineries Store',
    supplier_id: 'sup-sapele',
    is_verified: true,
    location: 'Lagos',
    price: 45000,
    unit: 'unit',
    min_order: 2,
    stock_status: 'In Stock',
    stock_qty: 45,
    rating: 4.6,
    reviews_count: 29,
    description: 'Beautiful solid-core mahogany hardwood flush doors. Termite-treated, warp-resistant, pre-sanded, and ready for polish. Includes frame and architrave.',
    specs: {
      'Height': '2100 mm',
      'Width': '900 mm',
      'Core': 'Solid Sawn Timber slats',
      'Wood species': 'Sapele / Mahogany'
    },
    bulk_pricing: [
      { min_qty: 2, max_qty: 5, price: 45000 },
      { min_qty: 6, max_qty: 'unlimited', price: 42000 }
    ],
    delivery_info: { 'Lagos': 2, 'Ogun': 3, 'Oyo': 3, 'FCT Abuja': 4 }
  },
  {
    id: 'mat-12',
    name: 'Crystalline Waterproofing Compound',
    brand: 'Sika Chemical',
    category: 'Waterproofing',
    supplier_name: 'Chemical & Waterproofing Centre',
    supplier_id: 'sup-waterproof',
    is_verified: true,
    location: 'Lagos',
    price: 28000,
    unit: '25kg',
    min_order: 1,
    stock_status: 'In Stock',
    stock_qty: 90,
    rating: 4.8,
    reviews_count: 42,
    description: 'Active crystalline slurry coating which penetrates deep into the concrete capillary tract, permanently sealing pores, hairline cracks, and structural voids against water ingress under pressure.',
    specs: {
      'Bag Weight': '25 kg',
      'Type': 'Cementitious crystalline waterproofing powder',
      'Coverage': 'approx. 1.2 kg per sqm (2 coats)',
      'Curing requirements': 'Damp curing required for 3 days'
    },
    bulk_pricing: [
      { min_qty: 1, max_qty: 9, price: 28000 },
      { min_qty: 10, max_qty: 'unlimited', price: 26500 }
    ],
    delivery_info: { 'Lagos': 1, 'Ogun': 2, 'Oyo': 2, 'FCT Abuja': 3, 'Rivers': 3 }
  }
];

const SEED_P2P_LISTINGS: MarketplaceListing[] = [
  {
    id: 'p2p-1',
    seller_id: 'usr_seller_1',
    seller_name: 'Chief James Kolawole',
    is_verified: true,
    category: 'Used Materials',
    title: 'Used Scaffolding Set (50-Frames)',
    condition: 'Used',
    description: 'Set of H-Frame construction scaffolding made of galvanised steel pipes. Includes coupling pins, cross-braces, and base plates. Perfect for plastering and external painting operations.',
    price: 180000,
    negotiable: true,
    location_state: 'Lagos',
    location_city: 'Ikeja',
    status: 'Active',
    views: 142,
    saves: 18,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    specs: { 'Brand': 'Supreme Scaffolds', 'Frame Type': 'H-Frame Standard', 'Couplers': 'Included', 'Condition': 'Fairly used, no structural damage' }
  },
  {
    id: 'p2p-2',
    seller_id: 'usr_seller_2',
    seller_name: 'Femi Alabi Contractors',
    is_verified: true,
    category: 'Tools & Equipment',
    title: 'High-Frequency Concrete Vibrator',
    condition: 'Used',
    description: 'Simba 1.5HP portable electric concrete vibrator. Comes with a 4-meter flexible needle. Compact and useful for compaction of columns and floor foundations.',
    price: 45000,
    negotiable: false,
    location_state: 'Abuja',
    location_city: 'Garki',
    status: 'Active',
    views: 89,
    saves: 7,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    specs: { 'Power': '1.1 kW / 1.5 HP', 'Needle Length': '4 meters', 'Needle Size': '35 mm', 'Voltage': '220V standard' }
  },
  {
    id: 'p2p-3',
    seller_id: 'usr_seller_3',
    seller_name: 'Nkemka Obi Builders',
    is_verified: false,
    category: 'New Materials',
    title: '50 Bags of Dangote Cement',
    condition: 'New',
    description: 'We ordered too many bags of Dangote Cement for our fence foundation and have 50 bags left over. Fully bagged, sealed, kept dry indoors in our site room in Lekki. Need urgent buyer to pack them.',
    price: 400000,
    negotiable: true,
    location_state: 'Lagos',
    location_city: 'Lekki Phase 1',
    status: 'Active',
    views: 201,
    saves: 34,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    specs: { 'Brand': 'Dangote Cement', 'Bag Count': '50 Bags', 'Storage': 'Dry room on wooden pallets', 'Grade': '42.5R Grade' }
  },
  {
    id: 'p2p-4',
    seller_id: 'usr_seller_4',
    seller_name: 'Engr. Yusuf Idris',
    is_verified: true,
    category: 'Tools & Equipment',
    title: 'Sokkia Total Station (CX-105)',
    condition: 'Used',
    description: 'Sokkia CX-105 high-accuracy surveying Total Station. Complete with target prism, heavy-duty aluminium tripod stand, batteries, charger, and plastic storage carrying case. Last calibrated November 2025.',
    price: 350000,
    negotiable: true,
    location_state: 'Lagos',
    location_city: 'Surulere',
    status: 'Active',
    views: 112,
    saves: 15,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    specs: { 'Model': 'Sokkia CX-105', 'Accuracy': '5 Arc Seconds', 'Range': '5,000 meters with prism', 'Battery life': 'Up to 36 hours continuous' }
  },
  {
    id: 'p2p-5',
    seller_id: 'usr_seller_5',
    seller_name: 'Eecosystem Library Store',
    is_verified: true,
    category: 'Engineering Books & Resources',
    title: 'Professional Structural Design Manual Set',
    condition: 'New',
    description: 'Unused, brand-new set of structural design manuals based on Eurocodes and British standard designs. Excellent reference textbooks for site engineers, structural design students, and construction supervisors.',
    price: 25000,
    negotiable: false,
    location_state: 'Lagos',
    location_city: 'Yaba',
    status: 'Active',
    views: 74,
    saves: 11,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    specs: { 'Books': '4 manual set', 'Language': 'English', 'Cover': 'Softcover', 'Standards covered': 'Eurocode 2, Eurocode 3, BS 8110' }
  },
  {
    id: 'p2p-6',
    seller_id: 'usr_seller_6',
    seller_name: 'Bayo & Sons Engineering',
    is_verified: false,
    category: 'Vehicles & Machinery',
    title: 'Lister Peter 10KVA Soundproof Generator',
    condition: 'Used',
    description: 'Lister Peter soundproof heavy-duty diesel generator (10KVA capacity). Clean, well-serviced engine, extremely low fuel consumption, useful for powering remote site welding machines or site cabins.',
    price: 850000,
    negotiable: true,
    location_state: 'Port Harcourt',
    location_city: 'Woji',
    status: 'Active',
    views: 121,
    saves: 9,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    specs: { 'Capacity': '10 KVA', 'Fuel Type': 'Diesel', 'Soundproofing': 'Integrated heavy metal acoustic cabin', 'Running hours': '840 hours' }
  },
  {
    id: 'p2p-7',
    seller_id: 'usr_seller_7',
    seller_name: 'Alhaji Musa Dangote Agencies',
    is_verified: true,
    category: 'Office & Site Equipment',
    title: '20ft Site Office Container Cabin',
    condition: 'Used',
    description: 'Fully converted 20ft marine shipping container styled as a temporary site construction office. Fitted with insulated walls, PVC ceiling, electrical wiring, 2 socket points, a workspace table, 2 windows, and heavy security locking door.',
    price: 450000,
    negotiable: true,
    location_state: 'Lagos',
    location_city: 'Apapa',
    status: 'Active',
    views: 198,
    saves: 22,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    specs: { 'Size': '20 feet length', 'Insulation': 'Expanded polystyrene board', 'Fittings': 'Light fixture, main breaker, standard table', 'Transport': 'Excludes crane loading' }
  },
  {
    id: 'p2p-8',
    seller_id: 'usr_seller_8',
    seller_name: 'Musa Welding Works',
    is_verified: true,
    category: 'Tools & Equipment',
    title: 'Heavy Duty MMA Arc Welding Machine',
    condition: 'Used',
    description: 'Heavy industrial welding machine (400A). Excellent for fabrication of steel trusses and high-thickness iron plates. Comes with extra long 10m heavy copper ground and electrode cable.',
    price: 85000,
    negotiable: false,
    location_state: 'Kano',
    location_city: 'Fagge',
    status: 'Active',
    views: 56,
    saves: 4,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    specs: { 'Amperage': '400 Amp max output', 'Input Voltage': '220V - 380V Auto', 'Cables': 'Included (Heavy copper)', 'Electrode compatibility': 'Up to gauge 8 rods' }
  }
];

const SEED_EQUIPMENT: EquipmentListing[] = [
  {
    id: 'eq-1',
    owner_id: 'usr_equip_1',
    owner_name: 'Lekki Plant Leasing Corp',
    is_verified: true,
    name: 'CAT 320D Hydraulic Excavator',
    category: 'Excavators & Bulldozers',
    brand: 'Caterpillar',
    model: '320D L',
    year: 2018,
    condition: 'Excellent',
    specs: {
      'Engine Power': '110 kW (148 HP)',
      'Bucket Capacity': '1.2 m³',
      'Operating Weight': '21,500 kg',
      'Max Dig Depth': '6.6 meters'
    },
    rent_daily: 280000,
    rent_weekly: 1800000,
    rent_monthly: 6500000,
    purchase_price: 42000000,
    includes_operator: true,
    operator_rate: 15000, // Per day included
    mobilisation_fee: 120000, // Transport to site
    min_rental_days: 3,
    location_states: ['Lagos', 'Ogun', 'Oyo'],
    location_city: 'Lekki',
    status: 'Available',
    rating: 4.9,
    reviews_count: 31,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'eq-2',
    owner_id: 'usr_equip_2',
    owner_name: 'FastMix Ready Concrete Co.',
    is_verified: true,
    name: 'Sinotruk Concrete Pump Truck 37m',
    category: 'Concrete Equipment',
    brand: 'Sinotruk / Sany',
    model: 'SY5291THB',
    year: 2019,
    condition: 'Good',
    specs: {
      'Boom Length': '37 meters vertical reach',
      'Pumping Capacity': '120 m³ / hour',
      'Chassis': 'Sinotruk Howo 8x4',
      'Remote Control': 'Radio wireless included'
    },
    rent_daily: 150000,
    rent_weekly: 950000,
    rent_monthly: 3200000,
    includes_operator: true,
    operator_rate: 20000,
    mobilisation_fee: 85000,
    min_rental_days: 1,
    location_states: ['Lagos', 'Ogun'],
    location_city: 'Ikeja',
    status: 'Available',
    rating: 4.7,
    reviews_count: 14,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 'eq-3',
    owner_id: 'usr_equip_3',
    owner_name: 'Titan Heavy Lift Ltd',
    is_verified: true,
    name: '50-Tonne Mobile Crane (Zoomlion)',
    category: 'Lifting & Craning',
    brand: 'Zoomlion',
    model: 'QY50V',
    year: 2017,
    condition: 'Excellent',
    specs: {
      'Lift Capacity': '50 Tonnes',
      'Main Boom Length': '42.5 meters',
      'Jib Length': '16 meters',
      'Engine': 'Weichai WP10 Heavy'
    },
    rent_daily: 450000,
    rent_weekly: 2800000,
    rent_monthly: 10000000,
    includes_operator: true,
    operator_rate: 30000,
    mobilisation_fee: 250000,
    min_rental_days: 2,
    location_states: ['Lagos', 'Ogun', 'Oyo', 'Rivers', 'FCT Abuja'],
    location_city: 'Apapa',
    status: 'Available',
    rating: 4.9,
    reviews_count: 26,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'eq-4',
    owner_id: 'usr_equip_4',
    owner_name: 'Dandick Road Machineries',
    is_verified: true,
    name: 'Sany Articulated Dump Truck (30T)',
    category: 'Trucks & Haulage',
    brand: 'Sany',
    model: 'SAT30',
    year: 2016,
    condition: 'Good',
    specs: {
      'Load Capacity': '30 Tonnes',
      'Engine Power': '250 kW',
      'Drive': '6x6 AWD Articulated',
      'Dump Volume': '18.5 m³'
    },
    rent_daily: 200000,
    rent_weekly: 1300000,
    rent_monthly: 4800000,
    includes_operator: true,
    operator_rate: 15000,
    mobilisation_fee: 150000,
    min_rental_days: 5,
    location_states: ['FCT Abuja', 'Nasarawa', 'Kaduna'],
    location_city: 'Gwagwalada',
    status: 'Available',
    rating: 4.5,
    reviews_count: 9,
    created_at: new Date(Date.now() - 11 * 86400000).toISOString()
  },
  {
    id: 'eq-5',
    owner_id: 'usr_equip_5',
    owner_name: 'BuildForce Batching Systems',
    is_verified: true,
    name: 'Mobile Concrete Batching Plant 25m³/h',
    category: 'Concrete Equipment',
    brand: 'Sime',
    model: 'M-25',
    year: 2020,
    condition: 'Excellent',
    specs: {
      'Production Capacity': '25 cubic meters / hour',
      'Mixer Type': 'Twin-shaft planetary',
      'Aggregate bins': '3 bins x 10 m³',
      'Cement Silo': 'Included (50-tonne split)'
    },
    rent_daily: 350000,
    rent_weekly: 2200000,
    rent_monthly: 8000000,
    purchase_price: 58000000,
    includes_operator: true,
    operator_rate: 25000,
    mobilisation_fee: 350000,
    min_rental_days: 14,
    location_states: ['Lagos', 'Ogun', 'Edo', 'Delta'],
    location_city: 'Epe',
    status: 'Available',
    rating: 4.8,
    reviews_count: 18,
    created_at: new Date(Date.now() - 9 * 86400000).toISOString()
  },
  {
    id: 'eq-6',
    owner_id: 'usr_equip_6',
    owner_name: 'PH Quarry Support Services',
    is_verified: true,
    name: 'Dynapac Compactor Roller (12T)',
    category: 'Compaction Equipment',
    brand: 'Dynapac',
    model: 'CA250D',
    year: 2017,
    condition: 'Good',
    specs: {
      'Weight': '12,200 kg',
      'Drum Width': '2,130 mm',
      'Vibration Freq': '30 Hz / 40 Hz',
      'Engine Model': 'Cummins QSB 4.5'
    },
    rent_daily: 85000,
    rent_weekly: 550000,
    rent_monthly: 1900000,
    includes_operator: true,
    operator_rate: 10000,
    mobilisation_fee: 65000,
    min_rental_days: 2,
    location_states: ['Rivers', 'Bayelsa', 'Delta', 'Imo'],
    location_city: 'Port Harcourt',
    status: 'Available',
    rating: 4.6,
    reviews_count: 12,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: 'eq-7',
    owner_id: 'usr_equip_7',
    owner_name: 'Lagos Tower Cranes & Hoists',
    is_verified: true,
    name: 'Potain Tower Crane 8-Tonne MC115',
    category: 'Lifting & Craning',
    brand: 'Potain',
    model: 'MC 115',
    year: 2015,
    condition: 'Excellent',
    specs: {
      'Max Load Capacity': '8,000 kg',
      'Tip Load': '1,150 kg at 50 meters',
      'Max Hook Height': '120 meters freestanding',
      'Jib Length': '50 meters'
    },
    rent_daily: 500000,
    rent_weekly: 3100000,
    rent_monthly: 11000000,
    includes_operator: true,
    operator_rate: 35000,
    mobilisation_fee: 1500000, // Assembly + Transport is high
    min_rental_days: 30, // Long-term commitment preferred
    location_states: ['Lagos', 'Rivers', 'FCT Abuja'],
    location_city: 'Badagry',
    status: 'Available',
    rating: 5.0,
    reviews_count: 11,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'eq-8',
    owner_id: 'usr_equip_8',
    owner_name: 'Nationwide Survey Equipment',
    is_verified: true,
    name: 'Trimble R10 GPS RTK Survey System',
    category: 'Survey Equipment',
    brand: 'Trimble',
    model: 'R10 Base & Rover',
    year: 2021,
    condition: 'Excellent',
    specs: {
      'GPS channels': '440 channels',
      'Accuracy': '8mm Horizontal / 15mm Vertical',
      'Radio': 'Internal 450 MHz UHF transmitter',
      'Controller': 'Trimble TSC3 included'
    },
    rent_daily: 25000,
    rent_weekly: 160000,
    rent_monthly: 600000,
    purchase_price: 3200000,
    includes_operator: false,
    operator_rate: 0,
    mobilisation_fee: 10000,
    min_rental_days: 1,
    location_states: ['Lagos', 'Ogun', 'Oyo', 'Ondo', 'Edo', 'Delta', 'Anambra', 'Enugu', 'Rivers', 'Cross River', 'FCT Abuja', 'Kano', 'Kaduna'], // Nationwide
    location_city: 'Surulere',
    status: 'Available',
    rating: 4.8,
    reviews_count: 19,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  }
];

const SEED_LABOUR_PROFILES: LabourProfile[] = [
  {
    id: 'lab-1',
    user_id: 'usr_lab_1',
    fullName: 'Emeka Nwosu',
    gender: 'Male',
    trade: 'Bricklayers & Blocklayers',
    experience_years: 8,
    daily_rate: 15000,
    skills: ['Load-bearing bricklaying', 'Formwork setup', 'Staircase reinforcement casting', 'Plastering'],
    availability: true,
    location_state: 'Lagos',
    location_city: 'Yaba',
    bio: 'Dedicated master bricklayer with over 8 years experience building residential and commercial structures in Lagos. Extremely disciplined, fast, and compliant with site safety standards.',
    rating: 4.9,
    reviews_count: 54,
    projects_completed: 42,
    portfolio_photos: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400'],
    certifications: ['National Trade Test Grade I (Masonry)', 'OSHA Basic Safety Certificate']
  },
  {
    id: 'lab-2',
    user_id: 'usr_lab_2',
    fullName: 'Fatima Yusuf',
    gender: 'Female',
    trade: 'Electricians',
    experience_years: 6,
    daily_rate: 18000,
    skills: ['Conduit electrical piping', 'Breaker board wiring', 'Inverter installation', 'Smart-home fittings'],
    availability: true,
    location_state: 'Abuja',
    location_city: 'Wuse 2',
    bio: 'Certified female electrical technician specializing in modern conduit wiring, solar backup designs, and residential distribution boards. Detail-oriented and safety-conscious.',
    rating: 4.8,
    reviews_count: 36,
    projects_completed: 29,
    portfolio_photos: ['https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400'],
    certifications: ['NABTEB Advanced Certificate (Electrical Installation)', 'NSE Vocational Training Vetted']
  },
  {
    id: 'lab-3',
    user_id: 'usr_lab_3',
    fullName: 'Chukwu Obi',
    gender: 'Male',
    trade: 'Carpenters & Joiners',
    experience_years: 10,
    daily_rate: 12000,
    skills: ['Roof truss construction', 'Timber formwork erection', 'Hardwood door fixing', 'Ceiling nogging'],
    availability: true,
    location_state: 'Lagos',
    location_city: 'Ikorodu',
    bio: 'Veteran carpenter with 10 years of experience on major building roofings and concrete casting wood frameworks across Ogun and Lagos. Prompt delivery and high-strength woodwork.',
    rating: 4.7,
    reviews_count: 61,
    projects_completed: 68,
    portfolio_photos: ['https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&q=80&w=400'],
    certifications: ['Trade Test Certificate Grade II', 'Safety-on-Scaffold Vetted']
  },
  {
    id: 'lab-4',
    user_id: 'usr_lab_4',
    fullName: 'Ngozi Eze',
    gender: 'Female',
    trade: 'Tilers & Flooring',
    experience_years: 5,
    daily_rate: 14000,
    skills: ['Porcelain tile laying', 'Epoxy flooring coatings', 'Granite slab mounting', 'Screeding alignment'],
    availability: true,
    location_state: 'Enugu',
    location_city: 'Ogubia',
    bio: 'Professional female tiling and flooring expert. Famous for clean alignments, minimal tile wastage, and stunning epoxy layouts for residential parlours and office lobbies.',
    rating: 4.9,
    reviews_count: 24,
    projects_completed: 18,
    portfolio_photos: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400'],
    certifications: ['Vocational Training Institute Enugu (Flooring Design)']
  },
  {
    id: 'lab-5',
    user_id: 'usr_lab_5',
    fullName: 'Musa Ibrahim',
    gender: 'Male',
    trade: 'Plumbers',
    experience_years: 7,
    daily_rate: 16000,
    skills: ['PPR fusion welding', 'Sewer pipe laying', 'Water pump systems', 'Sanitary fittings'],
    availability: true,
    location_state: 'Kano',
    location_city: 'Nassarawa',
    bio: 'Experienced plumbing technician specializing in pressure-tested PN20 PPR networks, leakproofing, and bathroom premium shower systems. Fast, efficient, and reliable.',
    rating: 4.6,
    reviews_count: 42,
    projects_completed: 37,
    portfolio_photos: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400'],
    certifications: ['Federal Ministry of Labour Trade Test I (Plumbing)']
  },
  {
    id: 'lab-6',
    user_id: 'usr_lab_6',
    fullName: 'Adaobi Okonkwo',
    gender: 'Female',
    trade: 'Painters & Decorators',
    experience_years: 4,
    daily_rate: 10000,
    skills: ['Screeding wallpaper prep', 'Matte & Gloss applications', 'Exterior texturing', 'Colour pairing consult'],
    availability: true,
    location_state: 'Lagos',
    location_city: 'Surulere',
    bio: 'Artistic exterior and interior house painter. Focused on delivering elegant, smooth screeded finishes and long-lasting textured coats. Quick response and clean work environment.',
    rating: 4.9,
    reviews_count: 20,
    projects_completed: 15,
    portfolio_photos: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=400'],
    certifications: ['Creative Arts & Design Vocational School Graduate']
  },
  {
    id: 'lab-7',
    user_id: 'usr_lab_7',
    fullName: 'Tunde Adeyemi',
    gender: 'Male',
    trade: 'Steel Fixers',
    experience_years: 12,
    daily_rate: 20000,
    skills: ['Iron rod bending & linking', 'Slab mesh design', 'Beam shear-link binding', 'Blueprints reading'],
    availability: true,
    location_state: 'Lagos',
    location_city: 'Lekki',
    bio: 'Master Iron Bender / Steel Fixer with 12 years of structural experience on multi-story columns and bridges. Accurate reinforcement spacing and wire-tight couplings matching engineering specifications.',
    rating: 4.9,
    reviews_count: 76,
    projects_completed: 82,
    portfolio_photos: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400'],
    certifications: ['Trade Test Grade I (Steel Reinforcements)']
  },
  {
    id: 'lab-8',
    user_id: 'usr_lab_8',
    fullName: 'Hauwa Sule',
    gender: 'Female',
    trade: 'Heavy Equipment Operators',
    experience_years: 9,
    daily_rate: 13000,
    skills: ['Excavator digging & grading', 'Bulldozer levelling', 'Site supervisor coordination', 'Equipment safety checks'],
    availability: true,
    location_state: 'Abuja',
    location_city: 'Gwagwalada',
    bio: 'Elite female heavy machinery operator specializing in hydraulic excavators and earth grading. Certified, safety-oriented, with over 9 years operating on complex engineering sites.',
    rating: 4.9,
    reviews_count: 32,
    projects_completed: 40,
    portfolio_photos: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400'],
    certifications: ['Federal Ministry of Transportation Heavy Equipment License', 'First Aid Safety First Responder']
  }
];

// HELPER FOR SEEDING
function seedAllData() {
  if (!localStorage.getItem(M_KEYS.MATERIALS)) {
    localStorage.setItem(M_KEYS.MATERIALS, JSON.stringify(SEED_MATERIALS));
  }
  if (!localStorage.getItem(M_KEYS.P2P_LISTINGS)) {
    localStorage.setItem(M_KEYS.P2P_LISTINGS, JSON.stringify(SEED_P2P_LISTINGS));
  }
  if (!localStorage.getItem(M_KEYS.EQUIPMENT)) {
    localStorage.setItem(M_KEYS.EQUIPMENT, JSON.stringify(SEED_EQUIPMENT));
  }
  if (!localStorage.getItem(M_KEYS.LABOUR_PROFILES)) {
    localStorage.setItem(M_KEYS.LABOUR_PROFILES, JSON.stringify(SEED_LABOUR_PROFILES));
  }
  if (!localStorage.getItem(M_KEYS.P2P_OFFERS)) {
    localStorage.setItem(M_KEYS.P2P_OFFERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(M_KEYS.EQUIPMENT_BOOKINGS)) {
    localStorage.setItem(M_KEYS.EQUIPMENT_BOOKINGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(M_KEYS.LABOUR_BOOKINGS)) {
    localStorage.setItem(M_KEYS.LABOUR_BOOKINGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(M_KEYS.CART)) {
    localStorage.setItem(M_KEYS.CART, JSON.stringify([]));
  }
  if (!localStorage.getItem(M_KEYS.ORDERS)) {
    localStorage.setItem(M_KEYS.ORDERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(M_KEYS.ORDER_ITEMS)) {
    localStorage.setItem(M_KEYS.ORDER_ITEMS, JSON.stringify([]));
  }
  if (!localStorage.getItem(M_KEYS.ORDER_RETURNS)) {
    localStorage.setItem(M_KEYS.ORDER_RETURNS, JSON.stringify([]));
  }
  if (!localStorage.getItem(M_KEYS.WISHLIST)) {
    localStorage.setItem(M_KEYS.WISHLIST, JSON.stringify([]));
  }
  if (!localStorage.getItem(M_KEYS.REVIEWS)) {
    localStorage.setItem(M_KEYS.REVIEWS, JSON.stringify([]));
  }
}

// PHASE 2 REWIRE: seeding disabled — real data now lives in Supabase,
// not localStorage. seedAllData() is left defined above but unused.
import { supabase } from './supabaseClient';

const mapLabourProfileRow = (row: any): LabourProfile => {
  const { full_name, ...rest } = row;
  return { ...rest, fullName: full_name } as LabourProfile;
};

// DATA LAYER — now backed by real Supabase tables. Every method here is
// async: any page calling these MUST use await (see the 5 files updated
// alongside this one: EngineeringMaterialsPage, EquipmentMarketplacePage,
// LabourMarketplacePage, MarketplaceCart, CustomerDashboardSubpages).
export const mDb = {
  // 1. MATERIALS MARKETPLACE
  getMaterials: async (): Promise<MaterialProduct[]> => {
    const { data, error } = await supabase.from('material_products').select('*').order('created_at', { ascending: false });
    return error || !data ? [] : (data as MaterialProduct[]);
  },
  getMaterialById: async (id: string): Promise<MaterialProduct | undefined> => {
    const { data, error } = await supabase.from('material_products').select('*').eq('id', id).single();
    return error || !data ? undefined : (data as MaterialProduct);
  },

  // 2. P2P MARKETPLACE
  getP2PListings: async (): Promise<MarketplaceListing[]> => {
    const { data, error } = await supabase.from('marketplace_listings').select('*').order('created_at', { ascending: false });
    return error || !data ? [] : (data as MarketplaceListing[]);
  },
  getP2PListingById: async (id: string): Promise<MarketplaceListing | undefined> => {
    const { data, error } = await supabase.from('marketplace_listings').select('*').eq('id', id).single();
    return error || !data ? undefined : (data as MarketplaceListing);
  },
  addP2PListing: async (listing: Omit<MarketplaceListing, 'id' | 'views' | 'saves' | 'created_at'>): Promise<MarketplaceListing> => {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert({ ...listing, views: 0, saves: 0 })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to create listing.');
    return data as MarketplaceListing;
  },
  incrementP2PViews: async (id: string) => {
    const { data } = await supabase.from('marketplace_listings').select('views').eq('id', id).single();
    if (data) {
      await supabase.from('marketplace_listings').update({ views: (data.views || 0) + 1 }).eq('id', id);
    }
  },

  // Offers
  getOffersByListing: async (listingId: string): Promise<MarketplaceOffer[]> => {
    const { data, error } = await supabase.from('marketplace_offers').select('*').eq('listing_id', listingId).order('created_at', { ascending: false });
    return error || !data ? [] : (data as MarketplaceOffer[]);
  },
  submitOffer: async (offer: Omit<MarketplaceOffer, 'id' | 'status' | 'created_at'>): Promise<MarketplaceOffer> => {
    const { data, error } = await supabase
      .from('marketplace_offers')
      .insert({ ...offer, status: 'Pending' })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to submit offer.');
    return data as MarketplaceOffer;
  },
  updateOfferStatus: async (offerId: string, status: 'Accepted' | 'Declined' | 'Countered', counter_amount?: number) => {
    const patch: Record<string, any> = { status };
    if (counter_amount !== undefined) patch.counter_amount = counter_amount;

    const { data, error } = await supabase.from('marketplace_offers').update(patch).eq('id', offerId).select().single();
    if (error || !data) return;

    if (status === 'Accepted') {
      await supabase.from('marketplace_listings').update({ status: 'Sold' }).eq('id', data.listing_id);
    }
  },

  // 3. EQUIPMENT MARKETPLACE
  getEquipment: async (): Promise<EquipmentListing[]> => {
    const { data, error } = await supabase.from('equipment_listings').select('*').order('created_at', { ascending: false });
    return error || !data ? [] : (data as EquipmentListing[]);
  },
  getEquipmentById: async (id: string): Promise<EquipmentListing | undefined> => {
    const { data, error } = await supabase.from('equipment_listings').select('*').eq('id', id).single();
    return error || !data ? undefined : (data as EquipmentListing);
  },
  addEquipment: async (eq: Omit<EquipmentListing, 'id' | 'rating' | 'reviews_count' | 'created_at'>): Promise<EquipmentListing> => {
    const { data, error } = await supabase
      .from('equipment_listings')
      .insert({ ...eq, rating: 5.0, reviews_count: 0 })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to add equipment.');
    return data as EquipmentListing;
  },

  // Equipment bookings
  getEquipmentBookings: async (): Promise<EquipmentBooking[]> => {
    const { data, error } = await supabase.from('equipment_bookings').select('*').order('created_at', { ascending: false });
    return error || !data ? [] : (data as EquipmentBooking[]);
  },
  addEquipmentBooking: async (booking: Omit<EquipmentBooking, 'id' | 'created_at' | 'status' | 'escrow_status'>): Promise<EquipmentBooking> => {
    const { data, error } = await supabase
      .from('equipment_bookings')
      .insert({ ...booking, status: 'Pending Confirmation', escrow_status: 'Held' })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to book equipment.');
    return data as EquipmentBooking;
  },
  updateEquipmentBookingStatus: async (id: string, status: 'Confirmed' | 'Active Rental' | 'Completed' | 'Declined', escrow_status?: 'Released' | 'Refunded') => {
    const patch: Record<string, any> = { status };
    if (escrow_status) patch.escrow_status = escrow_status;

    const { data, error } = await supabase.from('equipment_bookings').update(patch).eq('id', id).select().single();
    if (error || !data) return;

    if (status === 'Confirmed' || status === 'Active Rental') {
      await supabase.from('equipment_listings').update({ status: 'Rented' }).eq('id', data.equipment_id);
    } else if (status === 'Completed' || status === 'Declined') {
      await supabase.from('equipment_listings').update({ status: 'Available' }).eq('id', data.equipment_id);
    }
  },

  // 4. SKILLED LABOUR MARKETPLACE
  // Note: the DB column is full_name (snake_case, consistent with every
  // other table) but the app's LabourProfile interface uses fullName —
  // these helpers translate at the boundary.
  getLabourProfiles: async (): Promise<LabourProfile[]> => {
    const { data, error } = await supabase.from('labour_profiles').select('*');
    return error || !data ? [] : data.map(mapLabourProfileRow);
  },
  getLabourProfileById: async (id: string): Promise<LabourProfile | undefined> => {
    const { data, error } = await supabase.from('labour_profiles').select('*').eq('id', id).single();
    return error || !data ? undefined : mapLabourProfileRow(data);
  },
  getLabourProfileByUserId: async (userId: string): Promise<LabourProfile | undefined> => {
    const { data, error } = await supabase.from('labour_profiles').select('*').eq('user_id', userId).single();
    return error || !data ? undefined : mapLabourProfileRow(data);
  },
  addLabourProfile: async (p: Omit<LabourProfile, 'id' | 'rating' | 'reviews_count' | 'projects_completed' | 'portfolio_photos' | 'certifications'>): Promise<LabourProfile> => {
    const { fullName, ...rest } = p;
    const { data, error } = await supabase
      .from('labour_profiles')
      .insert({ ...rest, full_name: fullName, rating: 5.0, reviews_count: 0, projects_completed: 0, portfolio_photos: [], certifications: [] })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to create labour profile.');
    return mapLabourProfileRow(data);
  },
  updateLabourProfile: async (id: string, updates: Partial<LabourProfile>) => {
    const { fullName, ...rest } = updates;
    const patch: Record<string, any> = { ...rest };
    if (fullName !== undefined) patch.full_name = fullName;
    await supabase.from('labour_profiles').update(patch).eq('id', id);
  },

  // Labour bookings
  getLabourBookings: async (): Promise<LabourBooking[]> => {
    const { data, error } = await supabase.from('labour_bookings').select('*').order('created_at', { ascending: false });
    return error || !data ? [] : (data as LabourBooking[]);
  },
  addLabourBooking: async (booking: Omit<LabourBooking, 'id' | 'created_at' | 'status' | 'escrow_status'>): Promise<LabourBooking> => {
    const { data, error } = await supabase
      .from('labour_bookings')
      .insert({ ...booking, status: 'Pending', escrow_status: 'Held' })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to book labour.');
    return data as LabourBooking;
  },
  updateLabourBookingStatus: async (id: string, status: 'Active' | 'Completed' | 'Cancelled', escrow_status?: 'Released' | 'Refunded') => {
    const patch: Record<string, any> = { status };
    if (escrow_status) patch.escrow_status = escrow_status;

    const { data, error } = await supabase.from('labour_bookings').update(patch).eq('id', id).select().single();
    if (error || !data) return;

    if (status === 'Completed') {
      const { data: profile } = await supabase.from('labour_profiles').select('projects_completed').eq('id', data.worker_id).single();
      if (profile) {
        await supabase.from('labour_profiles').update({ projects_completed: (profile.projects_completed || 0) + 1 }).eq('id', data.worker_id);
      }
    }
  },

  // 5. SHOPPING CART
  getCart: async (userId: string): Promise<CartItem[]> => {
    const { data, error } = await supabase.from('cart_items').select('*').eq('user_id', userId);
    return error || !data ? [] : (data as CartItem[]);
  },
  addToCart: async (userId: string, itemId: string, type: 'material' | 'marketplace', price: number, qty: number = 1) => {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('item_type', type)
      .eq('saved_for_later', false)
      .maybeSingle();

    if (existing) {
      await supabase.from('cart_items').update({ quantity: existing.quantity + qty }).eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({
        user_id: userId,
        item_id: itemId,
        item_type: type,
        price,
        quantity: qty,
        saved_for_later: false,
      });
    }
  },
  updateCartQty: async (userId: string, cartId: string, qty: number) => {
    if (qty <= 0) {
      await supabase.from('cart_items').delete().eq('id', cartId).eq('user_id', userId);
    } else {
      await supabase.from('cart_items').update({ quantity: qty }).eq('id', cartId).eq('user_id', userId);
    }
  },
  removeFromCart: async (userId: string, cartId: string) => {
    await supabase.from('cart_items').delete().eq('id', cartId).eq('user_id', userId);
  },
  toggleSaveForLater: async (userId: string, cartId: string) => {
    const { data: item } = await supabase.from('cart_items').select('saved_for_later').eq('id', cartId).eq('user_id', userId).single();
    if (item) {
      await supabase.from('cart_items').update({ saved_for_later: !item.saved_for_later }).eq('id', cartId);
    }
  },
  clearCart: async (userId: string) => {
    await supabase.from('cart_items').delete().eq('user_id', userId);
  },

  // 6. ORDERS & FULFILLMENT
  getOrders: async (): Promise<Order[]> => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    return error || !data ? [] : (data as Order[]);
  },
  getOrderItems: async (): Promise<OrderItem[]> => {
    const { data, error } = await supabase.from('order_items').select('*');
    return error || !data ? [] : (data as OrderItem[]);
  },
  createOrder: async (
    order: Omit<Order, 'id' | 'created_at' | 'payment_status' | 'escrow_status' | 'delivery_timeline'>,
    items: Omit<OrderItem, 'id' | 'order_id' | 'delivery_status'>[]
  ): Promise<Order> => {
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        ...order,
        payment_status: 'Paid',
        escrow_status: 'Held',
        delivery_timeline: [
          { status: 'Order Placed', note: 'Order placed securely and payment received via escrow channel.', created_at: new Date().toISOString() },
        ],
      })
      .select()
      .single();

    if (orderErr || !newOrder) throw new Error(orderErr?.message || 'Failed to create order.');

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(items.map((item) => ({ ...item, order_id: newOrder.id, delivery_status: 'Order Placed' })));

    if (itemsErr) throw new Error(itemsErr.message);

    return newOrder as Order;
  },
  updateOrderItemStatus: async (itemId: string, status: OrderItem['delivery_status'], note: string = '') => {
    const { data: item, error } = await supabase.from('order_items').update({ delivery_status: status }).eq('id', itemId).select().single();
    if (error || !item) return;

    const { data: order } = await supabase.from('orders').select('*').eq('id', item.order_id).single();
    if (!order) return;

    const timeline = [...(order.delivery_timeline || [])];
    timeline.push({
      status: `${item.product_name}: ${status}`,
      note: note || `Delivery status changed to ${status}`,
      created_at: new Date().toISOString(),
    });

    const { data: allItems } = await supabase.from('order_items').select('delivery_status').eq('order_id', item.order_id);
    const allDelivered = (allItems || []).every((i: any) => i.delivery_status === 'Delivered');
    if (allDelivered) {
      timeline.push({
        status: 'Delivered',
        note: 'All items in this order have been successfully delivered to your site. Confirm delivery in dashboard to release escrow.',
        created_at: new Date().toISOString(),
      });
    }

    await supabase.from('orders').update({ delivery_timeline: timeline }).eq('id', item.order_id);
  },
  confirmOrderDelivery: async (orderId: string) => {
    const { data: order } = await supabase.from('orders').select('delivery_timeline').eq('id', orderId).single();
    if (!order) return;

    const timeline = [...(order.delivery_timeline || [])];
    timeline.push({
      status: 'Delivery Confirmed',
      note: 'Customer confirmed complete physical delivery. Escrow funds have been successfully released to the suppliers.',
      created_at: new Date().toISOString(),
    });

    await supabase.from('orders').update({ escrow_status: 'Released', delivery_timeline: timeline }).eq('id', orderId);
    await supabase.from('order_items').update({ delivery_status: 'Delivered' }).eq('order_id', orderId);
  },

  // Returns
  getReturns: async (): Promise<OrderReturn[]> => {
    const { data, error } = await supabase.from('order_returns').select('*').order('created_at', { ascending: false });
    return error || !data ? [] : (data as OrderReturn[]);
  },
  submitReturnRequest: async (orderId: string, reason: string, description: string): Promise<OrderReturn> => {
    const { data: newReturn, error } = await supabase
      .from('order_returns')
      .insert({ order_id: orderId, reason, description, status: 'Pending Review' })
      .select()
      .single();

    if (error || !newReturn) throw new Error(error?.message || 'Failed to submit return request.');

    const { data: order } = await supabase.from('orders').select('delivery_timeline').eq('id', orderId).single();
    if (order) {
      const timeline = [...(order.delivery_timeline || [])];
      timeline.push({
        status: 'Return Filed',
        note: `Dispute/Return requested for: "${reason}". Escrow payment frozen awaiting admin mediation.`,
        created_at: new Date().toISOString(),
      });
      await supabase.from('orders').update({ escrow_status: 'Disputed', delivery_timeline: timeline }).eq('id', orderId);
    }

    return newReturn as OrderReturn;
  },
  updateReturnStatus: async (returnId: string, status: OrderReturn['status']) => {
    const { data: ret, error } = await supabase.from('order_returns').update({ status }).eq('id', returnId).select().single();
    if (error || !ret) return;

    const { data: order } = await supabase.from('orders').select('delivery_timeline').eq('id', ret.order_id).single();
    if (!order) return;

    const timeline = [...(order.delivery_timeline || [])];
    if (status === 'Refunded') {
      timeline.push({
        status: 'Refund Processed',
        note: "Admin verified dispute and refunded total escrow payment to customer's wallet.",
        created_at: new Date().toISOString(),
      });
      await supabase.from('orders').update({ escrow_status: 'Refunded', delivery_timeline: timeline }).eq('id', ret.order_id);
    } else if (status === 'Rejected') {
      timeline.push({
        status: 'Dispute Rejected',
        note: 'Admin dismissed return claim. Escrow payment released fully to the suppliers.',
        created_at: new Date().toISOString(),
      });
      await supabase.from('orders').update({ escrow_status: 'Released', delivery_timeline: timeline }).eq('id', ret.order_id);
    }
  },

  // 7. WISHLIST
  getWishlist: async (userId: string): Promise<WishlistItem[]> => {
    const { data, error } = await supabase.from('wishlist_items').select('*').eq('user_id', userId);
    return error || !data ? [] : (data as WishlistItem[]);
  },
  addToWishlist: async (userId: string, itemId: string, type: WishlistItem['item_type'], price: number) => {
    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('item_type', type)
      .maybeSingle();

    if (!existing) {
      await supabase.from('wishlist_items').insert({ user_id: userId, item_id: itemId, item_type: type, price_at_save: price });
    }
  },
  removeFromWishlist: async (userId: string, itemId: string) => {
    await supabase.from('wishlist_items').delete().eq('user_id', userId).eq('item_id', itemId);
  },

  // 8. REVIEWS
  getReviewsByEntity: async (entityId: string, type: ProductReview['entity_type']): Promise<ProductReview[]> => {
    const { data, error } = await supabase.from('product_reviews').select('*').eq('entity_id', entityId).eq('entity_type', type).order('created_at', { ascending: false });
    return error || !data ? [] : (data as ProductReview[]);
  },
  addReview: async (review: Omit<ProductReview, 'id' | 'created_at'>): Promise<ProductReview> => {
    const { data: newReview, error } = await supabase.from('product_reviews').insert(review).select().single();
    if (error || !newReview) throw new Error(error?.message || 'Failed to submit review.');

    // Recompute aggregate rating on the reviewed entity
    const { data: entityReviews } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('entity_id', review.entity_id)
      .eq('entity_type', review.entity_type);

    if (entityReviews && entityReviews.length > 0) {
      const total = entityReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
      const avg = parseFloat((total / entityReviews.length).toFixed(1));
      const table = review.entity_type === 'material' ? 'material_products' : review.entity_type === 'equipment' ? 'equipment_listings' : review.entity_type === 'labour' ? 'labour_profiles' : null;
      if (table) {
        await supabase.from(table).update({ rating: avg, reviews_count: entityReviews.length }).eq('id', review.entity_id);
      }
    }

    return newReview as ProductReview;
  },
};
