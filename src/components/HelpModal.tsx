"use client";

import { useFirework } from "./FireworkContext";

const helpContent: Record<string, { header: string; body: string }> = {
  shellType: {
    header: "Shell Type",
    body: 'The type of firework that will be launched. Select "Random" for a nice assortment!',
  },
  shellSize: {
    header: "Shell Size",
    body: "The size of the fireworks. Modeled after real firework shell sizes, larger shells have bigger bursts with more stars, and sometimes more complex effects. However, larger shells also require more processing power and may cause lag.",
  },
  quality: {
    header: "Quality",
    body: "Overall graphics quality. If the animation is not running smoothly, try lowering the quality. High quality greatly increases the amount of sparks rendered and may cause lag.",
  },
  skyLighting: {
    header: "Sky Lighting",
    body: 'Illuminates the background as fireworks explode. If the background looks too bright on your screen, try setting it to "Dim" or "None".',
  },
  scaleFactor: {
    header: "Scale",
    body: "Allows scaling the size of all fireworks, essentially moving you closer or farther away. For larger shell sizes, it can be convenient to decrease the scale a bit, especially on phones or tablets.",
  },
  autoLaunch: {
    header: "Auto Fire",
    body: "Launches sequences of fireworks automatically. Sit back and enjoy the show, or disable to have full control.",
  },
  finaleMode: {
    header: "Finale Mode",
    body: 'Launches intense bursts of fireworks. May cause lag. Requires "Auto Fire" to be enabled.',
  },
  hideControls: {
    header: "Hide Controls",
    body: "Hides the translucent controls along the top of the screen. Useful for screenshots, or just a more seamless experience. While hidden, you can still tap the top-right corner to re-open this menu.",
  },
  fullscreen: {
    header: "Fullscreen",
    body: "Toggles fullscreen mode.",
  },
  longExposure: {
    header: "Open Shutter",
    body: "Experimental effect that preserves long streaks of light, similar to leaving a camera shutter open.",
  },
};

export default function HelpModal() {
  const { state, setOpenHelpTopic } = useFirework();

  const currentHelp = state.openHelpTopic
    ? helpContent[state.openHelpTopic]
    : null;

  return (
    <div className={`help-modal ${state.openHelpTopic ? "active" : ""}`}>
      <div
        className="help-modal__overlay"
        onClick={() => setOpenHelpTopic(null)}
      ></div>
      <div className="help-modal__dialog">
        <div className="help-modal__header">{currentHelp?.header}</div>
        <div className="help-modal__body">{currentHelp?.body}</div>
        <button
          type="button"
          className="help-modal__close-btn"
          onClick={() => setOpenHelpTopic(null)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
