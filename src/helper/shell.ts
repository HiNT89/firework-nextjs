import {
  COLOR,
  INVISIBLE,
  PI_2,
  PI_HALF,
  APP_CONFIG,
  ShellName,
} from "@/config";
import {
  randomColor,
  whiteOrGold,
  makePistilColor,
  MyMath,
  createBurst,
  createParticleArc,
} from "@/utils";
import { useFireworkStore } from "@/stores/useFireworkStore";

// Shell configuration interface
export interface ShellConfig {
  shellSize: number;
  spreadSize: number;
  starLife: number;
  starLifeVariation?: number;
  starDensity?: number;
  starCount?: number;
  color: string | string[];
  secondColor?: string | null;
  glitter?: string;
  glitterColor?: string;
  pistil?: boolean;
  pistilColor?: string | false;
  streamers?: boolean;
  ring?: boolean;
  crossette?: boolean;
  floral?: boolean;
  fallingLeaves?: boolean;
  crackle?: boolean;
  horsetail?: boolean;
  heart?: boolean;
  heartName?: boolean;
  strobe?: boolean;
  strobeColor?: string | null;
  textColor?: string;
  textContent?: string;
}

// Get quality state from store
const getQualityState = () => {
  const state = useFireworkStore.getState();
  return {
    isLowQuality: state.isLowQuality,
    isHighQuality: state.isHighQuality,
  };
};

// Unique shell types
export const crysanthemumShell = (size = 1): ShellConfig => {
  const { isLowQuality, isHighQuality } = getQualityState();
  const glitter = Math.random() < 0.25;
  const singleColor = Math.random() < 0.72;
  const color = singleColor
    ? randomColor({ limitWhite: true })
    : [randomColor(), randomColor({ notSame: true })];
  const pistil = singleColor && Math.random() < 0.42;
  const pistilColor = pistil && makePistilColor(color as string);
  const secondColor =
    singleColor && (Math.random() < 0.2 || color === COLOR.White)
      ? pistilColor ||
        randomColor({ notColor: color as string, limitWhite: true })
      : null;
  const streamers = !pistil && color !== COLOR.White && Math.random() < 0.42;
  let starDensity = glitter ? 1.1 : 1.25;
  if (isLowQuality) starDensity *= 0.8;
  if (isHighQuality) starDensity = 1.2;
  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starLife: 900 + size * 200,
    starDensity,
    color,
    secondColor,
    glitter: glitter ? "light" : "",
    glitterColor: whiteOrGold(),
    pistil,
    pistilColor,
    streamers,
  };
};

export const ghostShell = (size = 1): ShellConfig => {
  const shell = crysanthemumShell(size);
  shell.starLife *= 1.5;
  const ghostColor = randomColor({ notColor: COLOR.White });
  shell.streamers = true;
  const pistil = Math.random() < 0.42;
  const pistilColor = pistil && makePistilColor(ghostColor);
  shell.color = INVISIBLE;
  shell.secondColor = ghostColor;
  shell.glitter = "";
  shell.pistil = pistil;
  shell.pistilColor = pistilColor;
  return shell;
};

export const strobeShell = (size = 1): ShellConfig => {
  const color = randomColor({ limitWhite: true });
  return {
    shellSize: size,
    spreadSize: 280 + size * 92,
    starLife: 1100 + size * 200,
    starLifeVariation: 0.4,
    starDensity: 1.1,
    color,
    glitter: "light",
    glitterColor: COLOR.White,
    strobe: true,
    strobeColor: Math.random() < 0.5 ? COLOR.White : null,
    pistil: Math.random() < 0.5,
    pistilColor: makePistilColor(color),
  };
};

export const palmShell = (size = 1): ShellConfig => {
  const color = randomColor();
  const thick = Math.random() < 0.5;
  return {
    shellSize: size,
    color,
    spreadSize: 250 + size * 75,
    starDensity: thick ? 0.15 : 0.4,
    starLife: 1800 + size * 200,
    glitter: thick ? "thick" : "heavy",
  };
};

export const ringShell = (size = 1): ShellConfig => {
  const color = randomColor();
  const pistil = Math.random() < 0.75;
  return {
    shellSize: size,
    ring: true,
    color,
    spreadSize: 300 + size * 100,
    starLife: 900 + size * 200,
    starCount: 2.2 * PI_2 * (size + 1),
    pistil,
    pistilColor: makePistilColor(color),
    glitter: !pistil ? "light" : "",
    glitterColor: color === COLOR.Gold ? COLOR.Gold : COLOR.White,
    streamers: Math.random() < 0.3,
  };
};

export const crossetteShell = (size = 1): ShellConfig => {
  const color = randomColor({ limitWhite: true });
  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starLife: 750 + size * 160,
    starLifeVariation: 0.4,
    starDensity: 0.85,
    color,
    crossette: true,
    pistil: Math.random() < 0.5,
    pistilColor: makePistilColor(color),
  };
};

export const floralShell = (size = 1): ShellConfig => ({
  shellSize: size,
  spreadSize: 300 + size * 120,
  starDensity: 0.12,
  starLife: 500 + size * 50,
  starLifeVariation: 0.5,
  color:
    Math.random() < 0.65
      ? "random"
      : Math.random() < 0.15
        ? randomColor()
        : [randomColor(), randomColor({ notSame: true })],
  floral: true,
});

