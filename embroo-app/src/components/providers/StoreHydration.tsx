'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';

/**
 * Persist stores are configured with `skipHydration: true` so the server and
 * the first client render emit identical HTML (no hydration mismatch). This
 * component runs on the client after mount to pull state out of localStorage.
 */
export function StoreHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useThemeStore.persist.rehydrate();
  }, []);
  return null;
}
