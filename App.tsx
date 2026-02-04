
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Scene from './components/Scene';
import ConfiguratorUI from './components/ConfiguratorUI';
import { MaterialType, ProductConfig, ChairPart, CHAIR_PRESETS } from './types';

const VIEW_ORDER = ['front', 'side', 'detail', 'top'] as const;
const IDLE_TIMEOUT = 5000; // 5 seconds of inactivity before auto-rotate
const VIEW_INTERVAL = 4000; // 4 seconds between view changes

const App: React.FC = () => {
  const [config, setConfig] = useState<ProductConfig>({
    colors: CHAIR_PRESETS[0].colors,
    material: CHAIR_PRESETS[0].material,
    view: 'front',
    activePart: ChairPart.SEAT,
    activePreset: CHAIR_PRESETS[0].id
  });
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'in' | 'out' | null>(null);
  const [pendingPreset, setPendingPreset] = useState<string | null>(null);
  
  // Intro animation state
  const [isIntro, setIsIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  
  // Auto-rotate views on idle
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const viewIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentViewIndexRef = useRef(0);

  // Reset idle timer on any user interaction
  const resetIdleTimer = useCallback(() => {
    if (!introComplete) return;
    
    setIsIdle(false);
    
    // Clear existing timers
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (viewIntervalRef.current) {
      clearInterval(viewIntervalRef.current);
    }
    
    // Start new idle timer
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, IDLE_TIMEOUT);
  }, [introComplete]);

  // Auto-rotate views when idle
  useEffect(() => {
    if (!isIdle || !introComplete) return;
    
    // Start cycling through views
    viewIntervalRef.current = setInterval(() => {
      currentViewIndexRef.current = (currentViewIndexRef.current + 1) % VIEW_ORDER.length;
      setConfig(prev => ({
        ...prev,
        view: VIEW_ORDER[currentViewIndexRef.current]
      }));
    }, VIEW_INTERVAL);
    
    return () => {
      if (viewIntervalRef.current) {
        clearInterval(viewIntervalRef.current);
      }
    };
  }, [isIdle, introComplete]);

  // Listen for user activity
  useEffect(() => {
    if (!introComplete) return;
    
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'wheel'];
    
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });
    
    // Initial idle timer
    resetIdleTimer();
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (viewIntervalRef.current) {
        clearInterval(viewIntervalRef.current);
      }
    };
  }, [introComplete, resetIdleTimer]);

  // Handle intro animation complete
  const handleIntroComplete = useCallback(() => {
    setIsIntro(false);
    setIntroComplete(true);
  }, []);

  // Update current view index when user changes view manually
  const handleConfigChange = useCallback((newConfig: ProductConfig | ((prev: ProductConfig) => ProductConfig)) => {
    resetIdleTimer();
    setConfig(prev => {
      const updated = typeof newConfig === 'function' ? newConfig(prev) : newConfig;
      const viewIndex = VIEW_ORDER.indexOf(updated.view as typeof VIEW_ORDER[number]);
      if (viewIndex !== -1) {
        currentViewIndexRef.current = viewIndex;
      }
      return updated;
    });
  }, [resetIdleTimer]);

  const handlePresetChange = useCallback((presetId: string) => {
    if (presetId === config.activePreset || isTransitioning) return;
    
    resetIdleTimer();
    
    const preset = CHAIR_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    // Start transition out
    setIsTransitioning(true);
    setTransitionDirection('out');
    setPendingPreset(presetId);
    
    // After exit animation, change colors and start entry
    setTimeout(() => {
      setConfig(prev => ({
        ...prev,
        colors: preset.colors,
        material: preset.material,
        activePreset: presetId
      }));
      setTransitionDirection('in');
      
      // End transition
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
        setPendingPreset(null);
      }, 600);
    }, 600);
  }, [config.activePreset, isTransitioning, resetIdleTimer]);

  return (
    <div className="h-screen w-full relative bg-neutral-100 select-none overflow-hidden">
      {/* Background Text Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-black/[0.02] tracking-tighter pointer-events-none uppercase whitespace-nowrap">
        Gaming Chair
      </div>

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-10">
        <Scene 
          config={config} 
          transitionDirection={transitionDirection}
          isIntro={isIntro}
          onIntroComplete={handleIntroComplete}
        />
      </div>

      {/* UI Controls Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <ConfiguratorUI 
          config={config} 
          setConfig={handleConfigChange}
          onPresetChange={handlePresetChange}
          isTransitioning={isTransitioning}
        />
      </div>
      
      {/* Idle indicator */}
      {isIdle && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm animate-pulse">
          Auto-rotating views • Move mouse to stop
        </div>
      )}
    </div>
  );
};

export default App;
