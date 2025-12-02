import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, highlight }) => {
  return (
    <div className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border ${highlight ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-900 border-slate-800'}`}>
      <div className={`p-1.5 md:p-2 rounded-md md:rounded-lg ${highlight ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
        <Icon size={16} className="md:w-5 md:h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider truncate">{label}</div>
        <div className={`text-sm md:text-xl font-bold font-mono truncate ${highlight ? 'text-indigo-400' : 'text-slate-200'}`}>
          {value}
        </div>
      </div>
    </div>
  );
};