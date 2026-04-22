'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HoodieOutlineSVG } from '@/components/landing/svg/HoodieOutline';

export function HeroSection() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'thread-particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.height = `${Math.random() * 80 + 30}px`;
      p.style.animationDuration = `${Math.random() * 6 + 4}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      container.appendChild(p);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-[140px] stitch-bg bg-[radial-gradient(ellipse_at_30%_50%,rgba(26,26,46,1)_0%,rgba(15,15,26,1)_100%)]">
      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 z-0" />

      <div className="relative z-[2] flex flex-col lg:flex-row items-center gap-10 lg:gap-20 max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <div
            className="text-[0.75rem] tracking-[0.4em] uppercase text-gold mb-5 opacity-0 animate-[heroFadeUp_1s_var(--ease-out)_0.3s_forwards]"
          >
            India&apos;s First 3D Embroidery Studio
          </div>
          <h1
            className="font-display text-[clamp(2.8rem,5.5vw,5rem)] font-light leading-[1.05] mb-6 opacity-0 animate-[heroFadeUp_1s_var(--ease-out)_0.5s_forwards]"
          >
            Custom Embroidery,
            <br />
            <em className="italic text-gold font-normal">Reimagined</em>
          </h1>
          <p
            className="text-[1.1rem] text-text-secondary mb-10 max-w-[480px] leading-[1.7] mx-auto lg:mx-0 opacity-0 animate-[heroFadeUp_1s_var(--ease-out)_0.7s_forwards]"
          >
            Design your own embroidered hoodies, t-shirts and more. Visualize in
            3D. Try it on with AR. Get it delivered to your door.
          </p>
          <div
            className="flex gap-4 flex-wrap justify-center lg:justify-start opacity-0 animate-[heroFadeUp_1s_var(--ease-out)_0.9s_forwards]"
          >
            <Link href="/builder">
              <Button variant="primary">Start Designing &rarr;</Button>
            </Link>
            <Button variant="outline" onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Gallery
            </Button>
          </div>
        </div>

        {/* Visual */}
        <div className="flex-shrink-0 relative flex items-center justify-center lg:w-[420px]">
          <div className="relative animate-hero-float">
            <div className="absolute w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(212,168,83,0.12)_0%,transparent_70%)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse" />
            <HoodieOutlineSVG />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
