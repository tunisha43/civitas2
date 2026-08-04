import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Award, BookOpen, ShieldCheck, Compass, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { profile, completeOnboarding } = useAuth();

  const handleStart = async () => {
    await completeOnboarding();
    onComplete();
  };

  const roleBenefits: Record<string, { title: string; items: string[]; icon: React.ReactNode }> = {
    Customer: {
      title: 'Building Your Dream Project',
      items: [
        'Post specific building project requirements and receive verified quotes.',
        'Hire COREN-registered structural engineers, registered architects, and surveyors.',
        'Purchase building materials with automated protection through Paystack escrows.',
        'Lease heavy excavation or concrete mixing machinery with vetted operators.',
      ],
      icon: <Compass className="h-8 w-8 text-[#1A56A0]" id="onboard-cust-icon" />,
    },
    Professional: {
      title: 'Elevating Your Professional Practice',
      items: [
        'Establish a certified profile highlighted to thousands of Nigerian property developers.',
        'Submit official bids for government and large-scale corporate construction tenders.',
        'Publish completed project portfolios with validated structural dimensions.',
        'Connect with student mentees to foster the next generation of African designers.',
      ],
      icon: <Award className="h-8 w-8 text-[#1A56A0]" id="onboard-prof-icon" />,
    },
    Student: {
      title: 'Accelerating Your Engineering Career',
      items: [
        'Explore verified structural drawings, site manuals, and study checklists.',
        'Apply for vetted industrial training (IT) placements and graduate internships.',
        'Interact with senior engineering leaders in active peer-reviewed channels.',
        'Earn digital skill badges that showcase your software and construction expertise.',
      ],
      icon: <BookOpen className="h-8 w-8 text-[#1A56A0]" id="onboard-stud-icon" />,
    },
    'Material Seller': {
      title: 'Scaling Your Material Operations',
      items: [
        'List inventory such as sand, granite, iron rods, cement, and sanitary fittings.',
        'Process payments securely with local banking integrations and Paystack options.',
        'Receive automated delivery dispatch reminders linked to Nigerian shipping networks.',
        'Unlock high-priority search placements for vetted merchant profiles.',
      ],
      icon: <ShieldCheck className="h-8 w-8 text-[#1A56A0]" id="onboard-seller-icon" />,
    },
    Manufacturer: {
      title: 'Connecting Directly to Developers',
      items: [
        'Offer industrial bulk cement, steel rods, electrical cables, and tile sets.',
        'Manage regional distribution hubs with custom quotation pipelines.',
        'Participate in large government tenders requiring bulk quality-assured supplies.',
        'Protect brand authenticity with counterfeit protection indicators.',
      ],
      icon: <ShieldCheck className="h-8 w-8 text-[#1A56A0]" id="onboard-manu-icon" />,
    },
    'Equipment Owner': {
      title: 'Optimizing Machinery Utilization',
      items: [
        'List construction heavy cranes, excavators, lowbed trucks, and survey equipment.',
        'Accept rental bookings with transparent daily rates and fuel provisions.',
        'Review background verifications of site operators and renting developers.',
        'Utilize automatic deposit tracking and equipment returns checklist.',
      ],
      icon: <Compass className="h-8 w-8 text-[#1A56A0]" id="onboard-owner-icon" />,
    },
    'Skilled Labour': {
      title: 'Securing Trusted Site Hiring',
      items: [
        'Publish your masonry, plumbing, electrical, tiling, or steelworks craftsmanship.',
        'Get hired on vetted construction sites with guaranteed daily wage parameters.',
        'Collect 5-star builder ratings that elevate your profile over standard workers.',
        'Receive SMS alerts for nearby construction jobs without needing internet access.',
      ],
      icon: <Award className="h-8 w-8 text-[#1A56A0]" id="onboard-labour-icon" />,
    },
    Company: {
      title: 'Corporate Ecosystem Coordination',
      items: [
        'Post corporate engineering vacancies, estimator positions, and site internships.',
        'Publish official requests for proposals (RFPs) and construction tender notices.',
        'Coordinate procurement cycles for multi-site building developments.',
        'Track active subcontractor credentials and project-site compliance.',
      ],
      icon: <Compass className="h-8 w-8 text-[#1A56A0]" id="onboard-company-icon" />,
    },
  };

  const defaultBenefit = {
    title: "Welcome to My Engineering App",
    items: [
      'Connect with verified suppliers and qualified professionals in Nigeria.',
      'Access reliable technical resources and construction schedules.',
      'Explore standard house plans built to Nigerian code requirements.',
      'Ensure secure payments using Paystack standard escrow infrastructure.'
    ],
    icon: <Compass className="h-8 w-8 text-[#1A56A0]" id="onboard-def-icon" />,
  };

  const benefit = roleBenefits[profile?.role || ''] || defaultBenefit;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="onboarding-page">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl overflow-hidden p-8 md:p-12 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 dark:bg-slate-700 rounded-2xl mb-6">
            {benefit.icon}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Welcome to the Ecosystem, <span className="text-[#1A56A0]">{profile?.fullName || 'Builder'}</span>!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Your account is set up as a <span className="text-purple-700 dark:text-purple-400 font-bold">{profile?.role || 'Member'}</span>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-6 md:p-8 mb-10">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" /> {benefit.title}
          </h2>
          <ul className="space-y-4">
            {benefit.items.map((item, index) => (
              <li key={index} className="flex gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="flex-shrink-0 h-5 w-5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 leading-normal max-w-sm text-center sm:text-left">
            By clicking below, you confirm compliance with Nigeria Data Protection Act (NDPA) privacy regulations.
          </div>
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            id="onboarding-continue-btn"
          >
            Go to App Overview <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
