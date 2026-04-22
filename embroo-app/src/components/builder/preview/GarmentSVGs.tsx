interface GarmentSVGProps {
  bodyColor: string;
  hoodColor: string;
  cuffColor: string;
}

export function HoodieFrontSVG({ bodyColor, hoodColor, cuffColor }: GarmentSVGProps) {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hfGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
        </linearGradient>
      </defs>
      <path d="M200 110 L125 110 L85 145 C65 165 55 185 55 205 L55 410 C55 425 65 435 80 435 L165 435 L165 390 L235 390 L235 435 L320 435 C335 435 345 425 345 410 L345 205 C345 185 335 165 315 145 L275 110 L200 110Z" fill={bodyColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d="M200 110 L125 110 L85 145 C65 165 55 185 55 205 L55 410 C55 425 65 435 80 435 L165 435 L165 390 L235 390 L235 435 L320 435 C335 435 345 425 345 410 L345 205 C345 185 335 165 315 145 L275 110 L200 110Z" fill="url(#hfGrad)" />
      <path d="M125 110 C135 60 170 30 200 30 C230 30 265 60 275 110Z" fill={hoodColor} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <rect x="50" y="195" width="16" height="50" rx="6" fill={cuffColor} />
      <rect x="334" y="195" width="16" height="50" rx="6" fill={cuffColor} />
      <rect x="55" y="415" width="290" height="20" rx="4" fill={cuffColor} opacity="0.6" />
      <line x1="200" y1="110" x2="200" y2="390" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      <line x1="190" y1="110" x2="185" y2="160" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
      <line x1="210" y1="110" x2="215" y2="160" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
      <path d="M135 310 C135 290 165 280 200 280 C235 280 265 290 265 310 L265 355 C265 365 235 375 200 375 C165 375 135 365 135 355Z" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      <line x1="125" y1="110" x2="55" y2="230" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
      <line x1="275" y1="110" x2="345" y2="230" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
    </svg>
  );
}

export function HoodieBackSVG({ bodyColor, hoodColor, cuffColor }: GarmentSVGProps) {
  return (
    <svg viewBox="0 0 400 500" fill="none">
      <path d="M200 110 L125 110 L85 145 C65 165 55 185 55 205 L55 410 C55 425 65 435 80 435 L320 435 C335 435 345 425 345 410 L345 205 C345 185 335 165 315 145 L275 110 L200 110Z" fill={bodyColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d="M125 110 C135 60 170 30 200 30 C230 30 265 60 275 110Z" fill={hoodColor} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <rect x="50" y="195" width="16" height="50" rx="6" fill={cuffColor} />
      <rect x="334" y="195" width="16" height="50" rx="6" fill={cuffColor} />
      <rect x="55" y="415" width="290" height="20" rx="4" fill={cuffColor} opacity="0.6" />
      <line x1="200" y1="110" x2="200" y2="435" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" strokeDasharray="8,4" />
    </svg>
  );
}

export function TshirtFrontSVG({ bodyColor }: GarmentSVGProps) {
  return (
    <svg viewBox="0 0 400 480" fill="none">
      <path d="M155 80 L70 110 L40 150 L70 170 L100 155 L100 420 L300 420 L300 155 L330 170 L360 150 L330 110 L245 80 C235 65 218 55 200 55 C182 55 165 65 155 80Z" fill={bodyColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <ellipse cx="200" cy="72" rx="32" ry="18" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
    </svg>
  );
}

export function TshirtBackSVG({ bodyColor }: GarmentSVGProps) {
  return (
    <svg viewBox="0 0 400 480" fill="none">
      <path d="M155 80 L70 110 L40 150 L70 170 L100 155 L100 420 L300 420 L300 155 L330 170 L360 150 L330 110 L245 80 C240 75 220 70 200 70 C180 70 160 75 155 80Z" fill={bodyColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
    </svg>
  );
}

export function PoloFrontSVG({ bodyColor, hoodColor }: GarmentSVGProps) {
  return (
    <svg viewBox="0 0 400 480" fill="none">
      <path d="M155 80 L70 110 L40 150 L70 170 L100 155 L100 420 L300 420 L300 155 L330 170 L360 150 L330 110 L245 80 C235 65 218 55 200 55 C182 55 165 65 155 80Z" fill={bodyColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d="M165 78 L180 95 L200 100 L220 95 L235 78" fill={hoodColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <line x1="200" y1="80" x2="200" y2="140" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
      <circle cx="200" cy="100" r="3" fill="rgba(0,0,0,0.15)" />
      <circle cx="200" cy="120" r="3" fill="rgba(0,0,0,0.15)" />
    </svg>
  );
}
