import React from 'react';
import { EngineeringBlueButton, EngineeringSecondaryButton } from '../App';
import { ArrowLeft, HardHat, FileText, ShoppingBag, GraduationCap, Users, BookOpen, Briefcase, Award, HelpCircle, Shield, FileSignature, Mail } from 'lucide-react';

interface ShellPageProps {
  title: string;
  description: string;
  onNavigate: (page: string) => void;
  icon?: React.ReactNode;
}

export const ShellPage: React.FC<ShellPageProps> = ({ title, description, onNavigate, icon }) => {
  return (
    <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto text-center sm:pt-32 lg:pt-36" id={`shell-page-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="mb-6 inline-flex p-4 bg-blue-50 dark:bg-slate-900 rounded-full text-[#1A56A0]">
        {icon || <HardHat className="h-12 w-12" id="shell-default-icon" />}
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4" id="shell-page-title">
        {title}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed" id="shell-page-description">
        {description}
      </p>
      
      <div className="p-8 max-w-md mx-auto bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm mb-12">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Roadmap Prompt 4 Preview</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          The full directory, live database queries, and transaction pipelines for this service will activate in future roadmap stages.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 bg-[#1A56A0] text-white font-medium rounded-lg text-sm hover:bg-[#1A56A0]/90 transition-all flex items-center gap-2"
            id="shell-home-btn"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// 15 Shell Components
export const AboutPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-16 px-4 max-w-4xl mx-auto text-center sm:pt-32 lg:pt-36" id="about-us-page">
      <div className="mb-6 inline-flex p-4 bg-blue-50 dark:bg-slate-900 rounded-full text-[#1A56A0]">
        <Users className="h-12 w-12" id="about-us-icon" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
        About Us
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
        My Engineering App was founded by a female engineer to build Africa's leading engineering and construction ecosystem. We are launching in Nigeria to connect professionals, clients, suppliers, and students onto a single trustworthy space.
      </p>

      {/* Condensed Mission Statement & Call to Manifesto */}
      <div className="p-8 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl shadow-lg mb-12 text-left space-y-6">
        <div className="border-l-4 border-[#1A56A0] pl-4 space-y-2">
          <span className="text-xs font-black uppercase text-[#1A56A0] tracking-widest">Our Mission</span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connecting Theory, Practice, and Trust</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            We exist to solve the disconnection in the built environment. By uniting students, licensed engineers, material suppliers, and clients on a single platform, we make engineering accessible, practical, and highly trustworthy for every Nigerian family.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs font-black text-[#1A56A0] uppercase tracking-wider">The Founder's Message</p>
            <p className="text-sm font-semibold italic text-gray-700 dark:text-gray-300">
              "We're not just building an app. We're building the future of engineering."
            </p>
            <p className="text-[11px] text-gray-400 font-bold">Josephine Sintei, Civil Engineer & CEO</p>
          </div>
          <button
            onClick={() => onNavigate('our-vision')}
            className="px-5 py-2.5 bg-[#1A56A0] text-white hover:bg-[#1A56A0]/90 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
          >
            Read Our Vision & Manifesto
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl text-sm transition-all flex items-center gap-2"
          id="about-back-btn"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>
      </div>
    </div>
  );
};

export const HousePlansPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="House Plans Catalog"
    description="Browse premium engineering-verified architectural and structural layouts, curated for Nigerian environments and designed for scalability."
    onNavigate={onNavigate}
    icon={<FileText className="h-12 w-12" id="shell-plans-icon" />}
  />
);

// Removed duplicate placeholder - HireProfessionalsPage is now fully implemented in its own file.

export const EngineeringMaterialsPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Engineering Materials Marketplace"
    description="Purchase verified cement, reinforcement bars, gravel, wood, and fixtures from verified manufacturers and local sellers in Nigeria."
    onNavigate={onNavigate}
    icon={<ShoppingBag className="h-12 w-12" id="shell-materials-icon" />}
  />
);

export const EquipmentMarketplacePage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Equipment Marketplace"
    description="Rent or purchase heavy construction machinery, including excavators, concrete mixers, mobile cranes, and dump trucks."
    onNavigate={onNavigate}
    icon={<HardHat className="h-12 w-12" id="shell-equipment-icon" />}
  />
);

export const LabourMarketplacePage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Skilled Labour Marketplace"
    description="Connect with skilled site workers, including iron benders, bricklayers, plasterers, tilers, plumbers, and certified electricians."
    onNavigate={onNavigate}
    icon={<Users className="h-12 w-12" id="shell-labour-icon" />}
  />
);

export const StudentHubPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Student Hub"
    description="Acquire real-world structural modeling capabilities, bridge construction methods, and concrete design theory. Created to empower student engineers."
    onNavigate={onNavigate}
    icon={<GraduationCap className="h-12 w-12" id="shell-student-icon" />}
  />
);

export const EngineeringCommunityPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Engineering Community"
    description="Engage in robust dialogues regarding building safety codes, structural collapses prevention, and site logistics."
    onNavigate={onNavigate}
    icon={<Users className="h-12 w-12" id="shell-community-icon" />}
  />
);

export const EngineeringLibraryPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Engineering Library"
    description="Access Eurocodes, British Standards, and Nigerian building codes, technical manuals, and design standards."
    onNavigate={onNavigate}
    icon={<BookOpen className="h-12 w-12" id="shell-library-icon" />}
  />
);

export const JobsPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Engineering & Construction Jobs"
    description="Discover career roles, site engineer opportunities, drafting internships, and project manager roles across Nigerian companies."
    onNavigate={onNavigate}
    icon={<Briefcase className="h-12 w-12" id="shell-jobs-icon" />}
  />
);

export const TendersPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Government & Corporate Tenders"
    description="Browse open municipal tenders, private real estate development RFPs, and highway infrastructure construction bids."
    onNavigate={onNavigate}
    icon={<Award className="h-12 w-12" id="shell-tenders-icon" />}
  />
);

export const PricingPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Pricing & Memberships"
    description="Explore premium subscriptions, verified seller badging, professional search boosting, and unlimited tender bidding packages."
    onNavigate={onNavigate}
    icon={<ShoppingBag className="h-12 w-12" id="shell-pricing-icon" />}
  />
);

export const ContactPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Contact & Support"
    description="Reach our engineering support agents, business partnership managers, or customer resolution desk based in Lagos and Abuja."
    onNavigate={onNavigate}
    icon={<Mail className="h-12 w-12" id="shell-contact-icon" />}
  />
);

export const FAQPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Frequently Asked Questions"
    description="Find immediate solutions regarding our vetting procedures, Paystack safety, dispute resolutions, and material delivery guarantees."
    onNavigate={onNavigate}
    icon={<HelpCircle className="h-12 w-12" id="shell-faq-icon" />}
  />
);

export const PrivacyPolicyPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Privacy Policy"
    description="In compliance with the Nigeria Data Protection Act (NDPA), learn exactly how we process, catalog, and secure your personal records."
    onNavigate={onNavigate}
    icon={<Shield className="h-12 w-12" id="shell-privacy-icon" />}
  />
);

export const TermsPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <ShellPage
    title="Terms & Conditions"
    description="Read our binding service protocols, commission models, contractor dispute guidelines, and equipment lease standards."
    onNavigate={onNavigate}
    icon={<FileSignature className="h-12 w-12" id="shell-terms-icon" />}
  />
);
