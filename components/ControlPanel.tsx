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
    <div className="flex flex-col gap-4 w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
      
      {/* Top Row: Playback Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onTogglePlay}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                isPlaying
                  ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/50'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              }`}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              {isPlaying ? 'PAUSE' : 'START'}
            </button>

            <button
              onClick={onStep}
              disabled={isPlaying}
              className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-700"
              title="Step Forward"
            >
              <SkipForward size={20} />
            </button>

            <button
              onClick={onReset}
              className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 border border-slate-700 hover:border-red-500/50 transition-all"
              title="Reset Board"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {/* Speed Slider */}
          <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[300px] bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide min-w-[50px]">
              Speed
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                />
            </div>
          </div>
      </div>

      {/* Bottom Row: Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/50">
          
          {/* Ant Selector */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                <ChevronDown size={16} />
            </div>
            <select 
                value={currentRule.name}
                onChange={(e) => onRuleChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer hover:bg-slate-750"
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
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
          >
            <Palette size={16} />
            <span>New Colors</span>
          </button>

          {/* Art Mode Toggle */}
          <button 
            onClick={onToggleArtMode}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
                isArtMode 
                ? 'bg-purple-500 text-white border-purple-400' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Eye size={16} />
            <span>{isArtMode ? 'Exit Art Mode' : 'View Art'}</span>
          </button>
      </div>
    </div>
  );
};