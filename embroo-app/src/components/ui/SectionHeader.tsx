interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeader({ label, title, subtitle, center = false }: SectionHeaderProps) {
  return (
    <div className={`mb-15 ${center ? 'text-center' : ''}`}>
      <div className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">
        {label}
      </div>
      <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.15] mb-4">
        {title}
      </h2>
      <div className={`gold-line my-5 ${center ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className={`text-text-secondary text-base max-w-[560px] ${center ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
