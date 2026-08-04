import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Grid, List, Star, MapPin, Award, CheckCircle2, 
  Heart, ArrowRight, X, Phone, Mail, Calendar, MessageSquare, 
  ShieldCheck, AlertTriangle, ChevronRight, Upload, Info, Share2, 
  User, Check, DollarSign, ExternalLink
} from 'lucide-react';

// Custom Type Definitions
export interface Professional {
  id: string;
  name: string;
  profession: string;
  specialization: string;
  locationState: string;
  locationCity: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  startingRate: number; // in Naira (₦)
  verificationStatus: 'COREN' | 'ARCON' | 'NIOB' | 'MEA';
  avatar: string;
  skills: string[];
  gender: 'Male' | 'Female';
  bio: string;
  availability: 'Available Now' | 'Available This Week' | 'Busy';
  certifications: string[];
  education: string[];
  portfolio: { title: string; image: string; location: string }[];
  reviews: { author: string; rating: number; date: string; comment: string }[];
}

// 10 Vetted Nigerian Construction Professionals with inclusive representation (4 women)
export const PLACEHOLDER_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-1',
    name: 'Engr. Kola Adeyemi',
    profession: 'Structural Engineer',
    specialization: 'High-Rise & Reinforced Concrete Structures',
    locationState: 'Lagos',
    locationCity: 'Lekki',
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 42,
    completedProjects: 48,
    startingRate: 45000,
    verificationStatus: 'COREN',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    skills: ['Structural Modeling', 'Reinforced Concrete', 'Foundation Design'],
    gender: 'Male',
    bio: 'Engr. Kola has over 12 years of structural engineering design experience across Lagos and southwestern Nigeria. Specializes in multi-story residential towers, commercial offices, and deep pile foundation investigations.',
    availability: 'Available Now',
    certifications: ['COREN registered engineer (R. 32104)', 'NSE (Nigerian Society of Engineers) Member'],
    education: ['M.Eng in Structural Engineering - University of Lagos', 'B.Eng in Civil Engineering - Obafemi Awolowo University'],
    portfolio: [
      { title: 'Oakwood Apartments (Lekki)', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400', location: 'Lekki Phase 1, Lagos' },
      { title: 'The Vista Plaza', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400', location: 'Victoria Island, Lagos' }
    ],
    reviews: [
      { author: 'Alhaji Abdul Ibrahim', rating: 5, date: '2026-04-12', comment: 'Extremely professional calculations. The municipal engineering review board passed our drawings with zero comments.' },
      { author: 'Chief Femi Johnson', rating: 5, date: '2026-03-22', comment: 'Delivered our structural drawings on time and checked the site construction stages twice weekly.' }
    ]
  },
  {
    id: 'prof-2',
    name: 'Arc. Amina Nwosu',
    profession: 'Architect',
    specialization: 'Sustainable & Contemporary Residential Architecture',
    locationState: 'Abuja',
    locationCity: 'Wuse 2',
    experienceYears: 8,
    rating: 4.8,
    reviewsCount: 29,
    completedProjects: 34,
    startingRate: 38000,
    verificationStatus: 'ARCON',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    skills: ['Biophilic Design', '3D Visualisation', 'Sustainable Architecture'],
    gender: 'Female',
    bio: 'Arc. Amina Nwosu combines contemporary European-African aesthetics with high climate responsiveness. Known for designing luxury eco-friendly residences with cross-ventilation, natural cooling, and solar harvesting integrated.',
    availability: 'Available Now',
    certifications: ['ARCON Certified Architect (F-29403)', 'NIA (Nigerian Institute of Architects) Registered'],
    education: ['M.Arch - Ahmadu Bello University, Zaria', 'B.Sc Architecture - University of Nigeria, Nsukka'],
    portfolio: [
      { title: 'The Eco-Villa Resort', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400', location: 'Maitama, Abuja' },
      { title: 'Sunny Terraces', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400', location: 'Gwarinpa, Abuja' }
    ],
    reviews: [
      { author: 'Dr. Stella Okoye', rating: 5, date: '2026-05-18', comment: 'Amina turned our dream home idea into a masterpiece. Space planning is spectacular and natural light is phenomenal.' },
      { author: 'Emeka Uche', rating: 4, date: '2026-02-10', comment: 'Highly detailed floorplans. We have received so many compliments on our building exterior.' }
    ]
  },
  {
    id: 'prof-3',
    name: 'Engr. Chidi Okafor',
    profession: 'Civil Engineer',
    specialization: 'Civil Works & Road Networks',
    locationState: 'Rivers',
    locationCity: 'Port Harcourt',
    experienceYears: 10,
    rating: 4.7,
    reviewsCount: 31,
    completedProjects: 41,
    startingRate: 42000,
    verificationStatus: 'COREN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    skills: ['Site Drainage Systems', 'Road Construction', 'Civil Project Supervision'],
    gender: 'Male',
    bio: 'Specialist in heavy civil construction, highway pavement layers, site level layouts, and robust storm drainage channels across challenging Niger Delta terrains.',
    availability: 'Available This Week',
    certifications: ['COREN Registered Engineer (R. 29402)', 'NSE active member'],
    education: ['B.Eng in Civil Engineering - University of Port Harcourt'],
    portfolio: [
      { title: 'Industrial Park Pavement Network', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400', location: 'Trans-Amadi, Port Harcourt' }
    ],
    reviews: [
      { author: 'Grace Amadi', rating: 5, date: '2026-05-01', comment: 'Completed our estate access road and drainage system. Excellent leveling, no pooling of rain water whatsoever.' }
    ]
  },
  {
    id: 'prof-4',
    name: 'QS Fatima Bello',
    profession: 'Quantity Surveyor',
    specialization: 'Cost Estimation & Material Auditing',
    locationState: 'Lagos',
    locationCity: 'Ikeja',
    experienceYears: 7,
    rating: 4.6,
    reviewsCount: 18,
    completedProjects: 29,
    startingRate: 35000,
    verificationStatus: 'NIOB',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300',
    skills: ['Cost Estimation', 'Tender Documents', 'Material Takeoff'],
    gender: 'Female',
    bio: 'Fatima is a meticulous quantity surveyor protecting client developer margins. Expert at bill of quantities (BOQ) preparation, materials auditing, and vendor price arbitration.',
    availability: 'Available Now',
    certifications: ['NIQS Registered Member (M-48192)', 'NIOB Registered Quantity Surveyor'],
    education: ['B.Tech in Quantity Surveying - Federal University of Technology, Minna'],
    portfolio: [
      { title: 'Mataheko Estate Bill of Quantities', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400', location: 'Maryka, Lagos' }
    ],
    reviews: [
      { author: 'Engr. David Balogun', rating: 5, date: '2026-04-30', comment: 'Fatima saved us over ₦8,000,000 in material inflation hedges. She caught 3 massive billing errors in our contractor bid.' }
    ]
  },
  {
    id: 'prof-5',
    name: 'Engr. Taiwo Adekunle',
    profession: 'Mechanical Engineer',
    specialization: 'HVAC Design & Plumbing Infrastructure',
    locationState: 'Lagos',
    locationCity: 'Surulere',
    experienceYears: 9,
    rating: 4.8,
    reviewsCount: 22,
    completedProjects: 26,
    startingRate: 40000,
    verificationStatus: 'COREN',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    skills: ['HVAC Design', 'Plumbing Infrastructure', 'Fire Suppression Systems'],
    gender: 'Male',
    bio: 'Experienced mechanical systems designer. Focuses on silent, highly-efficient variable refrigerant volume (VRV) ventilation, high-pressure plumbing, water treatment integration, and automatic building sprinkler engineering.',
    availability: 'Available Now',
    certifications: ['COREN Registered (R. 38491)', 'NIMechE Member'],
    education: ['B.Eng in Mechanical Engineering - University of Ibadan'],
    portfolio: [
      { title: 'Surulere Medical Hub Plumbing', image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=400', location: 'Surulere, Lagos' }
    ],
    reviews: [
      { author: 'Dr. Sola Bakare', rating: 5, date: '2026-03-15', comment: 'Extremely clean plumbing designs. Water pressure calculations are perfect across all three floors.' }
    ]
  },
  {
    id: 'prof-6',
    name: 'Arc. Ngozi Eze',
    profession: 'Architect',
    specialization: 'Residential Interior Architecture & Spatial Planning',
    locationState: 'Enugu',
    locationCity: 'Independence Layout',
    experienceYears: 6,
    rating: 4.7,
    reviewsCount: 15,
    completedProjects: 20,
    startingRate: 32000,
    verificationStatus: 'ARCON',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    skills: ['Interior Architecture', 'Space Optimisation', 'Biophilic Styling'],
    gender: 'Female',
    bio: 'Arc. Ngozi designs striking open-concept modern interiors, maximizing natural lighting and combining local woods and structural steel for premium finishes.',
    availability: 'Available This Week',
    certifications: ['ARCON Certified Member', 'NIA Enugu Chapter secretary'],
    education: ['B.Sc in Architecture - University of Nigeria, Nsukka'],
    portfolio: [
      { title: 'Oakwood Office Lounge', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400', location: 'Independence Layout, Enugu' }
    ],
    reviews: [
      { author: 'Chukwuma Obi', rating: 5, date: '2026-05-10', comment: 'Beautiful spatial planning. Small plot size felt enormous due to her creative stairwell placement.' }
    ]
  },
  {
    id: 'prof-7',
    name: 'Engr. Emeka Okonkwo',
    profession: 'Geotechnical Engineer',
    specialization: 'Soil Mechanics & Deep Foundation Analysis',
    locationState: 'Lagos',
    locationCity: 'Ikeja',
    experienceYears: 15,
    rating: 4.9,
    reviewsCount: 50,
    completedProjects: 62,
    startingRate: 55000,
    verificationStatus: 'COREN',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    skills: ['Soil Testing', 'Deep Foundations', 'Borehole Logging'],
    gender: 'Male',
    bio: 'The authority on sandy peninsula geology, water table engineering, soil bearing capacity reports, and piling design checks across Lekki Phase 1, Ajah, and Lagos coastal areas.',
    availability: 'Busy',
    certifications: ['COREN Registered Consultant', 'AGS Member'],
    education: ['PhD in Geotechnical Engineering - Imperial College London', 'B.Eng Civil Engineering - University of Ibadan'],
    portfolio: [
      { title: 'Ajah Coast Pile Testing', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400', location: 'Ajah Coastal Drive, Lagos' }
    ],
    reviews: [
      { author: 'Lagos Land Developers Ltd', rating: 5, date: '2026-06-01', comment: 'Saved us from building on soft peat soil without the right dynamic load pile structure. Unmatched precision.' }
    ]
  },
  {
    id: 'prof-8',
    name: 'PM Suleiman Musa',
    profession: 'Project Manager',
    specialization: 'Construction Sequencing & Procurement Control',
    locationState: 'Abuja',
    locationCity: 'Garki',
    experienceYears: 11,
    rating: 4.9,
    reviewsCount: 38,
    completedProjects: 45,
    startingRate: 60000,
    verificationStatus: 'MEA',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    skills: ['Agile Construction', 'Risk Management', 'Material Logistics'],
    gender: 'Male',
    bio: 'PM Suleiman is a premier construction logistics coordinator. Specializes in multi-vendor coordination, tight project schedule management, and mitigating materials wastage.',
    availability: 'Available Now',
    certifications: ['PMP (Project Management Professional) Certified', 'MEA Verified Master Elite'],
    education: ['M.Sc Project Management - University of Port Harcourt', 'B.Tech Project Management - FUT Minna'],
    portfolio: [
      { title: 'Federal Secretariat Complex Rehab', image: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?auto=format&fit=crop&q=80&w=400', location: 'Central Area, Abuja' }
    ],
    reviews: [
      { author: 'Nuhu Ribadu', rating: 5, date: '2026-05-25', comment: 'Superb organization. Handled site conflicts between steel workers and masons with extreme maturity. Highly recommended!' }
    ]
  },
  {
    id: 'prof-9',
    name: 'Engr. Yetunde Fashola',
    profession: 'Electrical Engineer',
    specialization: 'High-Voltage Substations & Solar Smart Grids',
    locationState: 'Lagos',
    locationCity: 'Victoria Island',
    experienceYears: 8,
    rating: 4.8,
    reviewsCount: 24,
    completedProjects: 28,
    startingRate: 38000,
    verificationStatus: 'COREN',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=300',
    skills: ['Solar Smart Grids', 'Power Load Calculations', 'Smart Home Integration'],
    gender: 'Female',
    bio: 'Engr. Yetunde is a dynamic electrical engineer designing high-efficiency off-grid power distribution configurations and smart-home security systems.',
    availability: 'Available Now',
    certifications: ['COREN Registered Electrical Engineer', 'IEEE Nigeria power systems head'],
    education: ['B.Eng Electrical & Electronics Engineering - University of Ilorin'],
    portfolio: [
      { title: 'The Solis Tower Solar Microgrid', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=400', location: 'Oniru, Lagos' }
    ],
    reviews: [
      { author: 'Grace Properties', rating: 5, date: '2026-04-18', comment: 'Our residential block runs on 100% hybrid solar-inverter power, perfectly configured by Yetunde. Excellent load shedding controls.' }
    ]
  },
  {
    id: 'prof-10',
    name: 'Bldr. Hassan Ibrahim',
    profession: 'Builder',
    specialization: 'Structural Construction & Quality Execution',
    locationState: 'Kano',
    locationCity: 'Kano City',
    experienceYears: 5,
    rating: 4.5,
    reviewsCount: 12,
    completedProjects: 16,
    startingRate: 25000,
    verificationStatus: 'NIOB',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    skills: ['Building Execution', 'Site Supervision', 'Concrete Quality Tests'],
    gender: 'Male',
    bio: 'Bldr. Hassan focuses on bricklaying standards, site masonry testing, casting supervision, and ensuring structural works exactly match structural engineering blueprints.',
    availability: 'Available Now',
    certifications: ['NIOB Certified Builder (B-49201)', 'CORBON Registered'],
    education: ['B.Sc in Building - Bayero University Kano'],
    portfolio: [
      { title: 'Kano Plaza Annex Blockwork', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400', location: 'Kofar Nassarawa, Kano' }
    ],
    reviews: [
      { author: 'Imran Danbatta', rating: 4.5, date: '2026-05-15', comment: 'Meticulous builder. Monitored water-cement ratios strictly. No settlement cracks visible after a year.' }
    ]
  }
];

interface HireProfessionalsPageProps {
  onNavigate: (page: string) => void;
  selectedProfId?: string;
}

export const HireProfessionalsPage: React.FC<HireProfessionalsPageProps> = ({ onNavigate }) => {
  // Navigation & Details view State
  const [selectedProfId, setSelectedProfId] = useState<string | null>(null);
  
  // Grid/List toggle state
  const [isGridView, setIsGridView] = useState<boolean>(true);
  
  // Saved profiles list (Naira heart items) stored in LocalStorage for persistence
  const [savedProfiles, setSavedProfiles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mea_saved_professionals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [maxBudget, setMaxBudget] = useState<number>(100000);
  
  // Filter Modal (mobile)
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sorting State
  const [sortBy, setSortBy] = useState('Most Recommended');

  // Hire flow states
  const [isHireFlowOpen, setIsHireFlowOpen] = useState(false);
  const [hireStep, setHireStep] = useState(1);
  const [bookingFormData, setBookingFormData] = useState({
    serviceType: 'Full Project Management',
    customService: '',
    projectType: 'New Build',
    projectState: 'Lagos',
    projectCity: '',
    projectArea: '',
    description: '',
    startDate: '',
    duration: '3 Months',
    budgetMin: '500000',
    budgetMax: '5000000',
    documentName: '',
    agreeToTerms: false
  });
  const [bookingReference, setBookingReference] = useState('');

  // Persist saved profiles
  useEffect(() => {
    localStorage.setItem('mea_saved_professionals', JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  const toggleSaveProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedProfiles.includes(id)) {
      setSavedProfiles(prev => prev.filter(pId => pId !== id));
    } else {
      setSavedProfiles(prev => [...prev, id]);
    }
  };

  // Lists of available options for dropdowns
  const professionsList = [
    'Civil Engineer', 'Structural Engineer', 'Architect', 'Quantity Surveyor',
    'Mechanical Engineer', 'Electrical Engineer', 'Geotechnical Engineer',
    'Project Manager', 'Contractor', 'Builder'
  ];

  const nigerianStatesList = ['Lagos', 'Abuja', 'Rivers', 'Enugu', 'Kano'];

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProfession('All');
    setSelectedState('All');
    setSelectedExp('All');
    setSelectedStatus('All');
    setSelectedAvailability('All');
    setSelectedRating('All');
    setMaxBudget(100000);
  };

  // Check if any filters are active to display the clear option
  const isAnyFilterActive = 
    searchTerm !== '' || 
    selectedProfession !== 'All' || 
    selectedState !== 'All' || 
    selectedExp !== 'All' || 
    selectedStatus !== 'All' || 
    selectedAvailability !== 'All' || 
    selectedRating !== 'All' || 
    maxBudget !== 100000;

  // Filter professionals
  const filteredProfessionals = PLACEHOLDER_PROFESSIONALS.filter(prof => {
    // Search keyword match (name, specialization, skills, bio)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = prof.name.toLowerCase().includes(term);
      const matchSpec = prof.specialization.toLowerCase().includes(term);
      const matchBio = prof.bio.toLowerCase().includes(term);
      const matchSkills = prof.skills.some(skill => skill.toLowerCase().includes(term));
      const matchProfType = prof.profession.toLowerCase().includes(term);
      if (!matchName && !matchSpec && !matchBio && !matchSkills && !matchProfType) {
        return false;
      }
    }

    // Profession
    if (selectedProfession !== 'All' && prof.profession !== selectedProfession) {
      return false;
    }

    // Location State
    if (selectedState !== 'All' && prof.locationState !== selectedState) {
      return false;
    }

    // Experience Years
    if (selectedExp !== 'All') {
      if (selectedExp === '0-2 years' && prof.experienceYears > 2) return false;
      if (selectedExp === '3-5 years' && (prof.experienceYears < 3 || prof.experienceYears > 5)) return false;
      if (selectedExp === '6-10 years' && (prof.experienceYears < 6 || prof.experienceYears > 10)) return false;
      if (selectedExp === '10+ years' && prof.experienceYears < 10) return false;
    }

    // Verification Status
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Verified Only' && !prof.verificationStatus) return false;
      if (selectedStatus === 'COREN Registered' && prof.verificationStatus !== 'COREN') return false;
      if (selectedStatus === 'ARCON Certified' && prof.verificationStatus !== 'ARCON') return false;
      if (selectedStatus === 'NIOB Registered' && prof.verificationStatus !== 'NIOB') return false;
    }

    // Availability
    if (selectedAvailability !== 'All' && prof.availability !== selectedAvailability) {
      return false;
    }

    // Rating
    if (selectedRating !== 'All') {
      const minRating = selectedRating === '4★ and above' ? 4.0 : 3.0;
      if (prof.rating < minRating) return false;
    }

    // Budget starting rate max
    if (prof.startingRate > maxBudget) {
      return false;
    }

    return true;
  });

  // Sort professionals
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (sortBy) {
      case 'Highest Rated':
        return b.rating - a.rating;
      case 'Most Projects':
        return b.completedProjects - a.completedProjects;
      case 'Price Low to High':
        return a.startingRate - b.startingRate;
      case 'Price High to Low':
        return b.startingRate - a.startingRate;
      case 'Newest':
        return b.experienceYears - a.experienceYears; // proxy for sorting preference
      case 'Most Recommended':
      default:
        return b.rating * b.completedProjects - a.rating * a.completedProjects;
    }
  });

  // Get current selected professional
  const activeProfessional = PLACEHOLDER_PROFESSIONALS.find(p => p.id === selectedProfId);

  // Trigger Hire Flow Process
  const handleOpenHireFlow = () => {
    setHireStep(1);
    setIsHireFlowOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hireStep === 4) {
      // Complete step
      const ref = `MEA-REF-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingReference(ref);
      
      // Save this hired professional to localStorage so that the dashboard lists it
      try {
        const currentHires = localStorage.getItem('mea_hired_professionals');
        const hiresList = currentHires ? JSON.parse(currentHires) : [];
        const newHire = {
          id: `hire_${Date.now()}`,
          professionalId: activeProfessional?.id,
          professionalName: activeProfessional?.name,
          professionalProfession: activeProfessional?.profession,
          avatar: activeProfessional?.avatar,
          projectType: bookingFormData.projectType,
          location: `${bookingFormData.projectCity}, ${bookingFormData.projectState}`,
          status: 'Pending Approval',
          nextMilestone: 'Escrow Verification & Site Assessment',
          submittedAt: new Date().toLocaleDateString(),
          budget: `₦${Number(bookingFormData.budgetMin).toLocaleString()} - ₦${Number(bookingFormData.budgetMax).toLocaleString()}`,
          refNumber: ref
        };
        hiresList.unshift(newHire);
        localStorage.setItem('mea_hired_professionals', JSON.stringify(hiresList));

        // Also push to Client Requests so that if they log into the professional dashboard, they see the request!
        const currentRequests = localStorage.getItem('mea_client_requests');
        const requestsList = currentRequests ? JSON.parse(currentRequests) : [];
        const newRequest = {
          id: `req_${Date.now()}`,
          clientName: 'Josephine Sintei',
          clientEmail: 'sinteijosephine2@gmail.com',
          projectType: bookingFormData.projectType,
          location: `${bookingFormData.projectCity}, ${bookingFormData.projectState}`,
          budget: `₦${Number(bookingFormData.budgetMin).toLocaleString()} - ₦${Number(bookingFormData.budgetMax).toLocaleString()}`,
          submittedAt: new Date().toLocaleDateString(),
          description: bookingFormData.description,
          professionalId: activeProfessional?.id,
          status: 'New'
        };
        requestsList.unshift(newRequest);
        localStorage.setItem('mea_client_requests', JSON.stringify(requestsList));
      } catch (err) {
        console.error('Failed to save hire data:', err);
      }

      setHireStep(5);
    } else {
      setHireStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 font-sans pb-16" id="hire-professionals-page">
      {/* HEADER SECTION */}
      {!selectedProfId && (
        <div className="bg-gradient-to-r from-[#1A56A0] to-[#123C73] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#1A56A0]/20" id="hire-header">
          <div className="max-w-7xl mx-auto text-left relative">
            <span className="text-xs font-black tracking-widest uppercase bg-blue-900/40 text-sky-300 px-3 py-1 rounded-full border border-sky-400/20 inline-block mb-3">
              ECOSYSTEM PRO PARTNERS
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Find Trusted Engineering Professionals
            </h1>
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-blue-100 max-w-3xl font-medium leading-relaxed">
              Browse COREN-registered structural engineers, registered architects, builders, quantity surveyors, and project managers across Nigeria. Direct integration with escrow milestones guarantees safety.
            </p>
          </div>
        </div>
      )}

      {/* PUBLIC DIRECTORY CATALOG VIEW */}
      {!selectedProfId ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LEFT SIDEBAR FILTERS (DESKTOP) */}
            <div className="hidden lg:block space-y-6" id="desktop-filters-sidebar">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-3">
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="h-4 w-4 text-[#1A56A0]" />
                    Filter Directory
                  </h3>
                  {isAnyFilterActive && (
                    <button 
                      onClick={handleClearFilters}
                      className="text-xs text-[#1A56A0] hover:underline font-bold cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Profession Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider block">Profession</label>
                  <select 
                    value={selectedProfession} 
                    onChange={e => setSelectedProfession(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#1A56A0]"
                  >
                    <option value="All">All Professions</option>
                    {professionsList.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Location State Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider block">Location (State)</label>
                  <select 
                    value={selectedState} 
                    onChange={e => setSelectedState(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#1A56A0]"
                  >
                    <option value="All">All States</option>
                    {nigerianStatesList.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Level Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider block">Experience Level</label>
                  <select 
                    value={selectedExp} 
                    onChange={e => setSelectedExp(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#1A56A0]"
                  >
                    <option value="All">Any Experience</option>
                    <option value="0-2 years">0-2 years (Junior)</option>
                    <option value="3-5 years">3-5 years (Intermediate)</option>
                    <option value="6-10 years">6-10 years (Senior)</option>
                    <option value="10+ years">10+ years (Expert/Principal)</option>
                  </select>
                </div>

                {/* Verification Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider block">Verification Badge</label>
                  <select 
                    value={selectedStatus} 
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#1A56A0]"
                  >
                    <option value="All">All Credentials</option>
                    <option value="Verified Only">MEA Verified</option>
                    <option value="COREN Registered">COREN Registered</option>
                    <option value="ARCON Certified">ARCON Certified</option>
                    <option value="NIOB Registered">NIOB Registered</option>
                  </select>
                </div>

                {/* Availability */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider block">Availability</label>
                  <select 
                    value={selectedAvailability} 
                    onChange={e => setSelectedAvailability(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#1A56A0]"
                  >
                    <option value="All">All States</option>
                    <option value="Available Now">Available Now</option>
                    <option value="Available This Week">Available This Week</option>
                    <option value="Busy">Busy (Engaged)</option>
                  </select>
                </div>

                {/* Rating Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider block">Minimum Rating</label>
                  <div className="flex flex-col gap-1">
                    {['All', '4★ and above', '3★ and above'].map((ratingOpt) => (
                      <label key={ratingOpt} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input 
                          type="radio" 
                          name="ratingOpt"
                          checked={selectedRating === ratingOpt}
                          onChange={() => setSelectedRating(ratingOpt)}
                          className="text-[#1A56A0] focus:ring-[#1A56A0]"
                        />
                        <span>{ratingOpt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Starting Rate Range Limit Slider */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase tracking-wider">
                    <span>Starting Rate Limit</span>
                    <span className="text-[#1A56A0] font-black">₦{maxBudget.toLocaleString()}/day</span>
                  </div>
                  <input 
                    type="range" 
                    min="15000" 
                    max="100000" 
                    step="5000"
                    value={maxBudget}
                    onChange={e => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-[#1A56A0] h-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-extrabold">
                    <span>₦15k</span>
                    <span>₦100k+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CATALOG VIEWPORTS (GRID & LIST) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* PERSISTENT STICKY FILTER BAR AND VIEW CONTROL */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between" id="filter-bar">
                
                {/* Search Inputs */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search name, keyword, skill..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#1A56A0]"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Controls (List / Grid / Sort / Mobile Filters Toggle) */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  
                  {/* Mobile filter toggle */}
                  <button 
                    onClick={() => setShowMobileFilters(true)}
                    className="flex lg:hidden items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-slate-50 dark:bg-slate-900 cursor-pointer"
                  >
                    <Filter className="h-4 w-4 text-[#1A56A0]" />
                    Filters
                  </button>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 font-bold hidden sm:inline">Sort:</span>
                    <select 
                      value={sortBy} 
                      onChange={e => setSortBy(e.target.value)}
                      className="text-xs px-2.5 py-1.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#1A56A0]"
                    >
                      <option value="Most Recommended">Most Recommended</option>
                      <option value="Highest Rated">Highest Rated</option>
                      <option value="Most Projects">Most Projects</option>
                      <option value="Newest">Newest</option>
                      <option value="Price Low to High">Price Low to High</option>
                      <option value="Price High to Low">Price High to Low</option>
                    </select>
                  </div>

                  {/* View Toggles */}
                  <div className="flex items-center bg-gray-100 dark:bg-slate-900/60 rounded-xl p-1">
                    <button 
                      onClick={() => setIsGridView(true)}
                      className={`p-1.5 rounded-lg transition-all ${isGridView ? 'bg-white dark:bg-slate-800 text-[#1A56A0] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Grid View"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setIsGridView(false)}
                      className={`p-1.5 rounded-lg transition-all ${!isGridView ? 'bg-white dark:bg-slate-800 text-[#1A56A0] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      title="List View"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              </div>

              {/* FILTER CHIPS */}
              {isAnyFilterActive && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">Active filters:</span>
                  
                  {searchTerm && (
                    <span className="bg-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      Search: "{searchTerm}"
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                    </span>
                  )}
                  {selectedProfession !== 'All' && (
                    <span className="bg-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      Role: {selectedProfession}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedProfession('All')} />
                    </span>
                  )}
                  {selectedState !== 'All' && (
                    <span className="bg-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      State: {selectedState}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedState('All')} />
                    </span>
                  )}
                  {selectedExp !== 'All' && (
                    <span className="bg-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      Exp: {selectedExp}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedExp('All')} />
                    </span>
                  )}
                  {selectedStatus !== 'All' && (
                    <span className="bg-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      Badge: {selectedStatus}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedStatus('All')} />
                    </span>
                  )}
                  {selectedAvailability !== 'All' && (
                    <span className="bg-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      Availability: {selectedAvailability}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedAvailability('All')} />
                    </span>
                  )}
                  {selectedRating !== 'All' && (
                    <span className="bg-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      Rating: {selectedRating}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedRating('All')} />
                    </span>
                  )}
                  {maxBudget !== 100000 && (
                    <span className="bg-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      Max Rate: ₦{maxBudget.toLocaleString()}/day
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setMaxBudget(100000)} />
                    </span>
                  )}
                  
                  <button 
                    onClick={handleClearFilters}
                    className="text-[10px] font-extrabold text-[#1A56A0] hover:underline cursor-pointer ml-1"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Dynamic Results Count */}
              <div className="flex justify-between items-center px-1">
                <p className="text-xs text-gray-500 font-extrabold uppercase tracking-wider">
                  Showing {sortedProfessionals.length} of {PLACEHOLDER_PROFESSIONALS.length} professionals in Nigeria
                </p>
              </div>

              {/* PROFESSIONALS LISTINGS CONTAINER */}
              {sortedProfessionals.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-slate-800 shadow-sm" id="empty-listings">
                  <div className="mx-auto w-14 h-14 bg-red-50 dark:bg-slate-900/40 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">No Professionals Match Your Filter</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed">
                    Try loosening your search terms or expanding the starting budget range. All listed candidates are fully verified.
                  </p>
                  <button 
                    onClick={handleClearFilters}
                    className="mt-6 px-4.5 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Reset Directory Filters
                  </button>
                </div>
              ) : isGridView ? (
                
                // GRID VIEW
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="professionals-grid">
                  {sortedProfessionals.map((prof) => {
                    const isSaved = savedProfiles.includes(prof.id);
                    return (
                      <div 
                        key={prof.id} 
                        onClick={() => { setSelectedProfId(prof.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
                      >
                        {/* Upper Details / Card Cover */}
                        <div className="p-5 flex-grow">
                          <div className="flex justify-between items-start gap-4">
                            {/* Profile image with status dot */}
                            <div className="relative">
                              <img 
                                src={prof.avatar} 
                                alt={prof.name} 
                                referrerPolicy="no-referrer"
                                className="h-14 w-14 rounded-full object-cover border-2 border-[#1A56A0]/10"
                              />
                              {prof.availability !== 'Busy' && (
                                <span className="absolute bottom-0.5 right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" title="Online" />
                              )}
                            </div>

                            {/* Verification badge & Save action */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black tracking-widest bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded-md uppercase border border-dashed border-[#1A56A0]/30">
                                {prof.verificationStatus}
                              </span>
                              <button 
                                onClick={(e) => toggleSaveProfile(prof.id, e)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isSaved ? 'bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/30' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-rose-500 dark:bg-slate-900/60 dark:border-slate-700/60'}`}
                              >
                                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* Profile Core Meta */}
                          <div className="mt-4">
                            <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight group-hover:text-[#1A56A0] transition-colors">
                              {prof.name}
                            </h4>
                            <p className="text-xs text-[#1A56A0] font-bold mt-0.5">{prof.profession}</p>
                            <p className="text-[10px] text-gray-400 font-semibold mt-1 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              {prof.locationCity}, {prof.locationState} State
                            </p>
                          </div>

                          {/* Stats Info */}
                          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700/50 grid grid-cols-3 gap-1 text-center">
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Experience</p>
                              <p className="text-xs font-black text-gray-800 dark:text-gray-100 mt-0.5">{prof.experienceYears} Yrs</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Rating</p>
                              <p className="text-xs font-black text-amber-500 mt-0.5 flex items-center justify-center gap-0.5">
                                <Star className="h-3 w-3 fill-current text-amber-500" />
                                {prof.rating}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Projects</p>
                              <p className="text-xs font-black text-gray-800 dark:text-gray-100 mt-0.5">{prof.completedProjects}</p>
                            </div>
                          </div>

                          {/* Top 3 Skills tags */}
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {prof.skills.slice(0, 3).map(skill => (
                              <span key={skill} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-900 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Actions Banner */}
                        <div className="p-4 bg-gray-50 dark:bg-slate-900/40 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center gap-3">
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Starting Rate</p>
                            <p className="text-xs font-black text-gray-800 dark:text-gray-100 mt-0.5">₦{prof.startingRate.toLocaleString()}<span className="text-[10px] font-bold text-gray-400">/day</span></p>
                          </div>
                          <button 
                            className="px-4 py-2 bg-[#1A56A0] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:bg-[#1A56A0]/90 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            Hire Now <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                
                // LIST VIEW
                <div className="space-y-4" id="professionals-list">
                  {sortedProfessionals.map((prof) => {
                    const isSaved = savedProfiles.includes(prof.id);
                    return (
                      <div 
                        key={prof.id} 
                        onClick={() => { setSelectedProfId(prof.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer"
                      >
                        <div className="flex items-start md:items-center gap-4 flex-grow">
                          {/* Avatar */}
                          <div className="relative">
                            <img 
                              src={prof.avatar} 
                              alt={prof.name} 
                              referrerPolicy="no-referrer"
                              className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover border-2 border-[#1A56A0]/10 flex-shrink-0"
                            />
                            {prof.availability !== 'Busy' && (
                              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                            )}
                          </div>

                          {/* Profile descriptions */}
                          <div className="space-y-1 max-w-xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm md:text-base font-black text-gray-900 dark:text-white group-hover:text-[#1A56A0] transition-colors">
                                {prof.name}
                              </h4>
                              <span className="text-[8px] font-black bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded uppercase border border-dashed border-[#1A56A0]/30">
                                {prof.verificationStatus}
                              </span>
                            </div>
                            
                            <p className="text-xs text-[#1A56A0] font-black">{prof.profession} <span className="text-gray-400 font-bold">· {prof.specialization}</span></p>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-500 font-semibold pt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                {prof.locationCity}, {prof.locationState} State
                              </span>
                              <span>• {prof.experienceYears} Years Experience</span>
                              <span className="flex items-center gap-0.5">
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                                {prof.rating} ({prof.reviewsCount} reviews)
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 pt-1.5">
                              {prof.bio}
                            </p>
                          </div>
                        </div>

                        {/* List Column Right Pricing / CTA */}
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 min-w-[150px] border-t md:border-t-0 pt-4 md:pt-0 border-gray-50 dark:border-slate-700/60">
                          <div className="text-left md:text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Starting Rate</p>
                            <p className="text-base font-black text-gray-900 dark:text-white mt-0.5">
                              ₦{prof.startingRate.toLocaleString()}
                              <span className="text-xs font-bold text-gray-400">/day</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => toggleSaveProfile(prof.id, e)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${isSaved ? 'bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/30' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-rose-500 dark:bg-slate-900/60'}`}
                            >
                              <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                              className="px-4 py-2 bg-[#1A56A0] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:bg-[#1A56A0]/90 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              Hire Now
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
        </div>
      ) : (
        
        // FULL PROFESSIONAL PROFILE PAGE SUITE
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          
          {/* Back Navigation Bar */}
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm mb-6">
            <button 
              onClick={() => setSelectedProfId(null)}
              className="flex items-center gap-1.5 text-xs font-black text-gray-500 dark:text-gray-300 hover:text-[#1A56A0] uppercase tracking-wider cursor-pointer"
            >
              <ArrowRight className="h-4 w-4 rotate-180" /> Back to Directory
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400">Viewing Professional:</span>
              <span className="text-xs font-black text-[#1A56A0]">{activeProfessional?.name}</span>
            </div>
          </div>

          {activeProfessional && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT COLUMN: ABOUT, EXPERIENCE, reviews, PORTFOLIO */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Hero header with profile overlay */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm">
                  {/* Decorative Banner */}
                  <div className="h-40 bg-gradient-to-r from-[#1A56A0] to-[#123C73] relative">
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/10">
                      Vetted Consultant
                    </div>
                  </div>
                  
                  {/* Avatar Profile Detail bar */}
                  <div className="px-6 pb-6 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 gap-4">
                      <div className="relative">
                        <img 
                          src={activeProfessional.avatar} 
                          alt={activeProfessional.name} 
                          referrerPolicy="no-referrer"
                          className="h-28 w-28 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-md bg-slate-100"
                        />
                        {activeProfessional.availability !== 'Busy' && (
                          <span className="absolute bottom-2 right-2 h-4.5 w-4.5 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full" />
                        )}
                      </div>
                      
                      {/* Social/Status indications */}
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider border border-[#1A56A0]/20">
                          {activeProfessional.verificationStatus} REGISTERED
                        </span>
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider border ${activeProfessional.availability === 'Busy' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40'}`}>
                          {activeProfessional.availability}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">{activeProfessional.name}</h2>
                      <p className="text-sm text-[#1A56A0] font-bold mt-0.5">{activeProfessional.profession} · <span className="text-gray-500 font-semibold">{activeProfessional.specialization}</span></p>
                      
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs text-gray-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {activeProfessional.locationCity}, {activeProfessional.locationState} State
                        </span>
                        <span>• {activeProfessional.experienceYears} Years active</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <strong className="text-gray-800 dark:text-gray-200">{activeProfessional.rating}</strong> ({activeProfessional.reviewsCount} verified reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Bio Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 pb-2.5">
                    Professional Biography
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {activeProfessional.bio}
                  </p>
                  
                  {/* Skills Tag grid */}
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Core Technical Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {activeProfessional.skills.map(skill => (
                        <span key={skill} className="text-xs font-bold bg-[#1A56A0]/5 text-[#1A56A0] px-3 py-1.5 rounded-xl border border-[#1A56A0]/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Certifications and Academics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Credentials */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="h-4.5 w-4.5 text-[#1A56A0]" />
                      Accreditations
                    </h3>
                    <ul className="space-y-2.5">
                      {activeProfessional.certifications.map((cert, index) => (
                        <li key={index} className="flex gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className="h-4 w-4 text-[#1A56A0] flex-shrink-0 mt-0.5" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Education */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="h-4.5 w-4.5 text-[#1A56A0]" />
                      Education Background
                    </h3>
                    <ul className="space-y-2.5">
                      {activeProfessional.education.map((edu, index) => (
                        <li key={index} className="flex gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className="h-4 w-4 text-[#1A56A0] flex-shrink-0 mt-0.5" />
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Portfolio Gallery Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 pb-2.5">
                    Project Portfolio & Site Archives
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {activeProfessional.portfolio.map((project, index) => (
                      <div key={index} className="group/portfolio overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm relative">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="h-44 w-full object-cover group-hover/portfolio:scale-105 transition-transform duration-300"
                        />
                        <div className="p-3 bg-white dark:bg-slate-800">
                          <h4 className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{project.title}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {project.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Reviews Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 pb-2.5">
                    Verified Client Testimonials
                  </h3>
                  <div className="space-y-4">
                    {activeProfessional.reviews.map((rev, index) => (
                      <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-gray-50 dark:border-slate-700 rounded-2xl">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs font-black text-gray-900 dark:text-white">{rev.author}</p>
                            <span className="text-[9px] text-gray-400 font-bold">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium italic mt-2.5 leading-relaxed">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: ACTION PANEL & SERVICE DETAILS */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm sticky top-6 space-y-5">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starting Consultation Rate</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-gray-950 dark:text-white">₦{activeProfessional.startingRate.toLocaleString()}</span>
                      <span className="text-xs font-bold text-gray-400">/day</span>
                    </div>
                  </div>

                  {/* Trust indicator */}
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 flex gap-3 text-left">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Milestone Escrow Safe</h4>
                      <p className="text-[10px] text-emerald-700/80 dark:text-emerald-500/80 mt-1 leading-relaxed font-bold">
                        Ecosystem payments are strictly released matching verified design delivery stages. 100% money back guarantee on non-COREN delivery.
                      </p>
                    </div>
                  </div>

                  {/* Availability responses */}
                  <div className="space-y-2 border-t border-b border-gray-50 dark:border-slate-700 py-4 text-xs font-bold text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Speed:</span>
                      <span className="text-gray-900 dark:text-white font-extrabold">Within 2 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completed Orders:</span>
                      <span className="text-[#1A56A0] font-black">{activeProfessional.completedProjects} Vetted Bids</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Physical Zone:</span>
                      <span className="text-gray-900 dark:text-white font-extrabold">{activeProfessional.locationCity}, Nigeria</span>
                    </div>
                  </div>

                  {/* Actions CTA buttons */}
                  <div className="space-y-2.5">
                    <button 
                      onClick={handleOpenHireFlow}
                      className="w-full py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Hire This Professional
                    </button>
                    
                    <button 
                      onClick={() => {
                        // Store the pre-selected professional details in localStorage
                        localStorage.setItem('quote_auto_professional', JSON.stringify({ 
                          id: activeProfessional.id, 
                          name: activeProfessional.name, 
                          profession: activeProfessional.profession 
                        }));
                        onNavigate('dashboard/customer/quotes');
                      }}
                      className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-900/60 text-[#1A56A0] dark:text-sky-400 font-extrabold rounded-xl text-xs uppercase tracking-wider border border-gray-100 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 text-[#1A56A0] dark:text-sky-400" />
                      Request Direct Quote
                    </button>
                  </div>

                  {/* Secondary metadata */}
                  <div className="pt-2 text-center text-[10px] text-gray-400 font-semibold space-y-1.5">
                    <p className="flex items-center justify-center gap-1">
                      <Info className="h-3.5 w-3.5" /> Members are checked against active legal councils.
                    </p>
                    <button 
                      onClick={() => alert('Profile link copied to clipboard!')}
                      className="text-[#1A56A0] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer font-bold"
                    >
                      <Share2 className="h-3 w-3" /> Share Profile link
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* MOBILE FILTER MODAL SHEET */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-fade-in" id="mobile-filter-sheet">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-3 mb-5">
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-[#1A56A0]" />
                  Filter Directory
                </h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-lg border border-gray-100 hover:bg-gray-50 dark:border-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile fields */}
              <div className="space-y-4">
                {/* Profession Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Profession</label>
                  <select 
                    value={selectedProfession} 
                    onChange={e => setSelectedProfession(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#1A56A0]"
                  >
                    <option value="All">All Professions</option>
                    {professionsList.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Location (State)</label>
                  <select 
                    value={selectedState} 
                    onChange={e => setSelectedState(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#1A56A0]"
                  >
                    <option value="All">All States</option>
                    {nigerianStatesList.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Experience Level</label>
                  <select 
                    value={selectedExp} 
                    onChange={e => setSelectedExp(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100"
                  >
                    <option value="All">Any Experience</option>
                    <option value="0-2 years">0-2 years (Junior)</option>
                    <option value="3-5 years">3-5 years (Intermediate)</option>
                    <option value="6-10 years">6-10 years (Senior)</option>
                    <option value="10+ years">10+ years (Expert)</option>
                  </select>
                </div>

                {/* Rating */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Minimum Rating</label>
                  <select 
                    value={selectedRating} 
                    onChange={e => setSelectedRating(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100"
                  >
                    <option value="All">All Ratings</option>
                    <option value="4★ and above">4★ and above</option>
                    <option value="3★ and above">3★ and above</option>
                  </select>
                </div>

                {/* Budget Limit Slider */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs font-black text-gray-400 uppercase tracking-wider">
                    <span>Starting Rate Limit</span>
                    <span className="text-[#1A56A0] font-black">₦{maxBudget.toLocaleString()}/day</span>
                  </div>
                  <input 
                    type="range" 
                    min="15000" 
                    max="100000" 
                    step="5000"
                    value={maxBudget}
                    onChange={e => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-[#1A56A0] h-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-slate-700 flex gap-3">
              <button 
                onClick={handleClearFilters}
                className="flex-1 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                Reset
              </button>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-2.5 bg-[#1A56A0] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-STEP HIRE PROFESSIONAL FLOW MODAL */}
      {isHireFlowOpen && activeProfessional && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="hire-flow-modal">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden text-left flex flex-col justify-between max-h-[90vh]">
            
            {/* Modal Header bar */}
            <div className="p-5 border-b border-gray-100 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-900/40 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">SECURE HIREGATEWAY · STEP {hireStep} OF 5</span>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#1A56A0]" />
                  Hire {activeProfessional.name}
                </h3>
              </div>
              {hireStep < 5 && (
                <button 
                  onClick={() => setIsHireFlowOpen(false)}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 dark:border-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Steps Progress Indicator (Step dots) */}
            {hireStep < 5 && (
              <div className="bg-slate-50 dark:bg-slate-900/20 px-6 py-2 border-b border-gray-100 dark:border-slate-700/40 flex justify-between items-center gap-2">
                {[
                  { step: 1, label: 'Service' },
                  { step: 2, label: 'Details' },
                  { step: 3, label: 'Terms' },
                  { step: 4, label: 'Escrow' }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border ${hireStep >= s.step ? 'bg-[#1A56A0] text-white border-[#1A56A0]' : 'bg-white text-gray-400 border-gray-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                      {hireStep > s.step ? <Check className="h-3 w-3" /> : s.step}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider hidden sm:inline ${hireStep === s.step ? 'text-[#1A56A0]' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                    {s.step < 4 && <ChevronRight className="h-3 w-3 text-gray-300 hidden sm:inline" />}
                  </div>
                ))}
              </div>
            )}

            {/* SCROLLABLE STEP CONTENT SECTION */}
            <form onSubmit={handleBookingSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
              
              {/* STEP 1: SELECT SERVICE TYPE */}
              {hireStep === 1 && (
                <div className="space-y-4 animate-fade-in" id="hire-step-1">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Select Required Engineering Service Type</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { type: 'Full Project Management', desc: 'Direct end-to-end sequencing, material monitoring, and site controls' },
                      { type: 'Consultation Only', desc: 'Hourly or daily reviews of ongoing site projects' },
                      { type: 'Structural Design', desc: 'Full architectural translation to reinforced concrete layouts' },
                      { type: 'Architectural Design', desc: 'Floorplans, biophilic concepts, and 3D mockups' },
                      { type: 'Quantity Surveying', desc: 'Rigorous bills of quantities and pricing audits' },
                      { type: 'Site Supervision', desc: 'Physical on-site safety and quality casting verification' }
                    ].map((opt) => (
                      <label 
                        key={opt.type}
                        className={`p-4 border rounded-2xl cursor-pointer flex gap-3 text-left transition-all ${bookingFormData.serviceType === opt.type ? 'bg-blue-50/40 border-[#1A56A0] ring-1 ring-[#1A56A0] dark:bg-slate-900/60' : 'border-gray-200 dark:border-slate-700 hover:bg-slate-50'}`}
                      >
                        <input 
                          type="radio" 
                          name="serviceType"
                          value={opt.type}
                          checked={bookingFormData.serviceType === opt.type}
                          onChange={e => setBookingFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                          className="mt-1 text-[#1A56A0] focus:ring-[#1A56A0]"
                        />
                        <div>
                          <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{opt.type}</p>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-relaxed">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Other specifiers */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Or Specify Custom Request</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Borehole logging review or storm drain alignment checkout..."
                      value={bookingFormData.customService}
                      onChange={e => setBookingFormData(prev => ({ ...prev, customService: e.target.value }))}
                      className="w-full text-xs px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: PROJECT DETAILS */}
              {hireStep === 2 && (
                <div className="space-y-4 animate-fade-in animate-duration-200" id="hire-step-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Provide Your Site & Building Details</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Project Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Project Type</label>
                      <select 
                        value={bookingFormData.projectType}
                        onChange={e => setBookingFormData(prev => ({ ...prev, projectType: e.target.value }))}
                        className="w-full text-xs px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900"
                      >
                        <option value="New Build">New Build (Greenfield)</option>
                        <option value="Renovation">Renovation (Retrofit)</option>
                        <option value="Extension">Building Extension</option>
                        <option value="Commercial">Commercial/Institutional</option>
                      </select>
                    </div>

                    {/* Location State */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Project Location (State)</label>
                      <select 
                        value={bookingFormData.projectState}
                        onChange={e => setBookingFormData(prev => ({ ...prev, projectState: e.target.value }))}
                        className="w-full text-xs px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900"
                      >
                        {nigerianStatesList.map(st => (
                          <option key={st} value={st}>{st} State</option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Project City</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Ikeja, Lekki, Wuse, Kano City"
                        value={bookingFormData.projectCity}
                        onChange={e => setBookingFormData(prev => ({ ...prev, projectCity: e.target.value }))}
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    {/* Local Area */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Local Street / Plot Area</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Phase 1, Gwarinpa Estate"
                        value={bookingFormData.projectArea}
                        onChange={e => setBookingFormData(prev => ({ ...prev, projectArea: e.target.value }))}
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Project Description Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Detailed Scope Description</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Explain what needs to be drawn or supervised on site. Please include approximate plot measurements and building heights if available."
                      value={bookingFormData.description}
                      onChange={e => setBookingFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full text-xs px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  {/* Timing & Budget Ranges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Est. Start Date</label>
                      <input 
                        type="date" 
                        required
                        value={bookingFormData.startDate}
                        onChange={e => setBookingFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Min Budget (₦)</label>
                      <input 
                        type="number" 
                        value={bookingFormData.budgetMin}
                        onChange={e => setBookingFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
                        className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Max Budget (₦)</label>
                      <input 
                        type="number" 
                        value={bookingFormData.budgetMax}
                        onChange={e => setBookingFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
                        className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Document uploads */}
                  <div className="p-4 border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900 text-center space-y-2">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">Upload Relevant Documents (Optional)</p>
                      <p className="text-[9px] text-gray-400 font-semibold mt-0.5">PDF, DWG, PNG formats accepted (Max 10MB)</p>
                    </div>
                    <input 
                      type="file" 
                      id="hire-doc-upload"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setBookingFormData(prev => ({ ...prev, documentName: file.name }));
                        }
                      }}
                    />
                    <label 
                      htmlFor="hire-doc-upload"
                      className="inline-block px-3.5 py-1.5 bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 text-gray-800 dark:text-gray-200 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      Choose File
                    </label>
                    {bookingFormData.documentName && (
                      <p className="text-[10px] text-[#1A56A0] font-black">Selected: {bookingFormData.documentName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW PROFESSIONAL & PLATFORM TERMS */}
              {hireStep === 3 && (
                <div className="space-y-4 animate-fade-in" id="hire-step-3">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Review Booking Contract & Escrow Guarantee</p>
                  
                  {/* Summary Profile Box */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-700/60 flex items-center gap-3.5">
                    <img src={activeProfessional.avatar} alt={activeProfessional.name} className="h-12 w-12 rounded-full object-cover border" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-xs font-extrabold text-gray-900 dark:text-white">{activeProfessional.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{activeProfessional.profession} · Starting {activeProfessional.startingRate.toLocaleString()}/day</p>
                      <p className="text-[10px] text-[#1A56A0] font-black mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Site Location: {bookingFormData.projectCity}, {bookingFormData.projectState} State
                      </p>
                    </div>
                  </div>

                  {/* Escrow Explanation Box */}
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    <h4 className="font-extrabold text-[#1A56A0] uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="h-4.5 w-4.5" />
                      Ecosystem Escrow Protocol
                    </h4>
                    <p className="leading-relaxed font-semibold text-[11px]">
                      Under My Engineering App rules, hired consultants receive payments strictly in milestones. Once you submit, your funds are securely deposited into our platform escrow. 
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[10px] font-bold text-gray-500 pl-1">
                      <li>Professional reviews scope within 24 hours to accept/decline.</li>
                      <li>Site assessment and soil samples are verified by MEA supervisors.</li>
                      <li>Milestone payments are released only after you sign off on drawing sets.</li>
                    </ul>
                  </div>

                  {/* Agreement Box */}
                  <label className="flex items-start gap-2.5 p-3 border border-gray-100 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/20 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      checked={bookingFormData.agreeToTerms}
                      onChange={e => setBookingFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                      className="mt-1 text-[#1A56A0] focus:ring-[#1A56A0]"
                    />
                    <span className="text-[10px] text-gray-500 font-bold leading-normal">
                      I agree to the MEA Professional Engagement Terms and authorize the platform escrow framework to mediate structural milestone disputes.
                    </span>
                  </label>
                </div>
              )}

              {/* STEP 4: PAYMENT SETUP (PAYSTACK UI) */}
              {hireStep === 4 && (
                <div className="space-y-4 animate-fade-in" id="hire-step-4">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Initialize Escrow Deposit Securely</p>
                  
                  {/* Invoice Summary Card */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                      <span>Milestone 1: Structural Audit & Initial Drawings</span>
                      <span className="text-gray-900 dark:text-white font-extrabold">₦{activeProfessional.startingRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                      <span>Platform Mediation Insurance (2%)</span>
                      <span className="text-gray-900 dark:text-white font-extrabold">₦{(activeProfessional.startingRate * 0.02).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 font-bold border-t border-gray-100 dark:border-slate-700 pt-3">
                      <span className="text-gray-900 dark:text-white font-black uppercase">TOTAL MILESTONE ESCROW DUE</span>
                      <span className="text-sm font-black text-[#1A56A0]">₦{(activeProfessional.startingRate * 1.02).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Paystack Channel Option Card */}
                  <div className="p-4 bg-[#09A5DB]/5 border border-[#09A5DB]/30 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center p-2 border border-blue-50">
                        <span className="text-[#09A5DB] font-black text-base">P</span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Paystack Checkout</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Pay securely with Cards, Bank Transfer, USSD, or Bank App</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-[#09A5DB] bg-[#09A5DB]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Active Gateway</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl flex gap-2 text-[10px] font-bold text-gray-400">
                    <Info className="h-4 w-4 text-[#1A56A0] flex-shrink-0 mt-0.5" />
                    <p>
                      This secure portal operates under official platform guidelines. Payments are handled via a secure escrow protocol. Clicking Submit locks the booking reference and notifies the selected professional.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 5: CONFIRMATION SCREEN */}
              {hireStep === 5 && (
                <div className="text-center py-8 space-y-4 animate-fade-in" id="hire-step-5">
                  <div className="mx-auto h-16 w-16 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                    <Check className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full uppercase tracking-widest inline-block border border-emerald-100">
                      Escrow Deposit Lock Success
                    </span>
                    <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight mt-3">Professional Successfully Notified</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2 leading-relaxed">
                      We have generated booking reference <strong className="text-gray-900 dark:text-white font-black">{bookingReference}</strong>. {activeProfessional.name} has been notified and will review your structural requirements within 2 hours.
                    </p>
                  </div>

                  {/* Booking Receipt card */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 border rounded-2xl text-left text-xs font-bold text-gray-600 dark:text-gray-300 max-w-md mx-auto space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Professional:</span>
                      <span className="text-gray-900 dark:text-white font-extrabold">{activeProfessional.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Escrow Depository:</span>
                      <span className="text-[#1A56A0] font-black">₦{(activeProfessional.startingRate * 1.02).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Threshold:</span>
                      <span className="text-gray-900 dark:text-white font-extrabold">24 Hours (Refund if expired)</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => { setIsHireFlowOpen(false); setSelectedProfId(null); onNavigate('dashboard'); }}
                      className="px-5 py-2.5 bg-[#1A56A0] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setIsHireFlowOpen(false); setSelectedProfId(null); }}
                      className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Browse More Pros
                    </button>
                  </div>
                </div>
              )}

            </form>

            {/* Modal Bottom Actions Footer */}
            {hireStep < 5 && (
              <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/40 flex justify-between gap-3">
                <button 
                  type="button"
                  disabled={hireStep === 1}
                  onClick={() => setHireStep(prev => prev - 1)}
                  className={`px-4.5 py-2.5 border rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-all ${hireStep === 1 ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400' : 'border-gray-200 text-gray-700 hover:bg-white'}`}
                >
                  Previous
                </button>
                <button 
                  type="button"
                  onClick={handleBookingSubmit}
                  className="px-5 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  {hireStep === 4 ? 'Pay & Submit' : 'Continue'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
