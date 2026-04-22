'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBuilderStore } from '@/stores/builderStore';
import { GarmentCanvas } from './GarmentCanvas';
import { HoodieModel } from './HoodieModel';
import { TshirtModel } from './TshirtModel';
import * as THREE from 'three';

/**
 * Inner component that lives inside the Canvas tree
 * so it can use useFrame for smooth rotation animation.
 */
function SceneContents() {
  const {
    garmentType,
    view,
    colors,
    activeZone,
    zoneDesigns,
    threadColor,
  } = useBuilderStore();

  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);

  useEffect(() => {
    targetRotation.current = view === 'back' ? Math.PI : 0;
  }, [view]);

  useFrame(() => {
    if (!groupRef.current) return;
    const current = groupRef.current.rotation.y;
    const target = targetRotation.current;
    // Smooth lerp towards target rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(current, target, 0.08);
  });

  return (
    <group ref={groupRef}>
      {garmentType === 'tshirt' ? (
        <TshirtModel
          bodyColor={colors.body}
          activeZone={activeZone}
          zoneDesigns={zoneDesigns}
          threadColor={threadColor}
        />
      ) : (
        <HoodieModel
          bodyColor={colors.body}
          hoodColor={colors.hood}
          cuffColor={colors.cuffs}
          activeZone={activeZone}
          zoneDesigns={zoneDesigns}
          threadColor={threadColor}
        />
      )}
    </group>
  );
}

/**
 * Main exported viewer.
 * This wraps GarmentCanvas and places SceneContents inside
 * so all R3F hooks work properly.
 */
function GarmentViewerInner() {
  const {
    garmentType,
    view,
    colors,
    activeZone,
    zoneDesigns,
    threadColor,
  } = useBuilderStore();

  return (
    <GarmentCanvas
      garmentType={garmentType}
      bodyColor={colors.body}
      hoodColor={colors.hood}
      cuffColor={colors.cuffs}
      view={view}
      activeZone={activeZone}
      zoneDesigns={zoneDesigns}
      threadColor={threadColor}
    >
      <SceneContents />
    </GarmentCanvas>
  );
}

export default GarmentViewerInner;