export const fallingLeavesShell = (size = 1): ShellConfig => ({
  shellSize: size,
  color: INVISIBLE,
  spreadSize: 300 + size * 120,
  starDensity: 0.12,
  starLife: 500 + size * 50,
  starLifeVariation: 0.5,
  glitter: "medium",
  glitterColor: COLOR.Gold,
  fallingLeaves: true,
});

export const willowShell = (size = 1): ShellConfig => ({
  shellSize: size,
  spreadSize: 300 + size * 100,
  starDensity: 0.6,
  starLife: 3000 + size * 300,
  glitter: "willow",
  glitterColor: COLOR.Gold,
  color: INVISIBLE,
});

export const crackleShell = (size = 1): ShellConfig => {
  const { isLowQuality } = getQualityState();
  const color = Math.random() < 0.75 ? COLOR.Gold : randomColor();
  return {
    shellSize: size,
    spreadSize: 380 + size * 75,
    starDensity: isLowQuality ? 0.65 : 1,
    starLife: 600 + size * 100,
    starLifeVariation: 0.32,
    glitter: "light",
    glitterColor: COLOR.Gold,
    color,
    crackle: true,
    pistil: Math.random() < 0.65,
    pistilColor: makePistilColor(color),
  };
};

export const horsetailShell = (size = 1): ShellConfig => {
  const color = randomColor();
  return {
    shellSize: size,
    horsetail: true,
    color,
    spreadSize: 250 + size * 38,
    starDensity: 0.9,
    starLife: 2500 + size * 300,
    glitter: "medium",
    glitterColor: Math.random() < 0.5 ? whiteOrGold() : color,
    strobe: color === COLOR.White,
  };
};

export const heartShell = (size = 1): ShellConfig => {
  const color = Math.random() < 0.7 ? COLOR.Red : randomColor();
  return {
    shellSize: size,
    heart: true,
    color,
    spreadSize: 280 + size * 90,
    starDensity: 1.2,
    starLife: 1200 + size * 200,
    glitter: Math.random() < 0.3 ? "light" : "",
    glitterColor: COLOR.White,
    pistil: Math.random() < 0.4,
    pistilColor: makePistilColor(color),
  };
};

export const heartNameShell = (size = 1): ShellConfig => {
  const store = useFireworkStore.getState();
  const heartColor = Math.random() < 0.8 ? COLOR.Red : COLOR.Purple;
  const textColor = Math.random() < 0.6 ? COLOR.White : COLOR.Gold;

  return {
    shellSize: size,
    heartName: true,
    color: heartColor,
    textColor: textColor,
    textContent: store.config.customText || "LOVE",
    spreadSize: 320 + size * 100,
    starDensity: 1.0,
    starLife: 1400 + size * 220,
    glitter: Math.random() < 0.4 ? "light" : "",
    glitterColor: COLOR.White,
  };
};

// Shell types map
export const shellTypes: Record<ShellName, (size: number) => ShellConfig> = {
  Random: randomShell,
  Crackle: crackleShell,
  Crossette: crossetteShell,
  Crysanthemum: crysanthemumShell,
  "Falling Leaves": fallingLeavesShell,
  Floral: floralShell,
  Ghost: ghostShell,
  Heart: heartShell,
  HeartName: heartNameShell,
  "Horse Tail": horsetailShell,
  Palm: palmShell,
  Ring: ringShell,
  Strobe: strobeShell,
  Willow: willowShell,
};

export const shellNames = Object.keys(shellTypes) as ShellName[];

// Fast shell blacklist
const fastShellBlacklist: ShellName[] = ["Falling Leaves", "Floral", "Willow"];

export function randomShellName(): ShellName {
  return Math.random() < 0.5
    ? "Crysanthemum"
    : shellNames[(Math.random() * (shellNames.length - 1) + 1) | 0];
}

export function randomShell(size: number): ShellConfig {
  if (APP_CONFIG.IS_HEADER) return randomFastShell()(size);
  return shellTypes[randomShellName()](size);
}

export function shellFromConfig(size: number): ShellConfig {
  const shellName = useFireworkStore.getState().getShellName();
  // Validate shell name exists, fallback to Crysanthemum if not found
  const shellFn = shellTypes[shellName];
  if (typeof shellFn === "function") {
    return shellFn(size);
  }
  // Fallback for invalid shell name (e.g., from old localStorage)
  return crysanthemumShell(size);
}

export function randomFastShell(): (size: number) => ShellConfig {
  const store = useFireworkStore.getState();
  const isRandom = store.getShellName() === "Random";
  let shellName: ShellName = isRandom
    ? randomShellName()
    : store.getShellName();
  if (isRandom) {
    while (fastShellBlacklist.includes(shellName)) {
      shellName = randomShellName();
    }
  }
  const shellFn = shellTypes[shellName];
  // Validate and fallback
  if (typeof shellFn === "function") {
    return shellFn;
  }
  return crysanthemumShell;
}
