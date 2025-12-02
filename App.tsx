import React, { useState, useRef, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { ControlPanel } from './components/ControlPanel';
import { StatCard } from './components/StatCard';
import { ArtModal } from './components/ArtModal';
import { GameController, GameStats, AntRule } from './types';
import { DEFAULT_CELL_COLORS, ANT_RULES, generateRandomPalette, TARGET_COVERAGE } from './constants';
import { Trophy, Hash, Target, HelpCircle, ArrowLeft, Percent } from 'lucide-react';

export default function App() {
  const gameRef = useRef<GameController>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    steps: 0,
    coverage: 0
  });

  // New State for features
  const [currentRule, setCurrentRule] = useState<AntRule>(ANT_RULES[0]);
  const [palette, setPalette] = useState<string[]>(DEFAULT_CELL_COLORS);
  const [isArtMode, setIsArtMode] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);

  const handleStatsUpdate = useCallback((newStats: GameStats) => {
    setStats(newStats);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStep = () => {
    gameRef.current?.step();
  };

  const handleReset = () => {
    setIsPlaying(false);
    setShowCompletionModal(false);
    setFinalImage(null);
    gameRef.current?.reset();
  };

  const handleRuleChange = (ruleName: string) => {
      const rule = ANT_RULES.find(r => r.name === ruleName);
      if (rule) {
          setCurrentRule(rule);
          handleReset(); // Resetting prevents rule conflict with existing grid state
      }
  };

  const handleRandomizeColors = () => {
      setPalette(generateRandomPalette());
  };

  const toggleArtMode = () => {
      setIsArtMode(!isArtMode);
  };

  const handleGameComplete = useCallback(() => {
    setIsPlaying(false);
    // Capture state immediately for the modal
    const dataUrl = gameRef.current?.getCanvasDataURL();
    setFinalImage(dataUrl || null);
    setShowCompletionModal(true);
  }, []);

  const handleContinuePainting = () => {
    setShowCompletionModal(false);
    setIsPlaying(true);
  };

  const handleDownloadArt = () => {
    // If we already captured it for the modal, use that. Otherwise capture fresh.
    const dataUrl = finalImage || gameRef.current?.getCanvasDataURL();
    if (dataUrl) {
        const link = document.createElement('a');
        link.download = `chromatic-ant-${stats.steps}.png`;
        link.href = dataUrl;
        link.click();
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col items-center overflow-hidden">
      
      {/* Art Modal Overlay */}
      {showCompletionModal && (
          <ArtModal 
            stats={stats}
            ruleName={currentRule.name}
            imageSrc={finalImage}
            onDownload={handleDownloadArt}
            onContinue={handleContinuePainting}
            onReset={handleReset}
          />
      )}

      {/* Art Mode Exit Button (Floating) */}
      {isArtMode && !showCompletionModal && (
          <button 
            onClick={toggleArtMode}
            className="fixed top-6 left-6 z-[60] flex items-center gap-2 px-4 py-2 bg-black/60 text-white rounded-full backdrop-blur-md hover:bg-black/80 transition-all border border-white/10"
          >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">Back to Controls</span>
          </button>
      )}

      {/* Header - Compact on Mobile */}
      <header className={`w-full max-w-5xl px-4 py-3 md:py-6 flex items-start md:items-end justify-between gap-4 transition-opacity duration-500 shrink-0 ${isArtMode ? 'opacity-0 pointer-events-none h-0 py-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-5xl font-black tracking-tight text-white mb-1 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent truncate">
            Chromatic Ant
          </h1>
          <p className="text-slate-400 max-w-md text-xs md:text-base leading-tight md:leading-relaxed truncate">
            {currentRule.description} <br className="hidden md:inline"/>
            <span className="text-slate-500">Sequence: {currentRule.sequence.join('-')}</span>
          </p>
        </div>
        
        <div className="flex gap-2 md:gap-4 shrink-0">
           {/* Hide High Score in header on mobile to save space, shown in grid below */}
           <div className="hidden md:block">
              <StatCard label="High Score" value={stats.highScore} icon={Trophy} highlight />
           </div>
           <div className="hidden md:block w-px bg-slate-800 h-12 self-center mx-2"></div>
           <a href="https://en.wikipedia.org/wiki/Langton%27s_ant" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 transition-all" title="About Langton's Ant">
              <HelpCircle size={18} className="md:w-5 md:h-5" />
           </a>
        </div>
      </header>

      {/* Main Game Area */}
      <main className={`w-full max-w-5xl px-3 md:px-6 flex flex-col gap-3 md:gap-6 pb-2 transition-all duration-500 flex-1 min-h-0 ${isArtMode ? 'p-0 max-w-none h-screen pb-0' : ''}`}>
        
        {/* Stats Grid - Responsive */}
        {!isArtMode && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 shrink-0">
              {/* On mobile, High Score appears here */}
              <div className="md:hidden">
                 <StatCard label="High Score" value={stats.highScore} icon={Trophy} highlight />
              </div>
              <div className="hidden md:block">
                  <StatCard label="Current Score" value={stats.score} icon={Target} />
              </div>
              {/* On mobile, Current Score is here */}
              <div className="md:hidden">
                 <StatCard label="Current" value={stats.score} icon={Target} />
              </div>

              <StatCard label="Steps" value={stats.steps} icon={Hash} />
              
              {/* Coverage Bar */}
              <div className="col-span-2 md:col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 flex items-center justify-between text-sm text-slate-400 relative overflow-hidden">
                  <div className="absolute left-0 bottom-0 h-1 bg-indigo-500/20 w-full">
                      <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(stats.coverage / TARGET_COVERAGE) * 100}%` }}></div>
                  </div>
                  
                  <div className="flex items-center gap-2 md:gap-4">
                      <div className="flex items-center gap-2">
                          <Percent size={14} className="text-cyan-400 md:w-4 md:h-4" />
                          <span className="text-xs md:text-sm whitespace-nowrap">Cov: {stats.coverage.toFixed(1)}%</span>
                      </div>
                  </div>
                  
                  <div className="flex gap-1.5 md:gap-2">
                      {palette.map((color, i) => (
                          <div 
                              key={i} 
                              className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ring-1 ring-white/10" 
                              style={{ backgroundColor: color }} 
                          ></div>
                      ))}
                  </div>
              </div>
            </div>
        )}

        {/* Canvas - Flex Grow on Mobile to fill space */}
        <div className={`transition-all duration-500 flex-1 relative min-h-[250px] ${
            isArtMode 
            ? 'w-full h-screen rounded-none' 
            : 'w-full md:aspect-[1.66] bg-slate-900 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10'
        }`}>
          <GameCanvas 
            ref={gameRef}
            isPlaying={isPlaying}
            speed={speed}
            rule={currentRule}
            palette={palette}
            isArtMode={isArtMode}
            onStatsUpdate={handleStatsUpdate}
            onGameComplete={handleGameComplete}
          />
        </div>

        {/* Controls - Sticky Bottom or Just Flow */}
        {!isArtMode && (
            <ControlPanel 
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onStep={handleStep}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
            currentRule={currentRule}
            onRuleChange={handleRuleChange}
            onRandomizeColors={handleRandomizeColors}
            isArtMode={isArtMode}
            onToggleArtMode={toggleArtMode}
            />
        )}
        
      </main>
    </div>
  );
}