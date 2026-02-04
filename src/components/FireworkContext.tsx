"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

// Quality constants
export const QUALITY_LOW = 1;
export const QUALITY_NORMAL = 2;
export const QUALITY_HIGH = 3;

export const SKY_LIGHT_NONE = 0;
export const SKY_LIGHT_DIM = 1;
export const SKY_LIGHT_NORMAL = 2;

// Device detection
const IS_MOBILE =
  typeof window !== "undefined" ? window.innerWidth <= 640 : false;
const IS_DESKTOP =
  typeof window !== "undefined" ? window.innerWidth > 800 : false;
const IS_HEADER =
  IS_DESKTOP && typeof window !== "undefined" && window.innerHeight < 300;
const IS_HIGH_END_DEVICE = (() => {
  if (typeof window === "undefined") return false;
  const hwConcurrency = navigator.hardwareConcurrency;
  if (!hwConcurrency) return false;
  const minCount = window.innerWidth <= 1024 ? 4 : 8;
  return hwConcurrency >= minCount;
})();

function getDefaultScaleFactor() {
  if (IS_MOBILE) return 0.9;
  if (IS_HEADER) return 0.75;
  return 1;
}

interface FireworkConfig {
  quality: string;
  shell: string;
  size: string;
  autoLaunch: boolean;
  finale: boolean;
  skyLighting: string;
  hideControls: boolean;
  longExposure: boolean;
  scaleFactor: number;
}

interface FireworkState {
  paused: boolean;
  soundEnabled: boolean;
  menuOpen: boolean;
  openHelpTopic: string | null;
  fullscreen: boolean;
  config: FireworkConfig;
}

interface FireworkContextType {
  state: FireworkState;
  togglePause: (toggle?: boolean) => void;
  toggleSound: (toggle?: boolean) => void;
  toggleMenu: (toggle?: boolean) => void;
  updateConfig: (config: Partial<FireworkConfig>) => void;
  setOpenHelpTopic: (topic: string | null) => void;
  setFullscreen: (fullscreen: boolean) => void;
}

const FireworkContext = createContext<FireworkContextType | null>(null);

export function useFirework() {
  const context = useContext(FireworkContext);
  if (!context) {
    throw new Error("useFirework must be used within FireworkProvider");
  }
  return context;
}

export function FireworkProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FireworkState>({
    paused: false,
    soundEnabled: false,
    menuOpen: false,
    openHelpTopic: null,
    fullscreen: false,
    config: {
      quality: String(IS_HIGH_END_DEVICE ? QUALITY_HIGH : QUALITY_NORMAL),
      shell: "Random",
      size: IS_DESKTOP ? "3" : IS_HEADER ? "1.2" : "2",
      autoLaunch: true,
      finale: false,
      skyLighting: String(SKY_LIGHT_NORMAL),
      hideControls: IS_HEADER,
      longExposure: false,
      scaleFactor: getDefaultScaleFactor(),
    },
  });

  // Load state from localStorage on mount
  useEffect(() => {
    if (IS_HEADER) return;

    try {
      const savedState = localStorage.getItem("fireworkState");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setState((prev) => ({
          ...prev,
          soundEnabled: parsed.soundEnabled ?? prev.soundEnabled,
          config: { ...prev.config, ...parsed.config },
        }));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    if (IS_HEADER) return;

    try {
      const stateToPersist = {
        soundEnabled: state.soundEnabled,
        config: state.config,
      };
      localStorage.setItem("fireworkState", JSON.stringify(stateToPersist));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [state.soundEnabled, state.config]);

  const togglePause = useCallback((toggle?: boolean) => {
    setState((prev) => ({
      ...prev,
      paused: typeof toggle === "boolean" ? toggle : !prev.paused,
    }));
  }, []);

  const toggleSound = useCallback((toggle?: boolean) => {
    setState((prev) => ({
      ...prev,
      soundEnabled: typeof toggle === "boolean" ? toggle : !prev.soundEnabled,
    }));
  }, []);

  const toggleMenu = useCallback((toggle?: boolean) => {
    setState((prev) => ({
      ...prev,
      menuOpen: typeof toggle === "boolean" ? toggle : !prev.menuOpen,
    }));
  }, []);

  const updateConfig = useCallback((config: Partial<FireworkConfig>) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, ...config },
    }));
  }, []);

  const setOpenHelpTopic = useCallback((topic: string | null) => {
    setState((prev) => ({ ...prev, openHelpTopic: topic }));
  }, []);

  const setFullscreen = useCallback((fullscreen: boolean) => {
    setState((prev) => ({ ...prev, fullscreen }));
  }, []);

  return (
    <FireworkContext.Provider
      value={{
        state,
        togglePause,
        toggleSound,
        toggleMenu,
        updateConfig,
        setOpenHelpTopic,
        setFullscreen,
      }}
    >
      {children}
    </FireworkContext.Provider>
  );
}
