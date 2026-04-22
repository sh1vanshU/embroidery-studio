'use client';

import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TextOnGarmentProps {
  text: string;
  position: [number, number, number];
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  maxWidth?: number;
  curveAmount?: number;
}

export function TextOnGarment({
  text,
  position,
  color = '#FFFFFF',
  fontSize = 0.06,
  maxWidth = 0.4,
  curveAmount = 0.02,
}: TextOnGarmentProps) {
  // Adjust font size based on text length
  const adjustedSize =
    text.length > 10
      ? fontSize * 0.6
      : text.length > 5
        ? fontSize * 0.8
        : fontSize;

  return (
    <group position={position}>
      {/* Slight curve: offset center text forward */}
      <group position={[0, 0, curveAmount]}>
        <Text
          fontSize={adjustedSize}
          color={color}
          anchorX="center"
          anchorY="middle"
          maxWidth={maxWidth}
          textAlign="center"
          font={undefined}
          outlineWidth={adjustedSize * 0.08}
          outlineColor="#000000"
          outlineOpacity={0.4}
        >
          {text}
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.1}
            side={THREE.FrontSide}
          />
        </Text>
      </group>
    </group>
  );
}
