"use client";

import {
  useFirework,
  QUALITY_LOW,
  QUALITY_NORMAL,
  QUALITY_HIGH,
  SKY_LIGHT_NONE,
  SKY_LIGHT_DIM,
  SKY_LIGHT_NORMAL,
} from "./FireworkContext";

const shellNames = [
  "Random",
  "Crackle",
  "Crossette",
  "Crysanthemum",
  "Falling Leaves",
  "Floral",
  "Ghost",
  "Horse Tail",
  "Palm",
  "Ring",
  "Strobe",
  "Willow",
];

const shellSizes = ['3"', '4"', '6"', '8"', '12"', '16"'];
const scaleFactors = [0.5, 0.62, 0.75, 0.9, 1.0, 1.5, 2.0];

export default function Menu() {
  const { state } = useFirework();

  const handleConfigChange = (config: any) => {
    if ((window as any).store) {
      (window as any).store.setState({
        config: {
          ...(window as any).store.state.config,
          ...config,
        },
      });
      if ((window as any).configDidUpdate) {
        (window as any).configDidUpdate();
      }
    }
  };

  const handleMenuClose = () => {
    if ((window as any).toggleMenu) {
      (window as any).toggleMenu(false);
    }
  };

  const handleFullscreen = () => {
    if (
      typeof document !== "undefined" &&
      (document as any).fullscreenEnabled
    ) {
      if ((document as any).fullscreenElement) {
        document.exitFullscreen?.();
      } else {
        document.documentElement.requestFullscreen?.();
      }
    }
  };

  return (
    <div className={`menu ${!state.menuOpen ? "hide" : ""}`}>
      <div
        className="menu__inner-wrap"
        style={{ opacity: state.openHelpTopic ? 0.12 : 1 }}
      >
        <div
          className="btn btn--bright close-menu-btn"
          onClick={handleMenuClose}
        >
          <svg fill="white" width="24" height="24">
            <use href="#icon-close" />
          </svg>
        </div>
        <div className="menu__header">Settings</div>
        <div className="menu__subheader">For more info, click any label.</div>
        <form>
          <div className="form-option form-option--select">
            <label className="shell-type-label">Shell Type</label>
            <select
              className="shell-type"
              value={state.config.shell}
              onChange={(e) => handleConfigChange({ shell: e.target.value })}
            >
              {shellNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-option form-option--select">
            <label className="shell-size-label">Shell Size</label>
            <select
              className="shell-size"
              value={state.config.size}
              onChange={(e) => handleConfigChange({ size: e.target.value })}
            >
              {shellSizes.map((size, i) => (
                <option key={i} value={i}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="form-option form-option--select">
            <label className="quality-ui-label">Quality</label>
            <select
              className="quality-ui"
              value={state.config.quality}
              onChange={(e) => handleConfigChange({ quality: e.target.value })}
            >
              <option value={QUALITY_LOW}>Low</option>
              <option value={QUALITY_NORMAL}>Normal</option>
              <option value={QUALITY_HIGH}>High</option>
            </select>
          </div>

          <div className="form-option form-option--select">
            <label className="sky-lighting-label">Sky Lighting</label>
            <select
              className="sky-lighting"
              value={state.config.skyLighting}
              onChange={(e) =>
                handleConfigChange({ skyLighting: e.target.value })
              }
            >
              <option value={SKY_LIGHT_NONE}>None</option>
              <option value={SKY_LIGHT_DIM}>Dim</option>
              <option value={SKY_LIGHT_NORMAL}>Normal</option>
            </select>
          </div>

          <div className="form-option form-option--select">
            <label className="scaleFactor-label">Scale</label>
            <select
              className="scaleFactor"
              value={state.config.scaleFactor.toFixed(2)}
              onChange={(e) =>
                handleConfigChange({ scaleFactor: parseFloat(e.target.value) })
              }
            >
              {scaleFactors.map((factor) => (
                <option key={factor} value={factor.toFixed(2)}>
                  {factor * 100}%
                </option>
              ))}
            </select>
          </div>

          <div className="form-option form-option--checkbox">
            <label className="auto-launch-label">Auto Fire</label>
            <input
              className="auto-launch"
              type="checkbox"
              checked={state.config.autoLaunch}
              onChange={(e) =>
                handleConfigChange({ autoLaunch: e.target.checked })
              }
            />
          </div>

          <div
            className="form-option form-option--checkbox form-option--finale-mode"
            style={{ opacity: state.config.autoLaunch ? 1 : 0.32 }}
          >
            <label className="finale-mode-label">Finale Mode</label>
            <input
              className="finale-mode"
              type="checkbox"
              checked={state.config.finale}
              onChange={(e) => handleConfigChange({ finale: e.target.checked })}
            />
          </div>

          <div className="form-option form-option--checkbox">
            <label className="hide-controls-label">Hide Controls</label>
            <input
              className="hide-controls"
              type="checkbox"
              checked={state.config.hideControls}
              onChange={(e) =>
                handleConfigChange({ hideControls: e.target.checked })
              }
            />
          </div>

          <div className="form-option form-option--checkbox form-option--fullscreen">
            <label className="fullscreen-label">Fullscreen</label>
            <input
              className="fullscreen"
              type="checkbox"
              checked={state.fullscreen}
              onChange={handleFullscreen}
            />
          </div>

          <div className="form-option form-option--checkbox">
            <label className="long-exposure-label">Open Shutter</label>
            <input
              className="long-exposure"
              type="checkbox"
              checked={state.config.longExposure}
              onChange={(e) =>
                handleConfigChange({ longExposure: e.target.checked })
              }
            />
          </div>
        </form>

        <div className="credits">
          Passionately built by{" "}
          <a
            href="https://cmiller.tech/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Caleb Miller
          </a>
          .
        </div>
      </div>
    </div>
  );
}
