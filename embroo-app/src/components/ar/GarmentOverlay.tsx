'use client';

// ═══════════════════════════════════════════
// EMBROO INDIA — GARMENT OVERLAY
// Renders garment SVG scaled to detected torso
// ═══════════════════════════════════════════

import type { TorsoBounds } from './PoseDetector';
import type { GarmentType, GarmentColors, ZoneDesign } from '@/types';

interface GarmentOverlayProps {
  torso: TorsoBounds;
  canvasWidth: number;
  canvasHeight: number;
  garmentType: GarmentType;
  colors: GarmentColors;
  zoneDesigns: Record<string, ZoneDesign>;
}

/**
 * Returns SVG elements for the garment shape.
 * Positioned and scaled to match the detected torso bounds.
 */
export function GarmentOverlay({
  torso,
  canvasWidth,
  canvasHeight,
  garmentType,
  colors,
  zoneDesigns,
}: GarmentOverlayProps) {
  // Convert normalized coordinates to pixel values
  const lsX = torso.leftShoulder.x * canvasWidth;
  const lsY = torso.leftShoulder.y * canvasHeight;
  const rsX = torso.rightShoulder.x * canvasWidth;
  const rsY = torso.rightShoulder.y * canvasHeight;

  const shoulderWidthPx = torso.shoulderWidth * canvasWidth;
  const torsoHeightPx = torso.torsoHeight * canvasHeight;
  const centerX = torso.centerX * canvasWidth;
  const centerY = torso.centerY * canvasHeight;
  const angleDeg = (torso.angle * 180) / Math.PI;

  // Garment sizing — extend slightly beyond detected landmarks
  const garmentWidth = shoulderWidthPx * 1.35;
  const garmentHeight = torsoHeightPx * 1.2;

  // Shoulder midpoint for top positioning
  const shoulderMidX = (lsX + rsX) / 2;
  const shoulderMidY = (lsY + rsY) / 2;

  // The garment top sits slightly above the shoulders
  const garmentTopY = shoulderMidY - garmentHeight * 0.12;

  // Get active front zone designs for display
  const frontDesigns = Object.entries(zoneDesigns).filter(
    ([key]) => key === 'front' || key === 'leftChest' || key === 'rightChest'
  );

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      aria-label="Garment overlay on detected body"
    >
      <g
        transform={`rotate(${angleDeg}, ${centerX}, ${centerY})`}
        style={{ opacity: 0.82 }}
      >
        {/* Main garment body */}
        {garmentType === 'hoodie' && (
          <HoodieShape
            x={shoulderMidX - garmentWidth / 2}
            y={garmentTopY}
            width={garmentWidth}
            height={garmentHeight}
            colors={colors}
          />
        )}
        {garmentType === 'tshirt' && (
          <TshirtShape
            x={shoulderMidX - garmentWidth / 2}
            y={garmentTopY}
            width={garmentWidth}
            height={garmentHeight}
            colors={colors}
          />
        )}
        {garmentType === 'polo' && (
          <PoloShape
            x={shoulderMidX - garmentWidth / 2}
            y={garmentTopY}
            width={garmentWidth}
            height={garmentHeight}
            colors={colors}
          />
        )}

        {/* Render zone designs (text, patches) on the garment */}
        {frontDesigns.map(([key, design]) => (
          <DesignElement
            key={key}
            zoneKey={key}
            design={design}
            garmentX={shoulderMidX - garmentWidth / 2}
            garmentY={garmentTopY}
            garmentWidth={garmentWidth}
            garmentHeight={garmentHeight}
          />
        ))}
      </g>
    </svg>
  );
}

// ── Garment shape components ───────────────

interface ShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  colors: GarmentColors;
}

function HoodieShape({ x, y, width, height, colors }: ShapeProps) {
  const sleeveWidth = width * 0.28;
  const sleeveLength = height * 0.55;
  const neckWidth = width * 0.22;
  const hoodHeight = height * 0.18;

  return (
    <g>
      {/* Hood */}
      <ellipse
        cx={x + width / 2}
        cy={y - hoodHeight * 0.3}
        rx={neckWidth * 1.3}
        ry={hoodHeight}
        fill={colors.hood}
        opacity={0.7}
        stroke={colors.hood}
        strokeWidth={1}
      />
      {/* Main body */}
      <rect
        x={x + sleeveWidth * 0.6}
        y={y}
        width={width - sleeveWidth * 1.2}
        height={height}
        rx={6}
        fill={colors.body}
        opacity={0.75}
      />
      {/* Left sleeve */}
      <rect
        x={x - sleeveWidth * 0.15}
        y={y}
        width={sleeveWidth}
        height={sleeveLength}
        rx={4}
        fill={colors.body}
        opacity={0.7}
        transform={`rotate(-12, ${x}, ${y})`}
      />
      {/* Right sleeve */}
      <rect
        x={x + width - sleeveWidth + sleeveWidth * 0.15}
        y={y}
        width={sleeveWidth}
        height={sleeveLength}
        rx={4}
        fill={colors.body}
        opacity={0.7}
        transform={`rotate(12, ${x + width}, ${y})`}
      />
      {/* Cuffs */}
      <rect
        x={x + sleeveWidth * 0.6}
        y={y + height - 8}
        width={width - sleeveWidth * 1.2}
        height={8}
        rx={3}
        fill={colors.cuffs}
        opacity={0.8}
      />
    </g>
  );
}

