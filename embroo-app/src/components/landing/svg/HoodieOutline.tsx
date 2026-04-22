export function HoodieOutlineSVG() {
  return (
    <svg
      viewBox="0 0 400 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[360px] h-auto drop-shadow-[0_20px_60px_rgba(212,168,83,0.15)]"
    >
      {/* Body */}
      <path
        d="M200 60 C160 60 130 80 120 100 L80 140 C60 160 50 180 50 200 L50 400 C50 420 60 430 80 430 L160 430 L160 380 L240 380 L240 430 L320 430 C340 430 350 420 350 400 L350 200 C350 180 340 160 320 140 L280 100 C270 80 240 60 200 60Z"
        stroke="var(--color-gold)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-stroke-draw"
      />
      {/* Hood */}
      <path
        d="M120 100 C130 50 170 20 200 20 C230 20 270 50 280 100"
        stroke="var(--color-gold)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        className="animate-stroke-draw"
        style={{ animationDelay: '0.5s' }}
      />
      {/* Kangaroo pocket */}
      <path
        d="M130 300 C130 280 160 270 200 270 C240 270 270 280 270 300 L270 350 C270 360 240 370 200 370 C160 370 130 360 130 350Z"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
        className="animate-stroke-draw"
        style={{ animationDelay: '1s' }}
      />
      {/* Center line */}
      <line
        x1="200" y1="100" x2="200" y2="380"
        stroke="var(--color-gold)" strokeWidth="1" opacity="0.3"
        strokeDasharray="4,6"
      />
      {/* Brand text */}
      <text
        x="200" y="240" textAnchor="middle"
        fill="var(--color-gold)"
        fontFamily="Cormorant Garamond, serif"
        fontSize="18"
        fontStyle="italic"
        opacity="0.6"
      >
        embroo
      </text>
    </svg>
  );
}
