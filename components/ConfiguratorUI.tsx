
import React from 'react';
import { MaterialType, ProductConfig, COLORS, ChairPart, PART_LABELS, CHAIR_PRESETS } from '../types';
import { Palette, Layers, Video, ArrowRight, Armchair, Sparkles } from 'lucide-react';

interface UIProps {
  config: ProductConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProductConfig>>;
  onPresetChange: (presetId: string) => void;
  isTransitioning: boolean;
}

const ConfiguratorUI: React.FC<UIProps> = ({ config, setConfig, onPresetChange, isTransitioning }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4 md:p-6">
      {/* Header - Fixed at top */}
      <div className="pointer-events-auto fixed top-6 left-6 md:top-8 md:left-8">
        <h1 className="text-3xl md:text-5xl font-bold text-zinc-800 tracking-tighter uppercase font-display">
          Gaming <span className="text-zinc-400 font-light italic">Chair</span>
        </h1>
        <p className="text-zinc-500 mt-1 text-xs md:text-sm max-w-xs font-light tracking-wide">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
      
      {/* Pre-order button - Fixed at top right */}
      <div className="pointer-events-auto fixed top-6 right-6 md:top-8 md:right-8">
        <button className="bg-zinc-900 text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-zinc-700 transition-colors shadow-xl">
          Order Now <ArrowRight size={16} />
        </button>
      </div>

      {/* Presets - Fixed on left side */}
      <div className="pointer-events-auto fixed left-6 top-1/2 -translate-y-1/2 md:left-8">
        <div className="bg-white/90 backdrop-blur-xl border border-zinc-200 p-3 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-zinc-400 text-[9px] uppercase tracking-widest font-semibold">
            <Sparkles size={10} /> Presets
          </div>
          <div className="flex flex-col gap-2">
            {CHAIR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => !isTransitioning && onPresetChange(preset.id)}
                disabled={isTransitioning}
                className={`group relative w-12 h-12 rounded-xl transition-all duration-300 overflow-hidden ${
                  config.activePreset === preset.id 
                    ? 'ring-2 ring-zinc-900 ring-offset-2 scale-105 shadow-lg' 
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                } ${isTransitioning ? 'cursor-wait' : 'cursor-pointer'}`}
                title={preset.name}
              >
                {/* Mini chair preview with colors */}
                <div className="absolute inset-0 flex flex-col">
                  <div 
                    className="flex-1 rounded-t-lg" 
                    style={{ backgroundColor: preset.colors.backrest }}
                  />
                  <div 
                    className="h-1/3" 
                    style={{ backgroundColor: preset.colors.seat }}
                  />
                  <div 
                    className="h-2 rounded-b-lg" 
                    style={{ backgroundColor: preset.colors.base }}
                  />
                </div>
                {/* Name tooltip on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold uppercase">{preset.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Container - At bottom */}
      <div className="pointer-events-auto w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-3 md:items-end mb-2">
        
        {/* Chair Parts Selection */}
        <div className="bg-white/90 backdrop-blur-xl border border-zinc-200 p-3 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-[9px] uppercase tracking-widest font-semibold">
            <Armchair size={10} /> Part
          </div>
          <div className="flex gap-1.5">
            {Object.values(ChairPart).map((part) => (
              <button
                key={part}
                onClick={() => setConfig(prev => ({ ...prev, activePart: part }))}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-medium uppercase tracking-wider transition-all ${
                  config.activePart === part 
                  ? 'bg-zinc-900 text-white shadow-md' 
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {PART_LABELS[part]}
              </button>
            ))}
          </div>
          {/* Current part colors indicator */}
          <div className="mt-2 flex gap-1.5 items-center">
            {Object.values(ChairPart).map((part) => (
              <div 
                key={part}
                className={`flex flex-col items-center ${config.activePart === part ? 'opacity-100' : 'opacity-40'}`}
              >
                <div 
                  className={`w-4 h-4 rounded-full border-2 transition-all ${config.activePart === part ? 'border-zinc-900 scale-110' : 'border-zinc-200'}`}
                  style={{ backgroundColor: config.colors[part] }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Colors Selection */}
        <div className="flex-1 bg-white/90 backdrop-blur-xl border border-zinc-200 p-3 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-[9px] uppercase tracking-widest font-semibold">
            <Palette size={10} /> {PART_LABELS[config.activePart]} Color
          </div>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setConfig(prev => ({ 
                  ...prev, 
                  colors: { ...prev.colors, [prev.activePart]: c.hex },
                  activePreset: 'custom'
                }))}
                className={`w-7 h-7 rounded-full transition-all duration-300 transform hover:scale-110 border border-zinc-200 ${
                  config.colors[config.activePart] === c.hex ? 'ring-2 ring-zinc-900 ring-offset-2 ring-offset-white scale-110 shadow-md' : 'opacity-80'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Materials & Views */}
        <div className="flex gap-3 w-full md:w-auto">
          {/* Materials */}
          <div className="bg-white/90 backdrop-blur-xl border border-zinc-200 p-3 rounded-2xl shadow-lg">
             <div className="flex items-center gap-2 mb-2 text-zinc-400 text-[9px] uppercase tracking-widest font-semibold">
              <Layers size={10} /> Material
            </div>
            <div className="flex gap-1.5">
              {[MaterialType.FABRIC, MaterialType.LEATHER].map((m) => (
                <button
                  key={m}
                  onClick={() => setConfig(prev => ({ ...prev, material: m }))}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-medium uppercase tracking-wider transition-all ${
                    config.material === m 
                    ? 'bg-zinc-900 text-white shadow-md' 
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Views */}
          <div className="bg-white/90 backdrop-blur-xl border border-zinc-200 p-3 rounded-2xl shadow-lg">
             <div className="flex items-center gap-2 mb-2 text-zinc-400 text-[9px] uppercase tracking-widest font-semibold">
              <Video size={10} /> View
            </div>
            <div className="flex gap-1">
              {['front', 'side', 'top', 'detail'].map((v) => (
                <button
                  key={v}
                  onClick={() => setConfig(prev => ({ ...prev, view: v as any }))}
                  className={`px-1.5 py-1 rounded-md text-[8px] font-bold uppercase transition-all ${
                    config.view === v 
                    ? 'bg-zinc-900 text-white' 
                    : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer Details - Compact at bottom */}
      <div className="pointer-events-auto mt-3 flex justify-between items-center px-2">
        <div className="text-zinc-300 text-[8px] uppercase tracking-[0.2em]">
          Configurator / {currentYear}
        </div>
        <div className="flex gap-4 items-center">
          <a 
            href="https://dev.bushko" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 text-[9px] hover:text-zinc-600 transition-colors"
          >
            dev.bushko
          </a>
          <div className="bg-zinc-900 text-white px-3 py-1 rounded-full">
            <span className="text-xs font-semibold">$1,499</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguratorUI;
