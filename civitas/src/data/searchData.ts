export interface SearchResultItem {
  id: string;
  name: string;
  category: 'House Plans' | 'Professionals' | 'Materials' | 'Equipment' | 'Jobs' | 'Articles';
  meta: string;
  price?: string;
  linkTab?: string;
  details?: string;
}

export const GLOBAL_SEARCH_DATA: SearchResultItem[] = [
  // 1. House Plans (12 PLANS matching prompt 6 prices exactly!)
  {
    id: 'hp-1',
    name: '2-Bedroom Bungalow, Lekki Style',
    category: 'House Plans',
    meta: 'Modern flat roof bungalow ideal for tight plots.',
    price: '₦35,000,000',
    linkTab: 'House Plans',
    details: '2 Bed | 2 Bath | 120 sqm plot'
  },
  {
    id: 'hp-2',
    name: '3-Bedroom Terrace Duplex',
    category: 'House Plans',
    meta: 'Elegant, space-optimized contemporary terrace duplex.',
    price: '₦55,000,000',
    linkTab: 'House Plans',
    details: '3 Bed | 4 Bath | 180 sqm plot'
  },
  {
    id: 'hp-3',
    name: '4-Bedroom Detached Duplex',
    category: 'House Plans',
    meta: 'Spacious detached family duplex with contemporary facade.',
    price: '₦95,000,000',
    linkTab: 'House Plans',
    details: '4 Bed | 5 Bath | 450 sqm plot'
  },
  {
    id: 'hp-4',
    name: '5-Bedroom Luxury Villa',
    category: 'House Plans',
    meta: 'Elite custom villa with massive double-height living room.',
    price: '₦220,000,000',
    linkTab: 'House Plans',
    details: '5 Bed | 6 Bath | 600 sqm plot'
  },
  {
    id: 'hp-5',
    name: '3-Bedroom Semi-Detached',
    category: 'House Plans',
    meta: 'Premium semi-detached duplex design, highly cost-efficient.',
    price: '₦65,000,000',
    linkTab: 'House Plans',
    details: '3 Bed | 4 Bath | 300 sqm plot'
  },
  {
    id: 'hp-6',
    name: '6-Bedroom Mansion, Ikoyi Style',
    category: 'House Plans',
    meta: 'State-of-the-art ultimate luxury architectural design.',
    price: '₦450,000,000',
    linkTab: 'House Plans',
    details: '6 Bed | 7 Bath | 1000 sqm plot with swimming pool'
  },
  {
    id: 'hp-7',
    name: '2-Bedroom Apartment',
    category: 'House Plans',
    meta: 'Sleek structural design optimized for low-cost construction blocks.',
    price: '₦28,000,000',
    linkTab: 'House Plans',
    details: '2 Bed | 2 Bath | Multi-family option'
  },
  {
    id: 'hp-8',
    name: '4-Bedroom Terrace with BQ',
    category: 'House Plans',
    meta: 'Modern design with separate boy\'s quarters unit.',
    price: '₦110,000,000',
    linkTab: 'House Plans',
    details: '4 Bed | 5 Bath | BQ included'
  },
  {
    id: 'hp-9',
    name: '3-Bedroom Bungalow with Solar',
    category: 'House Plans',
    meta: 'Eco-friendly smart home setup with complete solar design integration.',
    price: '₦52,000,000',
    linkTab: 'House Plans',
    details: '3 Bed | 3 Bath | Fully off-grid configuration'
  },
  {
    id: 'hp-10',
    name: '5-Bedroom Duplex with Pool',
    category: 'House Plans',
    meta: 'Magnificent detached architectural drawings with private pool deck.',
    price: '₦280,000,000',
    linkTab: 'House Plans',
    details: '5 Bed | 6 Bath | Pool | Smart features'
  },
  {
    id: 'hp-11',
    name: 'Studio Apartment',
    category: 'House Plans',
    meta: 'High density, highly commercial layout for real estate developers.',
    price: '₦18,000,000',
    linkTab: 'House Plans',
    details: 'Studio units | Ideal for investment'
  },
  {
    id: 'hp-12',
    name: '4-Bedroom Smart Home',
    category: 'House Plans',
    meta: 'Advanced technology-integrated luxury residential plans.',
    price: '₦145,000,000',
    linkTab: 'House Plans',
    details: '4 Bed | 4 Bath | Home Automation'
  },

  // 2. Professionals
  {
    id: 'prof-1',
    name: 'Engr. Kola Adeyemi',
    category: 'Professionals',
    meta: 'Structural Engineer • COREN-R-38491 • Lagos',
    price: '₦25,000 / hr',
    linkTab: 'Hire Professionals',
    details: '12 Years Experience • Specializes in Raft and Pile foundations in Lekki soil.'
  },
  {
    id: 'prof-2',
    name: 'Arc. Amina Nwosu',
    category: 'Professionals',
    meta: 'Registered Architect • ARCON-F-29381 • Abuja',
    price: '₦20,000 / hr',
    linkTab: 'Hire Professionals',
    details: '8 Years Experience • Specializes in contemporary residential and luxury villas.'
  },
  {
    id: 'prof-3',
    name: 'Mr. Chidi Obi',
    category: 'Professionals',
    meta: 'Vetted Quantity Surveyor • NIQS Registered • Port Harcourt',
    price: '₦15,000 / hr',
    linkTab: 'Hire Professionals',
    details: '10 Years Experience • Expert Bill of Quantities (BOQ) preparation.'
  },
  {
    id: 'prof-4',
    name: 'Engr. Tayo Balogun',
    category: 'Professionals',
    meta: 'Mechanical & Electrical Engineer • COREN Vetted • Lagos',
    price: '₦18,000 / hr',
    linkTab: 'Hire Professionals',
    details: '9 Years Experience • High-efficiency solar and smart control grids.'
  },

  // 3. Materials
  {
    id: 'mat-1',
    name: 'Dangote Cement Grade 42.5R',
    category: 'Materials',
    meta: 'High-strength Portland cement for structural casting.',
    price: '₦8,200 / bag',
    details: 'Bulk deliveries across Lagos, Ogun, and Ibadan.'
  },
  {
    id: 'mat-2',
    name: '16mm Reinforcement Iron Rods (TMT)',
    category: 'Materials',
    meta: 'High-tensile steel reinforcement rods for slabs and pillars.',
    price: '₦780,000 / ton',
    details: 'Local standard certified by Standards Organisation of Nigeria (SON).'
  },
  {
    id: 'mat-3',
    name: 'Coleman 1.5mm Single Core Copper Wire',
    category: 'Materials',
    meta: 'Premium flame-retardant electrical copper wiring.',
    price: '₦32,000 / coil',
    details: 'Fully certified Coleman Nigeria distributor.'
  },
  {
    id: 'mat-4',
    name: 'Royal Ceramic Floor Tiles 60x60',
    category: 'Materials',
    meta: 'Sturdy polished vitrified ceramic tiles for luxury finishing.',
    price: '₦12,500 / pack',
    details: 'Available in diverse light grey and off-white patterns.'
  },

  // 4. Equipment
  {
    id: 'eq-1',
    name: 'Caterpillar 320D Excavator',
    category: 'Equipment',
    meta: 'Heavy-duty crawler excavator for site clearing and foundations.',
    price: '₦350,000 / day',
    details: 'Includes experienced operator and mobilization to site.'
  },
  {
    id: 'eq-2',
    name: 'Mikano 150kVA Soundproof Generator',
    category: 'Equipment',
    meta: 'Stable standby diesel power supply generator.',
    price: '₦120,000 / day',
    details: 'Ideal for major commercial site operations.'
  },
  {
    id: 'eq-3',
    name: 'Concrete Mixer Machine (Diesel)',
    category: 'Equipment',
    meta: 'Portable heavy-duty site mechanical concrete mixer.',
    price: '₦35,000 / day',
    details: '500-liter drum capacity, highly reliable fuel economy.'
  },

  // 5. Jobs
  {
    id: 'job-1',
    name: 'Structural Site Supervisor',
    category: 'Jobs',
    meta: 'Lekki Phase I Project • Full Time • ₦350,000/month',
    details: 'Requires 4+ years supervising sand-filled raft foundation castings.'
  },
  {
    id: 'job-2',
    name: 'Quantity Surveyor Consultant',
    category: 'Jobs',
    meta: 'Ikeja Mall Renovation • Contract • ₦500,000 total',
    details: 'Audit material supply deliveries and prepare variation sheets.'
  },

  // 6. Articles
  {
    id: 'art-1',
    name: 'Understanding LASBCA Building Permits in Lagos',
    category: 'Articles',
    meta: 'Critical guide to building control compliance in Lagos state.',
    details: 'Step-by-step documentation required for structural approval.'
  },
  {
    id: 'art-2',
    name: 'Cost of Foundations in Lekki: Raft vs. Piled Foundations',
    category: 'Articles',
    meta: 'Analyzing sub-soil load bearing limits and structural expenses.',
    details: 'Avoid collapse risk: why soil tests are mandatory for Lekki sandfills.'
  }
];
