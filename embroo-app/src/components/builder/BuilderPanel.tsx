'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MaterialsTab } from '@/components/builder/materials/MaterialsTab';
import { DesignsTab } from '@/components/builder/designs/DesignsTab';

type PanelTab = 'materials' | 'designs';

export function BuilderPanel() {
  const [activeTab, setActiveTab] = useState<PanelTab>('materials');

  return (
    <div className="w-full lg:w-[380px] flex-shrink-0 bg-charcoal-deep flex flex-col overflow-hidden border-r border-[var(--border)] h-[50vh] lg:h-auto">
      {/* Tab Switcher */}
      <div className="flex border-b border-[var(--border)] flex-shrink-0">
        {(['materials', 'designs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-3.5 px-2 text-[0.8rem] font-medium tracking-[0.04em] border-b-2 transition-all',
              activeTab === tab
                ? 'text-gold border-b-gold'
                : 'text-text-secondary border-b-transparent hover:text-text-primary'
            )}
          >
            {tab === 'materials' ? 'Materials & Colors' : 'Design & Patches'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:thin] [scrollbar-color:var(--color-gold-dark)_var(--color-charcoal)]">
        {activeTab === 'materials' ? <MaterialsTab /> : <DesignsTab />}
      </div>
    </div>
  );
}
