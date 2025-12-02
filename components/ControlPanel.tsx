import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Palette, Eye, ChevronDown } from 'lucide-react';
import { ANT_RULES } from '../constants';
import { AntRule } from '../types';

interface ControlPanelProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (val: number) => void;
  currentRule: AntRule;
  onRuleChange: (ruleName: string) => void;
  onRandomizeColors: () => void;
  isArtMode: boolean;
  onToggleArtMode: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  currentRule,
  onRuleChange,
  onRandomizeColors,
  isArtMode,
  onToggleArtMode
}) => {
  return (
    <div className="flex flex-col gap-3 w-full p-3 md:p-4 bg-slate-900 border-t md:border border-slate-800 md:rounded-2xl shadow-lg mt-auto z-10">
      
      {/* Top Row: Playback Controls */}
      <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onTogglePlay}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isPlaying
                  ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/50'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95 shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              <span className="text-sm md:text-base">{isPlaying ? 'PAUSE' : 'START'}</span>
            </button>

            <button
              onClick={onStep}
              disabled={isPlaying}
              className="p-3 aspect-square rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-700 flex items-center justify-center"
              title="Step Forward"
            >
              <SkipForward size={20} />
            </button>

            <button
              onClick={onReset}
              className="p-3 aspect-square rounded-xl bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 border border-slate-700 hover:border-red-500/50 transition-all flex items-center justify-center"
              title="Reset Board"
            >
              <RotateCcw size={20} />
            </button>
      </div>

      {/* Speed Slider Row */}
      <div className="flex items-center gap-3 bg-slate-950/30 px-3 py-2 rounded-lg border border-slate-800/50">
        <div className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide min-w-[40px]">
            Speed
        </div>
        <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
        />
      </div>

      {/* Bottom Row: Configuration */}
      <div className="flex gap-2 md:grid md:grid-cols-3">
          
          {/* Ant Selector */}
          <div className="relative group flex-grow md:flex-grow-0">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                <ChevronDown size={14} />
            </div>
            <select 
                value={currentRule.name}
                onChange={(e) => onRuleChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs md:text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer hover:bg-slate-750 truncate"
            >
                {ANT_RULES.map(rule => (
                    <option key={rule.name} value={rule.name}>
                        {rule.name}
                    </option>
                ))}
            </select>
          </div>

          {/* Random Colors */}
          <button 
            onClick={onRandomizeColors}
            className="flex items-center justify-center p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-colors aspect-square md:aspect-auto md:w-full md:gap-2"
            title="Randomize Colors"
          >
            <Palette size={18} />
            <span className="hidden md:inline text-sm">New Colors</span>
          </button>

          {/* Art Mode Toggle */}
          <button 
            onClick={onToggleArtMode}
            className={`flex items-center justify-center p-2.5 rounded-xl border aspect-square md:aspect-auto md:w-full md:gap-2 transition-all ${
                isArtMode 
                ? 'bg-purple-500 text-white border-purple-400' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={isArtMode ? 'Exit Art Mode' : 'View Art'}
          >
            <Eye size={18} />
            <span className="hidden md:inline text-sm">{isArtMode ? 'Exit Art' : 'View Art'}</span>
          </button>
      </div>
    </div>
  );
};