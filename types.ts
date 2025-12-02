export enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

export interface AntState {
  x: number;
  y: number;
  dir: Direction;
}

export interface GameStats {
  score: number;
  highScore: number;
  steps: number;
  coverage: number; // Percentage 0-100
}

export interface GameController {
  step: () => void;
  reset: () => void;
  start: () => void;
  pause: () => void;
  getCanvasDataURL: () => string | null;
}

export type TurnDirection = 'L' | 'R';

export interface AntRule {
  name: string;
  description: string;
  sequence: TurnDirection[]; // Array of length 4
}