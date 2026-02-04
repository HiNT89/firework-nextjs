"use client";

import { useFirework } from "./FireworkContext";

export default function Controls() {
  const { state } = useFirework();

  const handlePauseClick = () => {
    if ((window as any).togglePause) {
      (window as any).togglePause();
    }
  };

  const handleSoundClick = () => {
    if ((window as any).toggleSound) {
      (window as any).toggleSound();
    }
  };

  const handleSettingsClick = () => {
    if ((window as any).toggleMenu) {
      (window as any).toggleMenu();
    }
  };

  const shouldHide = state.menuOpen || state.config.hideControls;

  return (
    <div className={`controls ${shouldHide ? "hide" : ""}`}>
      <div className="btn pause-btn" onClick={handlePauseClick}>
        <svg fill="white" width="24" height="24">
          <use href={`#icon-${state.paused ? "play" : "pause"}`} />
        </svg>
      </div>
      <div className="btn sound-btn" onClick={handleSoundClick}>
        <svg fill="white" width="24" height="24">
          <use href={`#icon-sound-${state.soundEnabled ? "on" : "off"}`} />
        </svg>
      </div>
      <div className="btn settings-btn" onClick={handleSettingsClick}>
        <svg fill="white" width="24" height="24">
          <use href="#icon-settings" />
        </svg>
      </div>
    </div>
  );
}
