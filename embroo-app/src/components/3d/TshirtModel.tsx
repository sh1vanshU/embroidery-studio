'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneMarker } from './ZoneMarker';
import { TextOnGarment } from './TextOnGarment';
import type { ZoneKey, ZoneDesign } from '@/types';

interface TshirtModelProps {
  bodyColor: string;
  activeZone: ZoneKey | null;
  zoneDesigns: Record<string, ZoneDesign>;
  threadColor: string;
}

const ZONE_3D_MAP: Record<string, { pos: [number, number, number]; size: [number, number]; label: string }> = {
  rightChest:  { pos: [-0.18, 0.18, 0.31],  size: [0.18, 0.12], label: 'Right Chest' },
  leftChest:   { pos: [0.18, 0.18, 0.31],   size: [0.18, 0.12], label: 'Left Chest' },
  rightSleeve: { pos: [-0.48, 0.22, 0.06],  size: [0.12, 0.10], label: 'Right Sleeve' },
  leftSleeve:  { pos: [0.48, 0.22, 0.06],   size: [0.12, 0.10], label: 'Left Sleeve' },
  front:       { pos: [0, 0.0, 0.31],        size: [0.44, 0.24], label: 'Front' },
  back:        { pos: [0, 0.1, -0.31],       size: [0.44, 0.28], label: 'Back' },
  backNeck:    { pos: [0, 0.38, -0.28],      size: [0.20, 0.08], label: 'Back Neck' },
  pocketArea:  { pos: [0, 0.06, 0.31],       size: [0.16, 0.12], label: 'Pocket Area' },
};

function RoundedBox({ width, height, depth, radius, color, roughness = 0.8 }: {
  width: number; height: number; depth: number; radius: number; color: string; roughness?: number;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = width / 2 - radius;
    const h = height / 2 - radius;
    s.moveTo(-w, -height / 2);
    s.lineTo(w, -height / 2);
    s.quadraticCurveTo(width / 2, -height / 2, width / 2, -h);
    s.lineTo(width / 2, h);
    s.quadraticCurveTo(width / 2, height / 2, w, height / 2);
    s.lineTo(-w, height / 2);
    s.quadraticCurveTo(-width / 2, height / 2, -width / 2, h);
    s.lineTo(-width / 2, -h);
    s.quadraticCurveTo(-width / 2, -height / 2, -w, -height / 2);
    return s;
  }, [width, height, radius]);

  const extrudeSettings = useMemo(() => ({
    depth,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 3,
  }), [depth]);

  return (
    <mesh position={[0, 0, -depth / 2]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={0.05} />
    </mesh>
  );
}

export function TshirtModel({
  bodyColor,
  activeZone,
  zoneDesigns,
  threadColor,
}: TshirtModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.005;
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* === TORSO === */}
      <group position={[0, 0.02, 0]}>
        <RoundedBox
          width={0.65}
          height={0.7}
          depth={0.48}
          radius={0.05}
          color={bodyColor}
        />
      </group>

      {/* === COLLAR (crew neck) === */}
      <mesh position={[0, 0.38, 0.02]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.1, 0.025, 8, 24]} />
        <meshStandardMaterial color={bodyColor} roughness={0.85} metalness={0.03} />
      </mesh>
      {/* Collar rib detail */}
      <mesh position={[0, 0.38, 0.02]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.1, 0.028, 8, 24]} />
        <meshStandardMaterial
          color={new THREE.Color(bodyColor).multiplyScalar(0.85).getStyle()}
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>

      {/* === RIGHT SLEEVE (short) === */}
      <group position={[-0.38, 0.22, 0]} rotation={[0, 0, 0.65]}>
        <mesh>
          <cylinderGeometry args={[0.13, 0.14, 0.22, 16]} />
          <meshStandardMaterial color={bodyColor} roughness={0.8} metalness={0.05} />
        </mesh>
        {/* Sleeve hem */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.14, 0.135, 0.025, 16]} />
          <meshStandardMaterial
            color={new THREE.Color(bodyColor).multiplyScalar(0.9).getStyle()}
            roughness={0.85}
            metalness={0.03}
          />
        </mesh>
      </group>

      {/* === LEFT SLEEVE (short) === */}
      <group position={[0.38, 0.22, 0]} rotation={[0, 0, -0.65]}>
        <mesh>
          <cylinderGeometry args={[0.13, 0.14, 0.22, 16]} />
          <meshStandardMaterial color={bodyColor} roughness={0.8} metalness={0.05} />
        </mesh>
        {/* Sleeve hem */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.14, 0.135, 0.025, 16]} />
          <meshStandardMaterial
            color={new THREE.Color(bodyColor).multiplyScalar(0.9).getStyle()}
            roughness={0.85}
            metalness={0.03}
          />
        </mesh>
      </group>

      {/* === BOTTOM HEM === */}
      <mesh position={[0, -0.34, 0]}>
        <boxGeometry args={[0.63, 0.04, 0.47]} />
        <meshStandardMaterial
          color={new THREE.Color(bodyColor).multiplyScalar(0.9).getStyle()}
          roughness={0.85}
          metalness={0.03}
        />
      </mesh>

      {/* === SIDE SEAM DETAILS === */}
      <mesh position={[-0.325, 0.02, 0]}>
        <boxGeometry args={[0.005, 0.65, 0.005]} />
        <meshStandardMaterial
          color={new THREE.Color(bodyColor).multiplyScalar(0.75).getStyle()}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[0.325, 0.02, 0]}>
        <boxGeometry args={[0.005, 0.65, 0.005]} />
        <meshStandardMaterial
          color={new THREE.Color(bodyColor).multiplyScalar(0.75).getStyle()}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* === ZONE MARKERS === */}
      {Object.entries(ZONE_3D_MAP).map(([key, zone]) => {
        const isActive = activeZone === key;
        const hasDesign = !!zoneDesigns[key];
        if (!isActive && !hasDesign) return null;

        return (
          <group key={key}>
            {isActive && (
              <ZoneMarker
                position={zone.pos}
                size={zone.size}
                label={zone.label}
                active
              />
            )}
            {hasDesign && zoneDesigns[key]?.text && (
              <TextOnGarment
                text={zoneDesigns[key].text!}
                position={zone.pos}
                color={zoneDesigns[key].color || threadColor}
                fontSize={zone.size[1] * 0.5}
                maxWidth={zone.size[0]}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}
