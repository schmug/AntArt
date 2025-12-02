import { AntRule } from './types';

export const GRID_COLS = 80;
export const GRID_ROWS = 50;
export const CELL_SIZE = 12; // Internal resolution multiplier
export const TARGET_COVERAGE = 25; // Stop when 25% of the board is filled

// Default Colors
export const DEFAULT_CELL_COLORS = [
  '#f1f5f9', // Slate-100 (State 0)
  '#06b6d4', // Cyan-500 (State 1)
  '#22c55e', // Green-500 (State 2)
  '#f97316', // Orange-500 (State 3)
];

export const ANT_COLOR = '#ef4444'; // Red-500

export const POINTS_NEW_VISIT = 10;
export const POINTS_REVISIT = 1;
export const STORAGE_KEY_HIGHSCORE = 'chromatic-ant-highscore';

export const ANT_RULES: AntRule[] = [
  { name: 'Classic (RLRL)', description: 'Chaotic expansion', sequence: ['R', 'L', 'R', 'L'] },
  { name: 'Weaver (LLRR)', description: 'Symmetric woven patterns', sequence: ['L', 'L', 'R', 'R'] },
  { name: 'Spinner (RLLR)', description: 'Spirals and growth', sequence: ['R', 'L', 'L', 'R'] },
  { name: 'Bouncer (RRLR)', description: 'Bounces and builds', sequence: ['R', 'R', 'L', 'R'] },
  { name: 'Boxer (LRRL)', description: 'Confined boxing patterns', sequence: ['L', 'R', 'R', 'L'] },
];

export const generateRandomPalette = (): string[] => {
  // Generate 4 distinct, vibrant colors using HSL
  const colors: string[] = [];
  const baseHue = Math.random() * 360;
  
  for (let i = 0; i < 4; i++) {
    // Spread hues out
    const hue = (baseHue + (i * 90) + (Math.random() * 30 - 15)) % 360;
    const sat = 70 + Math.random() * 30; // 70-100%
    const light = 45 + Math.random() * 25; // 45-70%
    colors.push(`hsl(${hue}, ${sat}%, ${light}%)`);
  }
  return colors;
};