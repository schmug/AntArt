import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { Direction, GameController, GameStats, AntState, AntRule } from '../types';
import { GRID_COLS, GRID_ROWS, CELL_SIZE, ANT_COLOR, POINTS_NEW_VISIT, POINTS_REVISIT, STORAGE_KEY_HIGHSCORE, TARGET_COVERAGE } from '../constants';

interface GameCanvasProps {
  isPlaying: boolean;
  speed: number;
  rule: AntRule;
  palette: string[];
  isArtMode: boolean;
  onStatsUpdate: (stats: GameStats) => void;
  onGameComplete: () => void;
}

export const GameCanvas = forwardRef<GameController, GameCanvasProps>(({ isPlaying, speed, rule, palette, isArtMode, onStatsUpdate, onGameComplete }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game State Refs
  const gridRef = useRef<Uint8Array>(new Uint8Array(GRID_COLS * GRID_ROWS));
  const visitedRef = useRef<Uint8Array>(new Uint8Array(GRID_COLS * GRID_ROWS)); 
  const antRef = useRef<AntState>({ x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2), dir: Direction.UP });
  const scoreRef = useRef<number>(0);
  const stepsRef = useRef<number>(0);
  const activeCellsRef = useRef<number>(0); // Count of non-zero cells
  const isDrawingRef = useRef<boolean>(false);
  const hasCompletedRef = useRef<boolean>(false);
  
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HIGHSCORE);
    return saved ? parseInt(saved, 10) : 0;
  });

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);

  const getIdx = (x: number, y: number) => y * GRID_COLS + x;

  const getCoverage = () => {
    return (activeCellsRef.current / (GRID_COLS * GRID_ROWS)) * 100;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grid = gridRef.current;
    const ant = antRef.current;

    // Draw Cells
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const idx = getIdx(x, y);
        const state = grid[idx];
        
        if (state !== 0 || isArtMode) {
            if (state === 0 && !isArtMode) {
                 ctx.fillStyle = '#1e293b'; 
            } else {
                 ctx.fillStyle = palette[state];
            }
            
            const gap = isArtMode ? 0 : 1; 
            const size = isArtMode ? CELL_SIZE : CELL_SIZE - 2;
            const offset = isArtMode ? 0 : 1;

            if (state !== 0 || !isArtMode) {
               ctx.fillRect(x * CELL_SIZE + offset, y * CELL_SIZE + offset, size, size);
            }
        } else {
             ctx.fillStyle = '#1e293b';
             ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
      }
    }

    // Draw Ant (Hide in Art Mode)
    if (!isArtMode) {
        ctx.save();
        const centerX = ant.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = ant.y * CELL_SIZE + CELL_SIZE / 2;
        
        ctx.translate(centerX, centerY);
        ctx.rotate((ant.dir * 90) * (Math.PI / 180));

        ctx.fillStyle = ANT_COLOR;
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(0, -CELL_SIZE / 2 + 2); 
        ctx.lineTo(CELL_SIZE / 2 - 2, CELL_SIZE / 2 - 2); 
        ctx.lineTo(-CELL_SIZE / 2 + 2, CELL_SIZE / 2 - 2); 
        ctx.fill();
        ctx.restore();
    }
  }, [palette, isArtMode]);

  const performStep = useCallback(() => {
    const grid = gridRef.current;
    const visited = visitedRef.current;
    const ant = antRef.current;
    
    const idx = getIdx(ant.x, ant.y);
    const currentState = grid[idx];

    // 1. Turn Ant based on Rule
    const turn = rule.sequence[currentState];
    
    if (turn === 'R') {
        ant.dir = (ant.dir + 1) % 4; 
    } else {
        ant.dir = (ant.dir + 3) % 4; 
    }

    // 2. Cycle Color
    const nextState = (currentState + 1) % 4;
    grid[idx] = nextState;

    // Track active cells (Non-zero)
    if (currentState === 0 && nextState !== 0) activeCellsRef.current++;
    if (currentState !== 0 && nextState === 0) activeCellsRef.current--;

    // 3. Update Score
    if (visited[idx] === 0) {
      scoreRef.current += POINTS_NEW_VISIT;
      visited[idx] = 1;
    } else {
      scoreRef.current += POINTS_REVISIT;
    }
    stepsRef.current += 1;

    // 4. Move Ant
    switch (ant.dir) {
      case Direction.UP:
        ant.y = (ant.y - 1 + GRID_ROWS) % GRID_ROWS;
        break;
      case Direction.RIGHT:
        ant.x = (ant.x + 1) % GRID_COLS;
        break;
      case Direction.DOWN:
        ant.y = (ant.y + 1) % GRID_ROWS;
        break;
      case Direction.LEFT:
        ant.x = (ant.x - 1 + GRID_COLS) % GRID_COLS;
        break;
    }
    
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      localStorage.setItem(STORAGE_KEY_HIGHSCORE, scoreRef.current.toString());
    }

    // Check completion
    const coverage = (activeCellsRef.current / (GRID_COLS * GRID_ROWS)) * 100;
    if (!hasCompletedRef.current && coverage >= TARGET_COVERAGE) {
        hasCompletedRef.current = true;
        onGameComplete();
    }

  }, [highScore, rule, onGameComplete]);

  const tick = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    let iterations = 1;
    let threshold = 0;

    if (speed < 95) {
      threshold = 500 - (speed / 95) * (500 - 16);
    } else {
      threshold = 0;
      iterations = 1 + Math.floor((speed - 95) * 10); 
    }

    if (isPlaying) {
      if (threshold > 0) {
        accumulatorRef.current += deltaTime;
        if (accumulatorRef.current >= threshold) {
          performStep();
          accumulatorRef.current = 0;
        }
      } else {
        for (let i = 0; i < iterations; i++) {
          performStep();
        }
      }
    }
    
    draw();

    // Throttle React state updates
    if (stepsRef.current % 15 === 0 || !isPlaying) {
         onStatsUpdate({
            score: scoreRef.current,
            highScore: highScore,
            steps: stepsRef.current,
            coverage: getCoverage()
        });
    }

    requestRef.current = requestAnimationFrame(tick);
  }, [isPlaying, speed, highScore, performStep, draw, onStatsUpdate]);

  useImperativeHandle(ref, () => ({
    step: () => {
      performStep();
      draw();
      onStatsUpdate({
        score: scoreRef.current,
        highScore: highScore,
        steps: stepsRef.current,
        coverage: getCoverage()
      });
    },
    reset: () => {
      gridRef.current.fill(0);
      visitedRef.current.fill(0);
      antRef.current = { x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2), dir: Direction.UP };
      scoreRef.current = 0;
      stepsRef.current = 0;
      activeCellsRef.current = 0;
      hasCompletedRef.current = false;
      draw();
      onStatsUpdate({
        score: 0,
        highScore: highScore,
        steps: 0,
        coverage: 0
      });
    },
    start: () => {},
    pause: () => {},
    getCanvasDataURL: () => {
        return canvasRef.current ? canvasRef.current.toDataURL('image/png') : null;
    }
  }));

  // Handle Interactions (Pheromones)
  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isPlaying || isArtMode) return; 

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor(((clientX - rect.left) * scaleX) / CELL_SIZE);
    const y = Math.floor(((clientY - rect.top) * scaleY) / CELL_SIZE);

    if (x >= 0 && x < GRID_COLS && y >= 0 && y < GRID_ROWS) {
        const idx = getIdx(x, y);
        const oldState = gridRef.current[idx];
        const newState = (oldState + 1) % 4;
        
        gridRef.current[idx] = newState;

        // Update active count locally
        if (oldState === 0 && newState !== 0) activeCellsRef.current++;
        if (oldState !== 0 && newState === 0) activeCellsRef.current--;
        
        draw();
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      isDrawingRef.current = true;
      handleInteraction(e);
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDrawingRef.current) handleInteraction(e);
  };
  const onMouseUp = () => {
      isDrawingRef.current = false;
  };
  const onMouseLeave = () => {
      isDrawingRef.current = false;
  };

  useEffect(() => {
    draw();
    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [tick, draw]);

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-2xl border border-slate-700 bg-slate-950 ${isArtMode ? 'border-none shadow-none rounded-none fixed inset-0 z-50' : ''}`}>
      <canvas
        ref={canvasRef}
        width={GRID_COLS * CELL_SIZE}
        height={GRID_ROWS * CELL_SIZE}
        className="w-full h-full block touch-none"
        style={{
             imageRendering: 'pixelated',
             cursor: isArtMode || isPlaying ? 'default' : 'crosshair'
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={handleInteraction}
        onTouchMove={handleInteraction}
      />
      
      {!isPlaying && stepsRef.current === 0 && !isArtMode && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] pointer-events-none">
            <p className="text-white/70 font-mono text-sm">Tap or Drag to place pheromones</p>
         </div>
      )}

      {isArtMode && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-black/50 text-white/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  Art Mode Active
              </div>
          </div>
      )}
    </div>
  );
});

GameCanvas.displayName = "GameCanvas";