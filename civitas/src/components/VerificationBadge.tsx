import React from 'react';
import { ShieldCheck, Building2 } from 'lucide-react';

export type BadgeType = 'COREN' | 'ARCON' | 'NIOB' | 'MEA' | 'COMPANY' | 'TOPREC';

interface VerificationBadgeProps {
  type: BadgeType;
  showText?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  showText = true,
  className = ''
}) => {
  // Map types to label text
  const labelMap: Record<BadgeType, string> = {
    COREN: 'COREN REGISTERED',
    ARCON: 'ARCON CERTIFIED',
    NIOB: 'NIOB BUILDER',
    MEA: 'MEA VERIFIED',
    COMPANY: 'COMPANY VERIFIED',
    TOPREC: 'TOPREC REGISTERED'
  };

  const isCompany = type === 'COMPANY';
  const label = labelMap[type] || 'MEA VERIFIED';

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#1A56A0] bg-blue-50/60 dark:bg-blue-950/20 text-[#1A56A0] dark:text-blue-400 font-black text-[9px] uppercase tracking-wider shadow-sm select-none ${className}`}
      title={label}
    >
      {isCompany ? (
        <Building2 className="h-3 w-3 flex-shrink-0 text-[#1A56A0] dark:text-blue-400" />
      ) : (
        <ShieldCheck className="h-3 w-3 flex-shrink-0 text-[#1A56A0] dark:text-blue-400" />
      )}
      {showText && <span className="font-sans">{label}</span>}
    </div>
  );
};
