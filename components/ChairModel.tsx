
import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialType, ChairColors } from '../types';
import { Model } from '../Gaming_chair';

interface ChairModelProps {
  colors: ChairColors;
  materialType: MaterialType;
}

const ChairModel: React.FC<ChairModelProps> = ({ colors, materialType }) => {
  const group = useRef<THREE.Group>(null);

  return (
    <group ref={group} dispose={null} position={[0, 1, 0]} rotation={[0, (145 * Math.PI) / 180, 0]}>
      <Suspense fallback={null}>
        <Model scale={[0.05, 0.05, 0.05]} colors={colors} materialType={materialType} />
      </Suspense>
    </group>
  );
};

export default ChairModel;
