import { create } from "zustand";
import {
  QUALITY_HIGH,
  QUALITY_NORMAL,
  QUALITY_LOW,
  SKY_LIGHT_NORMAL,
  APP_CONFIG,
  ShellName,
} from "@/config";

// Helper to get default scale factor
function getDefaultScaleFactor() {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth <= 640) return 0.9;
  if (window.innerWidth > 800 && window.innerHeight < 300) return 0.75;
  return 1;
}

// Helper to get default shell size
function getDefaultShellSize() {
  if (typeof window === "undefined") return "3";
  if (window.innerWidth > 800) return "3"; // Desktop
  if (window.innerWidth > 800 && window.innerHeight < 300) return "1.2"; // Header
  return "2"; // Mobile
}

// Helper to check if should hide controls by default
function getDefaultHideControls() {
  if (typeof window === "undefined") return false;
  return window.innerWidth > 800 && window.innerHeight < 300;
}

// Config state interface
export interface FireworkConfig {
  quality: string;
  shell: ShellName;
  size: string;
  autoLaunch: boolean;
  finale: boolean;
  skyLighting: string;
  hideControls: boolean;
  longExposure: boolean;
  scaleFactor: number;
  customText: string;
}

// Main state interface
export interface FireworkState {
  // App state
  paused: boolean;
  soundEnabled: boolean;
  menuOpen: boolean;
  openHelpTopic: string | null;
  fullscreen: boolean;

  // Config
  config: FireworkConfig;

  // Runtime quality state (derived from config)
  quality: number;
  isLowQuality: boolean;
  isNormalQuality: boolean;
  isHighQuality: boolean;

  // Canvas dimensions
  stageW: number;
  stageH: number;

  // Simulation
  simSpeed: number;
  currentFrame: number;
  speedBarOpacity: number;
  autoLaunchTime: number;

  // Actions
  togglePause: (toggle?: boolean) => void;
  toggleSound: (toggle?: boolean) => void;
  toggleMenu: (toggle?: boolean) => void;
  setFullscreen: (value: boolean) => void;
  setOpenHelpTopic: (topic: string | null) => void;
  updateConfig: (nextConfig: Partial<FireworkConfig>) => void;
  setSimSpeed: (speed: number) => void;
  setSpeedBarOpacity: (opacity: number) => void;
  setAutoLaunchTime: (time: number) => void;
  incrementFrame: () => void;
  setStageDimensions: (w: number, h: number) => void;

  // Selectors (computed values)
  isRunning: () => boolean;
  canPlaySound: () => boolean;
  getQuality: () => number;
  getShellName: () => ShellName;
  getShellSize: () => number;
  getSkyLighting: () => number;
  getScaleFactor: () => number;
  isFinaleMode: () => boolean;
}

export const useFireworkStore = create<FireworkState>()((set, get) => ({
  // Initial app state
  paused: false,
  soundEnabled: false,
  menuOpen: false,
  openHelpTopic: null,
  fullscreen: false,

  // Initial config
  config: {
    quality: String(
      APP_CONFIG.IS_HIGH_END_DEVICE ? QUALITY_HIGH : QUALITY_NORMAL,
    ),
    shell: "Random" as ShellName,
    size: getDefaultShellSize(),
    autoLaunch: true,
    finale: true,
    skyLighting: String(SKY_LIGHT_NORMAL),
    hideControls: getDefaultHideControls(),
    longExposure: false,
    scaleFactor: getDefaultScaleFactor(),
    customText: "2026",
  },

  // Runtime quality state
  quality: APP_CONFIG.IS_HIGH_END_DEVICE ? QUALITY_HIGH : QUALITY_NORMAL,
  isLowQuality: false,
  isNormalQuality: !APP_CONFIG.IS_HIGH_END_DEVICE,
  isHighQuality: APP_CONFIG.IS_HIGH_END_DEVICE,

  // Canvas dimensions
  stageW: 0,
  stageH: 0,

  // Simulation
  simSpeed: 1,
  currentFrame: 0,
  speedBarOpacity: 0,
  autoLaunchTime: 0,

  // Actions
  togglePause: (toggle) =>
    set((state) => ({
      paused: toggle !== undefined ? toggle : !state.paused,
    })),

  toggleSound: (toggle) =>
    set((state) => ({
      soundEnabled: toggle !== undefined ? toggle : !state.soundEnabled,
    })),

  toggleMenu: (toggle) =>
    set((state) => ({
      menuOpen: toggle !== undefined ? toggle : !state.menuOpen,
    })),

  setFullscreen: (value) => set({ fullscreen: value }),

  setOpenHelpTopic: (topic) => set({ openHelpTopic: topic }),

  updateConfig: (nextConfig) =>
    set((state) => {
      const newConfig = { ...state.config, ...nextConfig };
      const quality = +newConfig.quality;
      return {
        config: newConfig,
        quality,
        isLowQuality: quality === QUALITY_LOW,
        isNormalQuality: quality === QUALITY_NORMAL,
        isHighQuality: quality === QUALITY_HIGH,
      };
    }),

  setSimSpeed: (speed) => set({ simSpeed: Math.min(Math.max(speed, 0), 1) }),

  setSpeedBarOpacity: (opacity) =>
    set({ speedBarOpacity: Math.max(0, opacity) }),

  setAutoLaunchTime: (time) => set({ autoLaunchTime: time }),

  incrementFrame: () =>
    set((state) => ({ currentFrame: state.currentFrame + 1 })),

  setStageDimensions: (w, h) => set({ stageW: w, stageH: h }),

  // Selectors
  isRunning: () => {
    const state = get();
    return !state.paused && !state.menuOpen;
  },

  canPlaySound: () => {
    const state = get();
    return state.isRunning() && state.soundEnabled;
  },

  getQuality: () => +get().config.quality,

  getShellName: () => get().config.shell,

  getShellSize: () => +get().config.size,

  getSkyLighting: () => +get().config.skyLighting,

  getScaleFactor: () => get().config.scaleFactor,

  isFinaleMode: () => get().config.finale,
}));

export default useFireworkStore;
