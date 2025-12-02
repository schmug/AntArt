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
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${highlight ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-900 border-slate-800'}`}>
      <div className={`p-2 rounded-lg ${highlight ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div>
        <div className={`text-xl font-bold font-mono ${highlight ? 'text-indigo-400' : 'text-slate-200'}`}>
          {value}
        </div>
      </div>
    </div>
  );
};
