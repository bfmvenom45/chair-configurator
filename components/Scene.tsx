
import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  ContactShadows, 
  Environment, 
  Loader
} from '@react-three/drei';
import * as THREE from 'three';
import ChairModel from './ChairModel';
import { ProductConfig, VIEWPOINTS } from '../types';
import gsap from 'gsap';

interface SceneProps {
  config: ProductConfig;
  transitionDirection: 'in' | 'out' | null;
  isIntro: boolean;
  onIntroComplete: () => void;
}

// Clean minimal floor
const Floor: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial 
        color="#ffffff"
        roughness={0.3}
        metalness={0}
      />
    </mesh>
  );
};

const CameraManager: React.FC<{ view: string }> = ({ view }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const viewpoint = VIEWPOINTS[view] || VIEWPOINTS.front;
    
    gsap.to(camera.position, {
      x: viewpoint.position[0],
      y: viewpoint.position[1],
      z: viewpoint.position[2],
      duration: 1.5,
      ease: "power3.inOut"
    });

    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: viewpoint.target[0],
        y: viewpoint.target[1],
        z: viewpoint.target[2],
        duration: 1.5,
        ease: "power3.inOut"
      });
    }
  }, [view, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={10}
      maxPolarAngle={Math.PI / 2 - 0.05}
      enablePan={false}
      makeDefault
    />
  );
};

// Animated chair wrapper for transitions
interface AnimatedChairProps {
  colors: ProductConfig['colors'];
  materialType: ProductConfig['material'];
  transitionDirection: 'in' | 'out' | null;
  isIntro: boolean;
  onIntroComplete: () => void;
}

const AnimatedChair: React.FC<AnimatedChairProps> = ({ colors, materialType, transitionDirection, isIntro, onIntroComplete }) => {
  const groupRef = useRef<THREE.Group>(null);
  const hasAnimated = useRef(false);
  
  // Intro animation on first load
  useEffect(() => {
    if (!groupRef.current || hasAnimated.current || !isIntro) return;
    hasAnimated.current = true;
    
    // Start from below and scaled down, rotated
    groupRef.current.position.set(0, -3, 0);
    groupRef.current.scale.set(0, 0, 0);
    groupRef.current.rotation.set(0, -Math.PI * 2, 0);
    
    const tl = gsap.timeline({
      onComplete: onIntroComplete
    });
    
    // Slow epic entrance: scale up while rising and spinning
    tl.to(groupRef.current.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 2.5,
      ease: "elastic.out(1, 0.6)"
    }, 0);
    
    tl.to(groupRef.current.position, {
      y: 0.15,
      duration: 2.2,
      ease: "power2.out"
    }, 0);
    
    tl.to(groupRef.current.rotation, {
      y: Math.PI * 0.3,
      duration: 2.5,
      ease: "power2.out"
    }, 0);
    
    // Settle down smoothly
    tl.to(groupRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.8,
      ease: "power2.inOut"
    }, 2.2);
    
    tl.to(groupRef.current.position, {
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, 2.2);
    
    tl.to(groupRef.current.rotation, {
      y: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 2.4);
    
  }, [isIntro, onIntroComplete]);
  
  // Preset transition animations
  useEffect(() => {
    if (!groupRef.current || isIntro) return;
    
    if (transitionDirection === 'out') {
      // Exit: rotate and move out to the right
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: 0.6,
        ease: "power2.in"
      });
      gsap.to(groupRef.current.position, {
        x: 5,
        duration: 0.6,
        ease: "power2.in"
      });
      gsap.to(groupRef.current.scale, {
        x: 0.8,
        y: 0.8,
        z: 0.8,
        duration: 0.6,
        ease: "power2.in"
      });
    } else if (transitionDirection === 'in') {
      // Entry: start from left, rotate in
      groupRef.current.position.x = -5;
      groupRef.current.rotation.y = -Math.PI;
      groupRef.current.scale.set(0.8, 0.8, 0.8);
      
      gsap.to(groupRef.current.rotation, {
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      });
      gsap.to(groupRef.current.position, {
        x: 0,
        duration: 0.6,
        ease: "power2.out"
      });
      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [transitionDirection, isIntro]);
  
  return (
    <group ref={groupRef}>
      <ChairModel colors={colors} materialType={materialType} />
    </group>
  );
};

const Scene: React.FC<SceneProps> = ({ config, transitionDirection, isIntro, onIntroComplete }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas 
        shadows 
        gl={{ 
          antialias: true, 
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={VIEWPOINTS.front.position} fov={35} />
        
        <Suspense fallback={null}>
          <color attach="background" args={['#f5f5f5']} />
          
          {/* Main key light */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          
          {/* Fill light */}
          <directionalLight
            position={[-5, 5, -3]}
            intensity={0.7}
          />
          
          {/* Soft ambient */}
          <ambientLight intensity={0.5} />

          <AnimatedChair 
            colors={config.colors} 
            materialType={config.material}
            transitionDirection={transitionDirection}
            isIntro={isIntro}
            onIntroComplete={onIntroComplete}
          />

          <Floor />

          {/* Clean contact shadow */}
          <ContactShadows
            position={[0, -0.59, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={1}
            resolution={512}
            color="#000000"
          />

          <Environment preset="studio" />
        </Suspense>
        
        <CameraManager view={config.view} />
      </Canvas>
      <Loader />
    </div>
  );
};

export default Scene;
