"use client";

import { useRef, useEffect } from "react";
import { useFirework } from "./FireworkContext";

export default function FireworkCanvas() {
  const trailsCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const { state, updateConfig, togglePause } = useFirework();
  const initRef = useRef(false);

  useEffect(() => {
    // Load main.js script which contains all the fireworks logic
    if (initRef.current) return;
    initRef.current = true;

    // Set global store reference for main.js to use
    const setupGlobalStore = () => {
      if ((window as any).store) {
        // Update store with current React state
        (window as any).store.setState({
          paused: state.paused,
          soundEnabled: state.soundEnabled,
          menuOpen: false,
          openHelpTopic: null,
          fullscreen: false,
          config: {
            quality: String(state.config.quality),
            shell: state.config.shell,
            size: String(state.config.size),
            autoLaunch: state.config.autoLaunch,
            finale: state.config.finale,
            skyLighting: String(state.config.skyLighting),
            hideControls: state.config.hideControls,
            longExposure: state.config.longExposure,
            scaleFactor: state.config.scaleFactor,
          },
        });

        // Call init if available
        if ((window as any).init) {
          (window as any).init();
        }
      }
    };

    const script = document.createElement("script");
    script.src = "/main.js";
    script.async = false;
    script.onload = () => {
      setTimeout(setupGlobalStore, 100);
    };
    document.body.appendChild(script);
  }, []);

  // Sync React context state with global store
  useEffect(() => {
    if (!(window as any).store) return;

    (window as any).store.setState({
      paused: state.paused,
      soundEnabled: state.soundEnabled,
      config: {
        ...(window as any).store.state.config,
        quality: String(state.config.quality),
        shell: state.config.shell,
        size: String(state.config.size),
        autoLaunch: state.config.autoLaunch,
        finale: state.config.finale,
        skyLighting: String(state.config.skyLighting),
        hideControls: state.config.hideControls,
        longExposure: state.config.longExposure,
        scaleFactor: state.config.scaleFactor,
      },
    });

    // Call configDidUpdate to apply changes
    if ((window as any).configDidUpdate) {
      (window as any).configDidUpdate();
    }
  }, [state.config, state.paused, state.soundEnabled]);

  return (
    <div className="canvas-container">
      <canvas ref={trailsCanvasRef} id="trails-canvas"></canvas>
      <canvas ref={mainCanvasRef} id="main-canvas"></canvas>
    </div>
  );
}
