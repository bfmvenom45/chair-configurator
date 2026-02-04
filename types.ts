
export enum MaterialType {
  FABRIC = 'FABRIC',
  LEATHER = 'LEATHER',
  VELVET = 'VELVET'
}

export enum ChairPart {
  SEAT = 'seat',
  BACKREST = 'backrest',
  BASE = 'base'
}

export interface ChairColors {
  seat: string;
  backrest: string;
  base: string;
}

export interface ChairPreset {
  id: string;
  name: string;
  colors: ChairColors;
  material: MaterialType;
}

export interface ProductConfig {
  colors: ChairColors;
  material: MaterialType;
  view: 'front' | 'side' | 'top' | 'detail';
  activePart: ChairPart;
  activePreset: string;
}

export interface CameraViewpoint {
  position: [number, number, number];
  target: [number, number, number];
}

export const VIEWPOINTS: Record<string, CameraViewpoint> = {
  front: { position: [0, 1.5, 5], target: [0, 0.5, 0] },
  side: { position: [5, 1, 0], target: [0, 0.5, 0] },
  top: { position: [0, 6, 0.1], target: [0, 0, 0] },
  detail: { position: [1.5, 0.8, 1.5], target: [0, 0.5, 0] }
};

export const COLORS = [
  { name: 'Onyx', hex: '#1a1a1a' },
  { name: 'Sand', hex: '#d2b48c' },
  { name: 'Emerald', hex: '#046307' },
  { name: 'Royal', hex: '#1e3a8a' },
  { name: 'Terracotta', hex: '#a45a52' },
  { name: 'Cloud', hex: '#e5e5e5' }
];

export const PART_LABELS: Record<ChairPart, string> = {
  [ChairPart.SEAT]: 'Seat',
  [ChairPart.BACKREST]: 'Backrest',
  [ChairPart.BASE]: 'Base'
};

export const CHAIR_PRESETS: ChairPreset[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    colors: { seat: '#1a1a1a', backrest: '#1a1a1a', base: '#333333' },
    material: MaterialType.LEATHER
  },
  {
    id: 'arctic',
    name: 'Arctic',
    colors: { seat: '#e5e5e5', backrest: '#e5e5e5', base: '#f5f5f5' },
    material: MaterialType.FABRIC
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: { seat: '#046307', backrest: '#1a1a1a', base: '#333333' },
    material: MaterialType.LEATHER
  },
  {
    id: 'royal',
    name: 'Royal',
    colors: { seat: '#1e3a8a', backrest: '#1e3a8a', base: '#1a1a1a' },
    material: MaterialType.VELVET
  },
  {
    id: 'desert',
    name: 'Desert',
    colors: { seat: '#d2b48c', backrest: '#a45a52', base: '#333333' },
    material: MaterialType.FABRIC
  }
];
