'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { ZoneKey, ZoneDesign, GarmentType, GarmentView } from '@/types';

interface GarmentCanvasProps {
  garmentType: GarmentType;
  bodyColor: string;
  hoodColor: string;
  cuffColor: string;
  view: GarmentView;
  activeZone: ZoneKey | null;
  zoneDesigns: Record<string, ZoneDesign>;
  threadColor: string;
  children: React.ReactNode;
}

function LoadingSpinner() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(212, 168, 83, 0.2)',
          borderTopColor: '#D4A853',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function GarmentCanvas({
  children,
}: GarmentCanvasProps) {
  const controlsRef = useRef(null);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas
          camera={{
            position: [0, 0.1, 1.6],
            fov: 35,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
          shadows
        >
          {/* Lighting setup for premium fabric look */}
          <ambientLight intensity={0.35} />

          {/* Key light - warm, slightly above and to the right */}
          <directionalLight
            position={[2, 3, 2]}
            intensity={0.8}
            color="#FFF5E6"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />

          {/* Fill light - cooler, from the left */}
          <directionalLight
            position={[-2, 1, 1]}
            intensity={0.3}
            color="#E6F0FF"
          />

          {/* Rim light - from behind for edge definition */}
          <directionalLight
            position={[0, 1, -2]}
            intensity={0.4}
            color="#FFF0DD"
          />

          {/* Bottom fill for underside */}
          <pointLight
            position={[0, -1.5, 1]}
            intensity={0.15}
            color="#FFF5EE"
          />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Contact shadows beneath the garment */}
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.25}
            scale={2}
            blur={2.5}
            far={1}
          />

          {/* Orbit controls with restricted vertical rotation */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={1.0}
            maxDistance={3.0}
            minPolarAngle={Math.PI * 0.3}
            maxPolarAngle={Math.PI * 0.7}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            target={[0, 0.05, 0]}
          />

          {/* Garment model rendered as children */}
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}
