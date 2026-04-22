import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { calculatePrice } from '@/lib/utils';
import type {
  GarmentType,
  GarmentView,
  GarmentColors,
  ZoneKey,
  DesignType,
  ZoneDesign,
  StitchType,
} from '@/types';

// ═══════════════════════════════════════════
// STATE TYPES
// ═══════════════════════════════════════════

const MAX_HISTORY = 50;

interface BuilderDesignState {
  garmentType: GarmentType;
  view: GarmentView;
  colors: GarmentColors;
  activeZone: ZoneKey | null;
  activeEditor: DesignType | null;
  zoneDesigns: Record<string, ZoneDesign>;
  threadColor: string;
  stitchType: StitchType;
  selectedFont: string;
  outline: string | null;
  isDirty: boolean;
}

interface BuilderState extends BuilderDesignState {
  history: BuilderDesignState[];
  historyIndex: number;

  // Actions — garment
  setGarmentType: (type: GarmentType) => void;
  setView: (view: GarmentView) => void;
  setColor: (section: keyof GarmentColors, hex: string) => void;

  // Actions — zone
  selectZone: (key: ZoneKey) => void;
  clearZone: () => void;
  setActiveEditor: (editor: DesignType | null) => void;
  setZoneDesign: (key: ZoneKey | string, design: ZoneDesign) => void;
  removeZoneDesign: (key: ZoneKey | string) => void;

  // Actions — design options
  setThreadColor: (color: string) => void;
  setStitchType: (type: StitchType) => void;
  setFont: (fontId: string) => void;
  setOutline: (outline: string | null) => void;

  // Actions — lifecycle
  reset: () => void;

  // Actions — history
  undo: () => void;
  redo: () => void;

  // Computed (getter-style)
  getPrice: () => ReturnType<typeof calculatePrice>;
  getActiveZoneDesign: () => ZoneDesign | null;
  getZoneCount: () => number;
}

// ═══════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════

const DEFAULT_DESIGN_STATE: BuilderDesignState = {
  garmentType: 'hoodie',
  view: 'front',
  colors: { body: '#0A0A0A', hood: '#0A0A0A', cuffs: '#0A0A0A' },
  activeZone: null,
  activeEditor: null,
  zoneDesigns: {},
  threadColor: '#000000',
  stitchType: 'embroidery',
  selectedFont: 'classic',
  outline: null,
  isDirty: false,
};

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function snapshotDesignState(state: BuilderState): BuilderDesignState {
  return {
    garmentType: state.garmentType,
    view: state.view,
    colors: { ...state.colors },
    activeZone: state.activeZone,
    activeEditor: state.activeEditor,
    zoneDesigns: structuredClone(state.zoneDesigns),
    threadColor: state.threadColor,
    stitchType: state.stitchType,
    selectedFont: state.selectedFont,
    outline: state.outline,
    isDirty: state.isDirty,
  };
}

function pushHistory(state: BuilderState): void {
  // Discard any forward history when a new change is made
  const trimmed = state.history.slice(0, state.historyIndex + 1);
  trimmed.push(snapshotDesignState(state));

  // Enforce max history length
  if (trimmed.length > MAX_HISTORY) {
    trimmed.shift();
  }

  state.history = trimmed;
  state.historyIndex = trimmed.length - 1;
}

function restoreSnapshot(state: BuilderState, snapshot: BuilderDesignState): void {
  state.garmentType = snapshot.garmentType;
  state.view = snapshot.view;
  state.colors = { ...snapshot.colors };
  state.activeZone = snapshot.activeZone;
  state.activeEditor = snapshot.activeEditor;
  state.zoneDesigns = structuredClone(snapshot.zoneDesigns);
  state.threadColor = snapshot.threadColor;
  state.stitchType = snapshot.stitchType;
  state.selectedFont = snapshot.selectedFont;
  state.outline = snapshot.outline;
  state.isDirty = snapshot.isDirty;
}

// ═══════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════

export const useBuilderStore = create<BuilderState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      ...DEFAULT_DESIGN_STATE,
      history: [],
      historyIndex: -1,

      // ── Garment ──────────────────────────

      setGarmentType: (type) =>
        set((state) => {
          pushHistory(state);
          state.garmentType = type;
          state.zoneDesigns = {};
          state.activeZone = null;
          state.activeEditor = null;
          state.isDirty = true;
        }),

      setView: (view) =>
        set((state) => {
          state.view = view;
        }),

      setColor: (section, hex) =>
        set((state) => {
          pushHistory(state);
          state.colors[section] = hex;
          state.isDirty = true;
        }),

      // ── Zone ─────────────────────────────

      selectZone: (key) =>
        set((state) => {
          state.activeZone = key;
          state.activeEditor = null;
        }),

      clearZone: () =>
        set((state) => {
          state.activeZone = null;
          state.activeEditor = null;
        }),

      setActiveEditor: (editor) =>
        set((state) => {
          state.activeEditor = editor;
        }),

      setZoneDesign: (key, design) =>
        set((state) => {
          pushHistory(state);
          state.zoneDesigns[key] = design;
          state.isDirty = true;
        }),

      removeZoneDesign: (key) =>
        set((state) => {
          pushHistory(state);
          delete state.zoneDesigns[key];
          state.isDirty = true;
        }),

      // ── Design options ───────────────────

      setThreadColor: (color) =>
        set((state) => {
          state.threadColor = color;
        }),

      setStitchType: (type) =>
        set((state) => {
          pushHistory(state);
          state.stitchType = type;
          state.isDirty = true;
        }),

      setFont: (fontId) =>
        set((state) => {
          state.selectedFont = fontId;
        }),

      setOutline: (outline) =>
        set((state) => {
          state.outline = outline;
        }),

      // ── Lifecycle ────────────────────────

      reset: () =>
        set((state) => {
          restoreSnapshot(state, DEFAULT_DESIGN_STATE);
          state.history = [];
          state.historyIndex = -1;
        }),

      // ── History ──────────────────────────

      undo: () =>
        set((state) => {
          if (state.historyIndex < 0) return;

          // If we're at the latest point, save current state first
          if (state.historyIndex === state.history.length - 1) {
            state.history.push(snapshotDesignState(state));
          }

          const snapshot = state.history[state.historyIndex];
          if (snapshot) {
            restoreSnapshot(state, snapshot);
            state.historyIndex = Math.max(state.historyIndex - 1, -1);
          }
        }),

      redo: () =>
        set((state) => {
          const nextIndex = state.historyIndex + 1;
          if (nextIndex >= state.history.length) return;

          const snapshot = state.history[nextIndex];
          if (snapshot) {
            restoreSnapshot(state, snapshot);
            state.historyIndex = nextIndex;
          }
        }),

      // ── Computed ─────────────────────────

      getPrice: () => {
        const { garmentType, zoneDesigns, stitchType } = get();
        return calculatePrice(garmentType, zoneDesigns, stitchType);
      },

      getActiveZoneDesign: () => {
        const { activeZone, zoneDesigns } = get();
        if (!activeZone) return null;
        return zoneDesigns[activeZone] ?? null;
      },

      getZoneCount: () => {
        return Object.keys(get().zoneDesigns).length;
      },
    })),
    {
      name: 'embroo-builder',
      partialize: (state) => ({
        garmentType: state.garmentType,
        view: state.view,
        colors: state.colors,
        zoneDesigns: state.zoneDesigns,
        threadColor: state.threadColor,
        stitchType: state.stitchType,
        selectedFont: state.selectedFont,
        outline: state.outline,
        isDirty: state.isDirty,
      }),
    },
  ),
);
