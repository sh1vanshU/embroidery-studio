'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneMarker } from './ZoneMarker';
import { TextOnGarment } from './TextOnGarment';
import type { ZoneKey, ZoneDesign } from '@/types';

interface HoodieModelProps {
  bodyColor: string;
  hoodColor: string;
  cuffColor: string;
  activeZone: ZoneKey | null;
  zoneDesigns: Record<string, ZoneDesign>;
  threadColor: string;
}

// 3D zone positions: [x, y, z] and sizes [w, h] for each zone
const ZONE_3D_MAP: Record<string, { pos: [number, number, number]; size: [number, number]; label: string }> = {
  rightChest:       { pos: [-0.18, 0.22, 0.36],  size: [0.18, 0.12], label: 'Right Chest' },
  leftChest:        { pos: [0.18, 0.22, 0.36],   size: [0.18, 0.12], label: 'Left Chest' },
  rightShoulder:    { pos: [-0.32, 0.42, 0.26],  size: [0.14, 0.08], label: 'Right Shoulder' },
  leftShoulder:     { pos: [0.32, 0.42, 0.26],   size: [0.14, 0.08], label: 'Left Shoulder' },
  aboveRightElbow:  { pos: [-0.58, 0.12, 0.08],  size: [0.12, 0.10], label: 'Above Right Elbow' },
  aboveLeftElbow:   { pos: [0.58, 0.12, 0.08],   size: [0.12, 0.10], label: 'Above Left Elbow' },
  belowRightElbow:  { pos: [-0.58, -0.06, 0.08], size: [0.10, 0.10], label: 'Below Right Elbow' },
  belowLeftElbow:   { pos: [0.58, -0.06, 0.08],  size: [0.10, 0.10], label: 'Below Left Elbow' },
  front:            { pos: [0, 0.0, 0.36],        size: [0.42, 0.22], label: 'Front' },
  back:             { pos: [0, 0.15, -0.36],      size: [0.42, 0.26], label: 'Back' },
};

// Create a rounded box shape
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
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 4,
  }), [depth]);

  return (
    <mesh position={[0, 0, -depth / 2]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={0.05} />
    </mesh>
  );
}

export function HoodieModel({
  bodyColor,
  hoodColor,
  cuffColor,
  activeZone,
  zoneDesigns,
  threadColor,
}: HoodieModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle breathing animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.005;
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* === TORSO === */}
      <group position={[0, 0.05, 0]}>
        <RoundedBox
          width={0.7}
          height={0.75}
          depth={0.55}
          radius={0.06}
          color={bodyColor}
        />
      </group>

      {/* === HOOD === */}
      <group position={[0, 0.58, -0.08]}>
        {/* Hood body - half sphere */}
        <mesh>
          <sphereGeometry args={[0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={hoodColor} roughness={0.82} metalness={0.05} side={THREE.DoubleSide} />
        </mesh>
        {/* Hood brim / opening */}
        <mesh position={[0, -0.12, 0.14]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.2, 0.025, 8, 32, Math.PI]} />
          <meshStandardMaterial color={hoodColor} roughness={0.82} metalness={0.05} />
        </mesh>
      </group>

      {/* === COLLAR / NECKLINE === */}
      <mesh position={[0, 0.42, 0.04]} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[0.13, 0.03, 8, 24]} />
        <meshStandardMaterial color={bodyColor} roughness={0.85} metalness={0.03} />
      </mesh>

      {/* === RIGHT SLEEVE === */}
      <group position={[-0.42, 0.28, 0]} rotation={[0, 0, 0.55]}>
        {/* Upper sleeve */}
        <mesh>
          <cylinderGeometry args={[0.13, 0.11, 0.45, 16]} />
          <meshStandardMaterial color={bodyColor} roughness={0.8} metalness={0.05} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.10, 0.10, 0.08, 16]} />
          <meshStandardMaterial color={cuffColor} roughness={0.85} metalness={0.03} />
        </mesh>
      </group>

      {/* === LEFT SLEEVE === */}
      <group position={[0.42, 0.28, 0]} rotation={[0, 0, -0.55]}>
        {/* Upper sleeve */}
        <mesh>
          <cylinderGeometry args={[0.13, 0.11, 0.45, 16]} />
          <meshStandardMaterial color={bodyColor} roughness={0.8} metalness={0.05} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.10, 0.10, 0.08, 16]} />
          <meshStandardMaterial color={cuffColor} roughness={0.85} metalness={0.03} />
        </mesh>
      </group>

      {/* === WAISTBAND === */}
      <mesh position={[0, -0.34, 0]}>
        <boxGeometry args={[0.68, 0.06, 0.54]} />
        <meshStandardMaterial color={cuffColor} roughness={0.85} metalness={0.03} />
      </mesh>

      {/* === FRONT POCKET (kangaroo pocket) === */}
      <group position={[0, -0.06, 0.285]}>
        {/* Pocket body */}
        <mesh>
          <boxGeometry args={[0.38, 0.14, 0.012]} />
          <meshStandardMaterial
            color={bodyColor}
            roughness={0.85}
            metalness={0.03}
          />
        </mesh>
        {/* Pocket opening line */}
        <mesh position={[0, 0.065, 0.007]}>
          <boxGeometry args={[0.36, 0.006, 0.005]} />
          <meshStandardMaterial
            color={new THREE.Color(bodyColor).multiplyScalar(0.7).getStyle()}
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* === FRONT CENTER LINE (zipper/seam detail) === */}
      <mesh position={[0, 0.08, 0.282]}>
        <boxGeometry args={[0.008, 0.55, 0.005]} />
        <meshStandardMaterial
          color={new THREE.Color(bodyColor).multiplyScalar(0.75).getStyle()}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* === DRAWSTRINGS === */}
      <mesh position={[-0.05, 0.36, 0.3]}>
        <cylinderGeometry args={[0.004, 0.004, 0.18, 6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} metalness={0.0} />
      </mesh>
      <mesh position={[0.05, 0.36, 0.3]}>
        <cylinderGeometry args={[0.004, 0.004, 0.18, 6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} metalness={0.0} />
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
