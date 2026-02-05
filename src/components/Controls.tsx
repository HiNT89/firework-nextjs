"use client";
import React, { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faPause,
  faPlay,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "antd";
import { useFireworkStore } from "@/stores/useFireworkStore";
import {
  SHELL_NAMES,
  SHELL_SIZES,
  SCALE_FACTOR_OPTIONS,
  QUALITY_LOW,
  QUALITY_NORMAL,
  QUALITY_HIGH,
  SKY_LIGHT_NONE,
  SKY_LIGHT_DIM,
  SKY_LIGHT_NORMAL,
  helpContent,
} from "@/config";

const Controls = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [currentHelpTopic, setCurrentHelpTopic] = useState<
    keyof typeof helpContent | null
  >(null);

  // Use selectors to get only what we need (stable references)
  const paused = useFireworkStore((state) => state.paused);
  const soundEnabled = useFireworkStore((state) => state.soundEnabled);
  const menuOpen = useFireworkStore((state) => state.menuOpen);
  const config = useFireworkStore((state) => state.config);
  const togglePause = useFireworkStore((state) => state.togglePause);
  const toggleSound = useFireworkStore((state) => state.toggleSound);
  const updateConfig = useFireworkStore((state) => state.updateConfig);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCloseHelpModal = useCallback(() => {
    setHelpModalOpen(false);
  }, []);

  const showHelp = useCallback((topic: keyof typeof helpContent) => {
    setCurrentHelpTopic(topic);
    setHelpModalOpen(true);
  }, []);

  return (
    <>
      {/* Control buttons */}
      <div
        className={`controls absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 ${
          menuOpen || config.hideControls ? "opacity-0" : "opacity-100"
        } transition-opacity`}
      >
        <button
          className="cursor-pointer p-2 hover:opacity-70"
          onClick={() => togglePause()}
          title={paused ? "Play" : "Pause"}
        >
          <FontAwesomeIcon icon={paused ? faPlay : faPause} size="lg" />
        </button>

        <button
          className="cursor-pointer p-2 hover:opacity-70"
          onClick={() => toggleSound()}
          title={soundEnabled ? "Mute" : "Unmute"}
        >
          <FontAwesomeIcon
            icon={soundEnabled ? faVolumeUp : faVolumeMute}
            size="lg"
          />
        </button>

        <button
          className="cursor-pointer p-2 hover:opacity-70"
          onClick={showModal}
          title="Settings"
        >
          <FontAwesomeIcon icon={faGear} size="lg" />
        </button>
      </div>

      {/* Settings Modal */}
      <Modal
        title="Settings"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <div className="space-y-4">
          {/* Shell Type */}
          <div className="form-option">
            <label
              className="block text-sm font-medium mb-1 cursor-help"
              onClick={() => showHelp("shellType")}
            >
              Shell Type
            </label>
            <select
              className="w-full p-2 border rounded bg-white text-black"
              value={config.shell}
              onChange={(e) => updateConfig({ shell: e.target.value as any })}
            >
              {SHELL_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Shell Size */}
          <div className="form-option">
            <label
              className="block text-sm font-medium mb-1 cursor-help"
              onClick={() => showHelp("shellSize")}
            >
              Shell Size
            </label>
            <select
              className="w-full p-2 border rounded bg-white text-black"
              value={config.size}
              onChange={(e) => updateConfig({ size: e.target.value })}
            >
              {SHELL_SIZES.map((size, i) => (
                <option key={size} value={i}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Quality */}
          <div className="form-option">
            <label
              className="block text-sm font-medium mb-1 cursor-help"
              onClick={() => showHelp("quality")}
            >
              Quality
            </label>
            <select
              className="w-full p-2 border rounded bg-white text-black"
              value={config.quality}
              onChange={(e) => updateConfig({ quality: e.target.value })}
            >
              <option value={QUALITY_LOW}>Low</option>
              <option value={QUALITY_NORMAL}>Normal</option>
              <option value={QUALITY_HIGH}>High</option>
            </select>
          </div>

          {/* Sky Lighting */}
          <div className="form-option">
            <label
              className="block text-sm font-medium mb-1 cursor-help"
              onClick={() => showHelp("skyLighting")}
            >
              Sky Lighting
            </label>
            <select
              className="w-full p-2 border rounded bg-white text-black"
              value={config.skyLighting}
              onChange={(e) => updateConfig({ skyLighting: e.target.value })}
            >
              <option value={SKY_LIGHT_NONE}>None</option>
              <option value={SKY_LIGHT_DIM}>Dim</option>
              <option value={SKY_LIGHT_NORMAL}>Normal</option>
            </select>
          </div>

          {/* Scale Factor */}
          <div className="form-option">
            <label
              className="block text-sm font-medium mb-1 cursor-help"
              onClick={() => showHelp("scaleFactor")}
            >
              Scale
            </label>
            <select
              className="w-full p-2 border rounded bg-white text-black"
              value={config.scaleFactor.toFixed(2)}
              onChange={(e) =>
                updateConfig({ scaleFactor: parseFloat(e.target.value) })
              }
            >
              {SCALE_FACTOR_OPTIONS.map((value) => (
                <option key={value} value={value.toFixed(2)}>
                  {value * 100}%
                </option>
              ))}
            </select>
          </div>

          {/* Auto Launch */}
          <div className="form-option flex items-center justify-between">
            <label
              className="text-sm font-medium cursor-help"
              onClick={() => showHelp("autoLaunch")}
            >
              Auto Fire
            </label>
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={config.autoLaunch}
              onChange={(e) => updateConfig({ autoLaunch: e.target.checked })}
            />
          </div>

          {/* Finale Mode */}
          <div
            className="form-option flex items-center justify-between"
            style={{ opacity: config.autoLaunch ? 1 : 0.32 }}
          >
            <label
              className="text-sm font-medium cursor-help"
              onClick={() => showHelp("finaleMode")}
            >
              Finale Mode
            </label>
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={config.finale}
              disabled={!config.autoLaunch}
              onChange={(e) => updateConfig({ finale: e.target.checked })}
            />
          </div>

          {/* Long Exposure */}
          <div className="form-option flex items-center justify-between">
            <label
              className="text-sm font-medium cursor-help"
              onClick={() => showHelp("longExposure")}
            >
              Open Shutter
            </label>
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={config.longExposure}
              onChange={(e) => updateConfig({ longExposure: e.target.checked })}
            />
          </div>

          {/* Hide Controls */}
          <div className="form-option flex items-center justify-between">
            <label
              className="text-sm font-medium cursor-help"
              onClick={() => showHelp("hideControls")}
            >
              Hide Controls
            </label>
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={config.hideControls}
              onChange={(e) => updateConfig({ hideControls: e.target.checked })}
            />
          </div>

          {/* Custom Text */}
          <div className="form-option">
            <label className="block text-sm font-medium mb-1">
              Custom Text (for HeartName)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-white text-black"
              value={config.customText}
              onChange={(e) => updateConfig({ customText: e.target.value })}
              maxLength={10}
            />
          </div>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal
        title={currentHelpTopic ? helpContent[currentHelpTopic].header : "Help"}
        open={helpModalOpen}
        onCancel={handleCloseHelpModal}
        footer={null}
        width={300}
      >
        <p>{currentHelpTopic ? helpContent[currentHelpTopic].body : ""}</p>
      </Modal>
    </>
  );
};

export default Controls;
