import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartItem } from '@/types';

// ═══════════════════════════════════════════
// STATE TYPES
// ═══════════════════════════════════════════

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSize: (id: string, size: string) => void;
  clearCart: () => void;
  toggleSidebar: () => void;

  // Computed
  getTotal: () => number;
  getItemCount: () => number;
}

// ═══════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            state.items.push(item);
          }
        }),

      removeItem: (id) =>
        set((state) => {
          state.items = state.items.filter((i) => i.id !== id);
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return;

          if (quantity <= 0) {
            state.items = state.items.filter((i) => i.id !== id);
          } else {
            item.quantity = quantity;
          }
        }),

      updateSize: (id, size) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (item) {
            item.size = size;
          }
        }),

      clearCart: () =>
        set((state) => {
          state.items = [];
        }),

      toggleSidebar: () =>
        set((state) => {
          state.isOpen = !state.isOpen;
        }),

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    })),
    {
      name: 'embroo-cart',
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
