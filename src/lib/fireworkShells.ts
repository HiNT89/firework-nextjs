import {
  COLOR,
  INVISIBLE,
  QUALITY_LOW,
  QUALITY_HIGH,
  PI_2,
  randomColor,
  whiteOrGold,
  makePistilColor,
  randomColorSimple,
  randomColorSimple as randomShellName,
} from "./fireworkUtils";

export interface ShellConfig {
  shellSize: number;
  spreadSize: number;
  starLife: number;
  starDensity?: number;
  starLifeVariation?: number;
  color?: string | string[];
  secondColor?: string | null;
  glitter?: string;
  glitterColor?: string;
  pistol?: boolean;
  pistilColor?: string | boolean;
  streamers?: boolean;
  ring?: boolean;
  starCount?: number;
  crossette?: boolean;
  strobe?: boolean;
  strobeColor?: string | null;
  floral?: boolean;
  fallingLeaves?: boolean;
  horsetail?: boolean;
  crackle?: boolean;
  ghost?: boolean;
}

const COLOR_NAMES = Object.keys(COLOR);
const COLOR_CODES = COLOR_NAMES.map(
  (name) => COLOR[name as keyof typeof COLOR],
);

export const crysanthemumShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => {
  const glitter = Math.random() < 0.25;
  const singleColor = Math.random() < 0.72;
  const color = singleColor
    ? randomColor(COLOR_CODES, { limitWhite: true })
    : [randomColor(COLOR_CODES), randomColor(COLOR_CODES, { notSame: true })];
  const pistol = singleColor && Math.random() < 0.42;
  const pistilColor =
    pistol &&
    makePistilColor(Array.isArray(color) ? color[0] : color, COLOR_CODES);
  const secondColor =
    singleColor && (Math.random() < 0.2 || color === COLOR.White)
      ? pistilColor ||
        randomColor(COLOR_CODES, { notColor: String(color), limitWhite: true })
      : null;
  const streamers = !pistol && color !== COLOR.White && Math.random() < 0.42;
  let starDensity = glitter ? 1.1 : 1.25;
  if (isLowQuality) starDensity *= 0.8;
  if (isHighQuality) starDensity *= 1.2;
  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starLife: 900 + size * 200,
    starDensity,
    color,
    secondColor,
    glitter: glitter ? "light" : "",
    glitterColor: whiteOrGold(),
    pistol,
    pistilColor,
    streamers,
  };
};

export const ghostShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => {
  const shell = crysanthemumShell(size, isLowQuality, isHighQuality);
  shell.starLife *= 1.5;
  const ghostColor = randomColor(COLOR_CODES, { notColor: COLOR.White });
  shell.streamers = true;
  const pistol = Math.random() < 0.42;
  const pistilColor = pistol && makePistilColor(ghostColor, COLOR_CODES);
  shell.color = INVISIBLE;
  shell.secondColor = ghostColor;
  shell.glitter = "";
  shell.pistol = pistol;
  shell.pistilColor = pistilColor;
  return shell;
};

export const strobeShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => {
  const color = randomColor(COLOR_CODES, { limitWhite: true });
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
    pistol: Math.random() < 0.5,
    pistilColor: makePistilColor(color, COLOR_CODES),
  };
};

export const palmShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => {
  const color = randomColor(COLOR_CODES);
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

export const ringShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => {
  const color = randomColor(COLOR_CODES);
  const pistol = Math.random() < 0.75;
  return {
    shellSize: size,
    ring: true,
    color,
    spreadSize: 300 + size * 100,
    starLife: 900 + size * 200,
    starCount: 2.2 * PI_2 * (size + 1),
    pistol,
    pistilColor: makePistilColor(color, COLOR_CODES),
    glitter: !pistol ? "light" : "",
    glitterColor: color === COLOR.Gold ? COLOR.Gold : COLOR.White,
    streamers: Math.random() < 0.3,
  };
};

export const crossetteShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => {
  const color = randomColor(COLOR_CODES, { limitWhite: true });
  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starLife: 750 + size * 160,
    starLifeVariation: 0.4,
    starDensity: 0.85,
    color,
    crossette: true,
    pistol: Math.random() < 0.5,
    pistilColor: makePistilColor(color, COLOR_CODES),
  };
};

export const floralShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => ({
  shellSize: size,
  spreadSize: 300 + size * 120,
  starDensity: 0.12,
  starLife: 500 + size * 50,
  starLifeVariation: 0.5,
  color:
    Math.random() < 0.65
      ? "random"
      : Math.random() < 0.15
        ? randomColor(COLOR_CODES)
        : [
            randomColor(COLOR_CODES),
            randomColor(COLOR_CODES, { notSame: true }),
          ],
});

export const fallingLeavesShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => ({
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

export const willowShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => ({
  shellSize: size,
  spreadSize: 300 + size * 100,
  starDensity: 0.6,
  starLife: 3000 + size * 300,
  glitter: "willow",
  glitterColor: COLOR.Gold,
  color: INVISIBLE,
});

export const crackleShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => {
  const color = Math.random() < 0.75 ? COLOR.Gold : randomColor(COLOR_CODES);
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
    pistol: Math.random() < 0.65,
    pistilColor: makePistilColor(color, COLOR_CODES),
  };
};

export const horsetailShell = (
  size = 1,
  isLowQuality = false,
  isHighQuality = false,
): ShellConfig => {
  const color = randomColor(COLOR_CODES);
  return {
    shellSize: size,
    horsetail: true,
    color,
    spreadSize: 250 + size * 38,
    starDensity: 0.9,
    starLife: 2500 + size * 300,
    glitter: "medium",
    glitterColor: Math.random() < 0.5 ? whiteOrGold() : color,
    pistol: Math.random() < 0.42,
    strobe: color === COLOR.White,
  };
};

export const shellTypes: Record<
  string,
  (size?: number, isLow?: boolean, isHigh?: boolean) => ShellConfig
> = {
  Random: (size = 1, isLow = false, isHigh = false) => {
    const shellName =
      Math.random() < 0.5
        ? "Crysanthemum"
        : shellNames[(Math.random() * (shellNames.length - 1) + 1) | 0];
    return shellTypes[shellName](size, isLow, isHigh);
  },
  Crackle: crackleShell,
  Crossette: crossetteShell,
  Crysanthemum: crysanthemumShell,
  "Falling Leaves": fallingLeavesShell,
  Floral: floralShell,
  Ghost: ghostShell,
  "Horse Tail": horsetailShell,
  Palm: palmShell,
  Ring: ringShell,
  Strobe: strobeShell,
  Willow: willowShell,
};

export const shellNames = Object.keys(shellTypes);

const fastShellBlacklist = ["Falling Leaves", "Floral", "Willow"];

export function randomFastShell(selectedShell: string, isRandom: boolean) {
  let shellName = isRandom
    ? shellNames[(Math.random() * shellNames.length) | 0]
    : selectedShell;
  if (isRandom) {
    while (fastShellBlacklist.includes(shellName)) {
      shellName = shellNames[(Math.random() * shellNames.length) | 0];
    }
  }
  return shellTypes[shellName];
}

export function getShellFactory(shellName: string) {
  return shellTypes[shellName] || shellTypes.Random;
}
