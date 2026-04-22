'use client';

import { Suspense } from 'react';
import { BuilderTopBar } from '@/components/builder/BuilderTopBar';
import { BuilderPanel } from '@/components/builder/BuilderPanel';
import { BuilderPreview } from '@/components/builder/preview/BuilderPreview';
import { HelpModal } from '@/components/builder/HelpModal';
import { ARButton } from '@/components/ar/ARButton';

function BuilderLoading() {
  return (
    <div className="min-h-screen bg-charcoal-deep flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary text-sm">Loading builder...</p>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<BuilderLoading />}>
      <div className="h-screen flex flex-col bg-cream overflow-hidden">
        <BuilderTopBar />
        <div className="flex flex-1 overflow-hidden flex-col-reverse lg:flex-row">
          <BuilderPanel />
          <BuilderPreview />
        </div>
        <div className="fixed bottom-6 right-6 z-40">
          <ARButton />
        </div>
        <HelpModal />
      </div>
    </Suspense>
  );
}