function TshirtShape({ x, y, width, height, colors }: ShapeProps) {
  const sleeveWidth = width * 0.25;
  const sleeveLength = height * 0.35;
  const bodyInset = sleeveWidth * 0.5;

  return (
    <g>
      {/* Neckline */}
      <ellipse
        cx={x + width / 2}
        cy={y + 4}
        rx={width * 0.12}
        ry={height * 0.06}
        fill="none"
        stroke={colors.body}
        strokeWidth={2}
        opacity={0.6}
      />
      {/* Main body */}
      <rect
        x={x + bodyInset}
        y={y}
        width={width - bodyInset * 2}
        height={height}
        rx={4}
        fill={colors.body}
        opacity={0.75}
      />
      {/* Left sleeve */}
      <polygon
        points={`
          ${x + bodyInset},${y}
          ${x - sleeveWidth * 0.1},${y + sleeveLength * 0.3}
          ${x - sleeveWidth * 0.1},${y + sleeveLength}
          ${x + bodyInset},${y + sleeveLength * 0.85}
        `}
        fill={colors.body}
        opacity={0.7}
      />
      {/* Right sleeve */}
      <polygon
        points={`
          ${x + width - bodyInset},${y}
          ${x + width + sleeveWidth * 0.1},${y + sleeveLength * 0.3}
          ${x + width + sleeveWidth * 0.1},${y + sleeveLength}
          ${x + width - bodyInset},${y + sleeveLength * 0.85}
        `}
        fill={colors.body}
        opacity={0.7}
      />
    </g>
  );
}

function PoloShape({ x, y, width, height, colors }: ShapeProps) {
  const bodyInset = width * 0.12;
  const sleeveLength = height * 0.38;
  const collarWidth = width * 0.16;

  return (
    <g>
      {/* Collar */}
      <polygon
        points={`
          ${x + width / 2 - collarWidth},${y - 4}
          ${x + width / 2},${y + height * 0.08}
          ${x + width / 2 + collarWidth},${y - 4}
        `}
        fill={colors.body}
        stroke={colors.cuffs}
        strokeWidth={2}
        opacity={0.8}
      />
      {/* Main body */}
      <rect
        x={x + bodyInset}
        y={y}
        width={width - bodyInset * 2}
        height={height}
        rx={4}
        fill={colors.body}
        opacity={0.75}
      />
      {/* Left sleeve */}
      <polygon
        points={`
          ${x + bodyInset},${y}
          ${x},${y + sleeveLength * 0.3}
          ${x},${y + sleeveLength}
          ${x + bodyInset},${y + sleeveLength * 0.85}
        `}
        fill={colors.body}
        opacity={0.7}
      />
      {/* Right sleeve */}
      <polygon
        points={`
          ${x + width - bodyInset},${y}
          ${x + width},${y + sleeveLength * 0.3}
          ${x + width},${y + sleeveLength}
          ${x + width - bodyInset},${y + sleeveLength * 0.85}
        `}
        fill={colors.body}
        opacity={0.7}
      />
    </g>
  );
}

// ── Design rendering on garment ────────────

interface DesignElementProps {
  zoneKey: string;
  design: ZoneDesign;
  garmentX: number;
  garmentY: number;
  garmentWidth: number;
  garmentHeight: number;
}

function DesignElement({
  zoneKey,
  design,
  garmentX,
  garmentY,
  garmentWidth,
  garmentHeight,
}: DesignElementProps) {
  // Position designs within the garment
  let dx = garmentX + garmentWidth * 0.5;
  let dy = garmentY + garmentHeight * 0.4;
  let maxWidth = garmentWidth * 0.35;

  if (zoneKey === 'leftChest') {
    dx = garmentX + garmentWidth * 0.35;
    dy = garmentY + garmentHeight * 0.22;
    maxWidth = garmentWidth * 0.2;
  } else if (zoneKey === 'rightChest') {
    dx = garmentX + garmentWidth * 0.65;
    dy = garmentY + garmentHeight * 0.22;
    maxWidth = garmentWidth * 0.2;
  }

  if (design.type === 'letters' || design.type === 'monoText' || design.type === 'text2Lines') {
    const text = design.text || design.twoLineTexts?.[0] || '';
    const secondLine = design.twoLineTexts?.[1] || '';
    const fontSize = Math.min(maxWidth * 0.3, 18);

    return (
      <g>
        <text
          x={dx}
          y={dy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={design.color || '#FFFFFF'}
          fontSize={fontSize}
          fontWeight="bold"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          {text}
        </text>
        {secondLine && (
          <text
            x={dx}
            y={dy + fontSize * 1.3}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={design.color || '#FFFFFF'}
            fontSize={fontSize * 0.85}
            fontWeight="bold"
          >
            {secondLine}
          </text>
        )}
      </g>
    );
  }

  if (design.type === 'patch' || design.type === 'textPatch' || design.type === 'patchText') {
    const patchSize = maxWidth * 0.6;
    return (
      <g>
        <rect
          x={dx - patchSize / 2}
          y={dy - patchSize / 2}
          width={patchSize}
          height={patchSize}
          rx={patchSize * 0.15}
          fill={design.color || '#D4A853'}
          opacity={0.9}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1}
        />
        {design.text && (
          <text
            x={dx}
            y={dy}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFF"
            fontSize={patchSize * 0.25}
            fontWeight="bold"
          >
            {design.text}
          </text>
        )}
      </g>
    );
  }

  // Default — show a small indicator for uploaded/AI designs
  if (design.type === 'upload' || design.type === 'ai') {
    const indicatorSize = maxWidth * 0.5;
    return (
      <rect
        x={dx - indicatorSize / 2}
        y={dy - indicatorSize / 2}
        width={indicatorSize}
        height={indicatorSize}
        rx={4}
        fill="rgba(212,168,83,0.4)"
        stroke="rgba(212,168,83,0.7)"
        strokeWidth={1}
        strokeDasharray="4 2"
      />
    );
  }

  return null;
}
