import { Suspense, useRef } from 'react'
import React from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Stage, Environment, ContactShadows, OrbitControls } from '@react-three/drei'
import { Model } from '../Gaming_chair'
import { ControlPanel } from './ControlPanel'
import { useStore } from '../store'
import gsap from 'gsap'

// Компонент для управління камерою
function CameraController() {
  const { camera } = useThree()
  const activePart = useStore((state) => state.activePart)
  const cameraPositions = {
    'Спинка': { x: 0, y: 0.8, z: 2.5 },
    'Сидіння': { x: 0, y: 0, z: 2 },
    'Колеса': { x: 0, y: -0.8, z: 1.8 },
  }

  const prevPartRef = useRef(activePart)

  React.useEffect(() => {
    if (activePart !== prevPartRef.current) {
      const targetPos = cameraPositions[activePart] || { x: 0, y: 0.5, z: 2 }
      
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.5,
        ease: 'power3.inOut',
      })

      prevPartRef.current = activePart
    }
  }, [activePart, camera])

  return null
}

function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0.5, 2], fov: 50 }}>
        <Stage adjustCamera={false}>
          {/* Модель стула */}
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          
          {/* Контактные тени под моделью */}
          <ContactShadows 
            opacity={0.5} 
            scale={10} 
            blur={2.4} 
          />
        </Stage>

        {/* Реалистичное студийное освещение */}
        <Environment preset="city" />

        {/* OrbitControls з плавністю */}
        <OrbitControls 
          enableDamping
          dampingFactor={0.08}
          autoRotate={false}
          enableZoom={true}
        />

        {/* Контролер для анімації камери */}
        <CameraController />
      </Canvas>

      {/* Панель керування */}
      <ControlPanel />
    </>
  )
}

export default App
