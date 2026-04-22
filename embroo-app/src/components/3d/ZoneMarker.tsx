'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface ZoneMarkerProps {
  position: [number, number, number];
  size: [number, number];
  label: string;
  active?: boolean;
}

export function ZoneMarker({ position, size, label, active = false }: ZoneMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Pulsing opacity animation
    const pulse = 0.08 + Math.sin(t * 3) * 0.04;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = active ? pulse * 2 : pulse;

    if (edgesRef.current) {
      const edgeMat = edgesRef.current.material as THREE.LineDashedMaterial;
      edgeMat.opacity = 0.5 + Math.sin(t * 3) * 0.3;
      // Animate dash offset for marching-ants effect
      (edgeMat as unknown as { dashOffset: number }).dashOffset = -t * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Transparent fill */}
      <mesh ref={meshRef}>
        <planeGeometry args={[size[0], size[1]]} />
        <meshBasicMaterial
          color="#D4A853"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Dashed gold outline */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.PlaneGeometry(size[0], size[1])]} />
        <lineDashedMaterial
          color="#D4A853"
          dashSize={0.03}
          gapSize={0.02}
          transparent
          opacity={0.8}
          linewidth={1}
        />
      </lineSegments>

      {/* Floating label */}
      {active && (
        <Html
          position={[0, size[1] / 2 + 0.06, 0.01]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(10, 10, 10, 0.85)',
              color: '#D4A853',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: '1px solid rgba(212, 168, 83, 0.3)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
