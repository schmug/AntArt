import React from 'react';
import { Download, RotateCcw, Play, Camera } from 'lucide-react';
import { GameStats } from '../types';

interface ArtModalProps {
  stats: GameStats;
  onDownload: () => void;
  onContinue: () => void;
  onReset: () => void;
  ruleName: string;
  imageSrc: string | null;
}

export const ArtModal: React.FC<ArtModalProps> = ({ stats, onDownload, onContinue, onReset, ruleName, imageSrc }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-center relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="mb-4">
            <h2 className="text-3xl font-black text-white mb-1 tracking-tight flex items-center justify-center gap-3">
                <Camera size={28} className="text-indigo-400" />
                Masterpiece!
            </h2>
            <p className="text-slate-400 text-sm">
               <span className="text-indigo-400 font-semibold">{ruleName}</span> reached 
               <span className="text-white font-bold"> {stats.coverage.toFixed(1)}%</span> coverage.
            </p>
        </div>

        {/* Image Preview */}
        {imageSrc && (
            <div className="w-full bg-black rounded-lg overflow-hidden border border-slate-700 shadow-lg mb-6 shrink-0">
                <img 
                    src={imageSrc} 
                    alt="Generative Art Result" 
                    className="w-full h-auto object-contain image-pixelated" 
                    style={{ imageRendering: 'pixelated' }}
                />
            </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 shrink-0">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Steps</div>
                <div className="text-lg font-mono text-white leading-none">{stats.steps.toLocaleString()}</div>
            </div>
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Final Score</div>
                <div className="text-lg font-mono text-emerald-400 leading-none">{stats.score.toLocaleString()}</div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-auto">
            <button 
                onClick={onDownload}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
            >
                <Download size={18} />
                Save to Device
            </button>
            
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={onContinue}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                    <Play size={16} />
                    Continue
                </button>
                <button 
                    onClick={onReset}
                    className="py-3 px-4 bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700 hover:border-red-900/50"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
