import React from 'react';
import { Target, Eye, Compass, ArrowRight, ShieldCheck, Award, HelpCircle } from 'lucide-react';

export const OurVision: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12" id="our-vision-page-wrapper">
        
        {/* Header Hero Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
            <Compass className="h-3.5 w-3.5" /> Founder's Manifesto
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
            Building the Future of Engineering in Africa
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium italic">
            "We are not just building an app. We are building the future of engineering, industrialization, and physical structural trust across the African continent."
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 dark:border-slate-700/60 space-y-8 text-left">
          
          {/* Main Manifesto Text */}
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-slate-300">
            <p>
              Africa stands at the precipice of an unprecedented industrial revolution. With the fastest-growing urban populations on earth, the demand for safe, resilient, cost-effective infrastructure has never been more urgent. Yet, our physical building sector remains fragmented, plagued by supply chain inefficiencies, trust deficits, and a painful disconnect between academic theory and practical site execution.
            </p>
            <p className="font-semibold text-[#1A56A0] dark:text-blue-400">
              We founded My Engineering App to solve this crisis once and for all.
            </p>
            <p>
              By establishing a decentralized digital infrastructure that integrates premium architectural drawings, tested materials markets, certified professional directories, and secure escrow settlement channels, we are empowering the next generation of builders. We believe that a young engineer in Lagos, Abuja, or Accra should have the exact same design validation capacity, cost estimation precision, and regulatory backing as a seasoned practitioner anywhere in the world.
            </p>
            <p>
              This is our promise: to eliminate structural building collapses by enforcing the rigorous standards of the National Building Code; to curb construction inflation by offering transparent, local-sourcing markets; and to foster real professional credibility via registered COREN stamp controls.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-slate-700/60">
            <div className="space-y-2">
              <div className="h-9 w-9 bg-[#1A56A0]/10 text-[#1A56A0] dark:text-blue-400 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-black uppercase text-gray-900 dark:text-white">Our Mission</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                To democratize heavy engineering specifications, making professional design stamps, raw materials, and certified site labor accessible to all African developers safely.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-9 w-9 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-black uppercase text-gray-900 dark:text-white">Our Vision</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                An Africa completely free of building failures and construction fraud, driven by transparent digital escrows and localized computational physics guidelines.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-9 w-9 bg-indigo-50/10 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-black uppercase text-gray-900 dark:text-white">Our Values</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                Absolute structural safety, complete financial trust, local manufacturing empowerment, and open, accessible engineering mentorship for the youth.
              </p>
            </div>
          </div>

        </div>

        {/* Action Call for the AI Council */}
        <div className="bg-gradient-to-r from-[#1A56A0] to-indigo-700 rounded-3xl p-8 text-white text-left space-y-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-lg font-black uppercase tracking-wider">Consult the Board of Legends</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              To realize this grand vision, we have developed the **AI Council of Legends**—an advisory matrix hosting the virtual professional philosophies of history's greatest builders. Consult them on strategy, materials, and regulation today.
            </p>
          </div>
          <button
            onClick={() => onNavigate('ai-council')}
            className="px-5 py-3.5 bg-white text-blue-900 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-blue-50 transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5"
          >
            Enter Council Chambers <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
