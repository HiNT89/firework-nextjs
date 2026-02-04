"use client";

import { useEffect, useRef, useCallback } from "react";
import { GRAVITY, PI_2, COLOR } from "./fireworkUtils";
import { FireworkSequencer } from "./fireworkSequences";
import {
  crysanthemumShell,
  ghostShell,
  strobeShell,
  palmShell,
  ringShell,
  crossetteShell,
  floralShell,
  fallingLeavesShell,
  willowShell,
  crackleShell,
  horsetailShell,
  shellNames,
} from "./fireworkShells";

export interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  age: number;
  alpha: number;
}

export interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  age: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  age: number;
  life: number;
  alpha?: number;
}

export interface AnimationState {
  shells: any[];
  stars: Star[];
  sparks: Spark[];
  stageW: number;
  stageH: number;
  simSpeed: number;
  speedBarOpacity: number;
  autoLaunchTime: number;
}

export function useFireworkAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  trailsCanvasRef: React.RefObject<HTMLCanvasElement>,
  isPaused: boolean,
  config: any,
  onConfigChange: (config: any) => void,
) {
  const stateRef = useRef<AnimationState>({
    shells: [],
    stars: [],
    sparks: [],
    stageW: 0,
    stageH: 0,
    simSpeed: 1,
    speedBarOpacity: 0,
    autoLaunchTime: 0,
  });

  const sequencerRef = useRef<FireworkSequencer | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef(0);

  // Initialize canvas and handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const trailsCanvas = trailsCanvasRef.current;
    if (!canvas || !trailsCanvas) return;

    const scaleFactor = config.scaleFactor || 1;
    stateRef.current.stageW = window.innerWidth * scaleFactor;
    stateRef.current.stageH = window.innerHeight * scaleFactor;

    canvas.width = stateRef.current.stageW;
    canvas.height = stateRef.current.stageH;
    trailsCanvas.width = stateRef.current.stageW;
    trailsCanvas.height = stateRef.current.stageH;
  }, [config.scaleFactor]);

  // Launch shell
  const launchShell = useCallback(
    (x: number, y: number, size: number) => {
      if (!canvasRef.current) return;

      const shellName = config.shell || "Random";
      const baseSize = +size;

      // Get shell config based on shell type
      let shellConfig: any;
      const isLowQuality = +config.quality === 1;
      const isHighQuality = +config.quality === 3;

      if (shellName === "Random") {
        const randomShellName =
          shellNames[Math.floor(Math.random() * shellNames.length)];
        shellConfig = getShellConfig(randomShellName, baseSize);
      } else {
        shellConfig = getShellConfig(shellName, baseSize);
      }

      // Launch position (center of screen)
      const launchX = x * stateRef.current.stageW;
      const launchY = y * stateRef.current.stageH;

      // Create stars based on shell config
      const starCount = Math.floor(
        shellConfig.starDensity *
          (shellConfig.spreadSize * (1 + baseSize)) *
          (isHighQuality ? 1.5 : isLowQuality ? 0.75 : 1),
      );

      for (let i = 0; i < starCount; i++) {
        // Spread pattern
        const angle =
          Math.random() * PI_2 +
          (shellConfig.ring ? (i / starCount) * PI_2 : 0);
        const speed =
          Math.random() * shellConfig.spreadSize * (0.5 + Math.random() * 0.5);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        const life =
          shellConfig.starLife +
          (shellConfig.starLifeVariation || 0) * (Math.random() - 0.5);

        const star: Star = {
          x: launchX,
          y: launchY,
          vx,
          vy,
          color: Array.isArray(shellConfig.color)
            ? shellConfig.color[i % shellConfig.color.length]
            : shellConfig.color || COLOR.Gold,
          life,
          age: 0,
          alpha: 1,
        };

        stateRef.current.stars.push(star);
      }
    },
    [config.shell, config.quality],
  );

  // Get shell config based on name
  const getShellConfig = (shellName: string, baseSize: number): any => {
    const isLowQuality = +config.quality === 1;
    const isHighQuality = +config.quality === 3;

    switch (shellName) {
      case "Crysanthemum":
        return crysanthemumShell(baseSize, isLowQuality, isHighQuality);
      case "Ghost":
        return ghostShell(baseSize, isLowQuality, isHighQuality);
      case "Strobe":
        return strobeShell(baseSize, isLowQuality, isHighQuality);
      case "Palm":
        return palmShell(baseSize, isLowQuality, isHighQuality);
      case "Ring":
        return ringShell(baseSize, isLowQuality, isHighQuality);
      case "Crossette":
        return crossetteShell(baseSize, isLowQuality, isHighQuality);
      case "Floral":
        return floralShell(baseSize, isLowQuality, isHighQuality);
      case "Falling Leaves":
        return fallingLeavesShell(baseSize, isLowQuality, isHighQuality);
      case "Horse Tail":
        return horsetailShell(baseSize, isLowQuality, isHighQuality);
      case "Crackle":
        return crackleShell(baseSize, isLowQuality, isHighQuality);
      case "Willow":
        return willowShell(baseSize, isLowQuality, isHighQuality);
      default:
        return crysanthemumShell(baseSize, isLowQuality, isHighQuality);
    }
  };

  // Handle pointer events
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!isPaused) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / stateRef.current.stageW;
        const y = (e.clientY - rect.top) / stateRef.current.stageH;

        launchShell(x, y, +config.size);
      }
    },
    [isPaused, config.size, launchShell],
  );

  // Handle keyboard
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space" || e.code === "KeyP") {
      e.preventDefault();
    }
  }, []);

  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log("[Fireworks] Initializing animation with canvas:", canvas);
    handleResize();
    console.log(
      "[Fireworks] Canvas size:",
      stateRef.current.stageW,
      stateRef.current.stageH,
    );
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    // Initialize sequencer
    sequencerRef.current = new FireworkSequencer(
      launchShell,
      (name: string, size: number) => ({ starDensity: 1 }),
      () => config,
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleResize, handlePointerDown, handleKeyDown, launchShell, config]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      console.error("[Fireworks] Failed to get canvas or context");
      return;
    }

    console.log("[Fireworks] Animation loop started with ctx:", ctx);

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = currentTime;
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      const state = stateRef.current;
      const timeStep = deltaTime * state.simSpeed * (isPaused ? 0 : 1);

      // Update stars
      state.stars = state.stars.filter((star) => {
        star.age += timeStep;

        if (star.age >= star.life) {
          return false;
        }

        // Physics
        star.vx *= 0.98;
        star.vy *= 0.98;
        star.vy += GRAVITY * timeStep;

        star.x += star.vx;
        star.y += star.vy;

        // Fade out
        if (star.age > star.life * 0.75) {
          star.alpha = 1 - (star.age - star.life * 0.75) / (star.life * 0.25);
        }

        return true;
      });

      // Update sparks
      state.sparks = state.sparks.filter((spark) => {
        spark.age += timeStep;

        if (spark.age >= spark.life) {
          return false;
        }

        spark.vx *= 0.9;
        spark.vy *= 0.9;
        spark.vy += GRAVITY * 2 * timeStep;

        spark.x += spark.vx;
        spark.y += spark.vy;

        return true;
      });

      // Auto launch
      if (!isPaused && config.autoLaunch) {
        state.autoLaunchTime -= timeStep;
        if (state.autoLaunchTime <= 0 && sequencerRef.current) {
          console.log("[Fireworks] Auto-launching shell");
          state.autoLaunchTime = sequencerRef.current.startSequence();
        }
      }

      // Clear canvas
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, state.stageW, state.stageH);

      // Draw stars
      state.stars.forEach((star) => {
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, PI_2);
        ctx.fill();
      });

      // Draw sparks
      ctx.globalAlpha = 1;
      state.sparks.forEach((spark) => {
        ctx.fillStyle = spark.color;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, 1, 0, PI_2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start first auto launch
    if (
      config.autoLaunch &&
      !isPaused &&
      stateRef.current.autoLaunchTime === 0
    ) {
      stateRef.current.autoLaunchTime = 1400;
      console.log("[Fireworks] Starting auto-launch");
    }

    lastTimeRef.current = 0;
    console.log("[Fireworks] Starting animation loop");
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, config.autoLaunch, config.quality]);

  return { launchShell };
}
