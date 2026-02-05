"use client";
import React, { useRef, useEffect } from "react";
import Controls from "@/components/Controls";
import { useFireworkEngine } from "@/hooks/useFireworkEngine";
import { useFireworkStore } from "@/stores/useFireworkStore";

const Page = () => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailsCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { handlePointerDown } = useFireworkEngine(
    mainCanvasRef,
    trailsCanvasRef,
    containerRef,
  );

  // Get stable action references from the store
  const togglePause = useFireworkStore((state) => state.togglePause);
  const toggleMenu = useFireworkStore((state) => state.toggleMenu);

  // Handle keyboard events
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // P - toggle pause
      if (event.keyCode === 80) {
        togglePause();
      }
      // O - toggle menu
      else if (event.keyCode === 79) {
        toggleMenu();
      }
      // Esc - close menu
      else if (event.keyCode === 27) {
        toggleMenu(false);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [togglePause, toggleMenu]);

  // Initialize app - unpause on mount
  useEffect(() => {
    togglePause(false);
  }, [togglePause]);

  return (
    <main className="bg-black h-screen w-screen text-white relative overflow-hidden">
      <Controls />
      <div
        ref={containerRef}
        className="canvas-container absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#000" }}
      >
        <canvas
          id="trails-canvas"
          ref={trailsCanvasRef}
          className="absolute inset-0"
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        />
        <canvas
          id="main-canvas"
          ref={mainCanvasRef}
          className="absolute inset-0 pointer-events-none"
        />
      </div>
    </main>
  );
};

export default Page;
