import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// ═══════════════════════════════════════════
// STATE TYPES
// ═══════════════════════════════════════════

type HelpModalTab = 'design' | 'size';

interface UIState {
  isMobileMenuOpen: boolean;
  isHelpModalOpen: boolean;
  helpModalTab: HelpModalTab;
  isCartOpen: boolean;
  searchQuery: string;

  // Actions
  toggleMobileMenu: () => void;
  openHelp: (tab?: HelpModalTab) => void;
  closeHelp: () => void;
  setSearchQuery: (query: string) => void;
}

// ═══════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════

export const useUiStore = create<UIState>()(
  immer((set) => ({
    isMobileMenuOpen: false,
    isHelpModalOpen: false,
    helpModalTab: 'design',
    isCartOpen: false,
    searchQuery: '',

    toggleMobileMenu: () =>
      set((state) => {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
      }),

    openHelp: (tab) =>
      set((state) => {
        state.isHelpModalOpen = true;
        if (tab) {
          state.helpModalTab = tab;
        }
      }),

    closeHelp: () =>
      set((state) => {
        state.isHelpModalOpen = false;
      }),

    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),
  })),
);
