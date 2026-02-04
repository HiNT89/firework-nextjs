// Device detection
export const IS_MOBILE =
  typeof window !== "undefined" ? window.innerWidth <= 640 : false;
export const IS_DESKTOP =
  typeof window !== "undefined" ? window.innerWidth > 800 : false;
export const IS_HEADER =
  IS_DESKTOP && typeof window !== "undefined" && window.innerHeight < 300;

export const IS_HIGH_END_DEVICE = (() => {
  if (typeof window === "undefined") return false;
  const hwConcurrency = navigator.hardwareConcurrency;
  if (!hwConcurrency) return false;
  const minCount = window.innerWidth <= 1024 ? 4 : 8;
  return hwConcurrency >= minCount;
})();

// Screen limits
export const MAX_WIDTH = 7680;
export const MAX_HEIGHT = 4320;
export const GRAVITY = 0.9;

// Quality levels
export const QUALITY_LOW = 1;
export const QUALITY_NORMAL = 2;
export const QUALITY_HIGH = 3;

// Sky lighting
export const SKY_LIGHT_NONE = 0;
export const SKY_LIGHT_DIM = 1;
export const SKY_LIGHT_NORMAL = 2;

// Colors
export const COLOR = {
  Red: "#ff0043",
  Green: "#14fc56",
  Blue: "#1e7fff",
  Purple: "#e60aff",
  Gold: "#ffbf36",
  White: "#ffffff",
};

export const INVISIBLE = "_INVISIBLE_";

// Math constants
export const PI_2 = Math.PI * 2;
export const PI_HALF = Math.PI * 0.5;

// Helper functions
export function getDefaultScaleFactor() {
  if (IS_MOBILE) return 0.9;
  if (IS_HEADER) return 0.75;
  return 1;
}

export function fitShellPositionInBoundsH(position: number) {
  const edge = 0.18;
  return (1 - edge * 2) * position + edge;
}

export function fitShellPositionInBoundsV(position: number) {
  return position * 0.75;
}

export function getRandomShellPositionH() {
  return fitShellPositionInBoundsH(Math.random());
}

export function getRandomShellPositionV() {
  return fitShellPositionInBoundsV(Math.random());
}

export function randomColorSimple(colors: string[]) {
  return colors[(Math.random() * colors.length) | 0];
}

export let lastColor = "";

export function randomColor(
  colors: string[],
  options?: { notSame?: boolean; notColor?: string; limitWhite?: boolean },
) {
  const notSame = options?.notSame;
  const notColor = options?.notColor;
  const limitWhite = options?.limitWhite;
  let color = randomColorSimple(colors);

  if (limitWhite && color === COLOR.White && Math.random() < 0.6) {
    color = randomColorSimple(colors);
  }

  if (notSame) {
    while (color === lastColor) {
      color = randomColorSimple(colors);
    }
  }

  lastColor = color;
  return color;
}

export function whiteOrGold() {
  return Math.random() < 0.5 ? COLOR.Gold : COLOR.White;
}

export function makePistilColor(shellColor: string, colors: string[]) {
  return shellColor === COLOR.White || shellColor === COLOR.Gold
    ? randomColor(colors, { notColor: shellColor })
    : whiteOrGold();
}

export function getRandomShellSize(baseSize: number) {
  const maxVariance = Math.min(2.5, baseSize);
  const variance = Math.random() * maxVariance;
  const size = baseSize - variance;
  const height = maxVariance === 0 ? Math.random() : 1 - variance / maxVariance;
  const centerOffset = Math.random() * (1 - height * 0.65) * 0.5;
  const x = Math.random() < 0.5 ? 0.5 - centerOffset : 0.5 + centerOffset;
  return {
    size,
    x: fitShellPositionInBoundsH(x),
    height: fitShellPositionInBoundsV(height),
  };
}

export function createBurst(
  count: number,
  particleFactory: (angle: number, speed: number) => void,
  startAngle = 0,
  arcLength = PI_2,
) {
  for (let i = 0; i < count; i++) {
    const angle = startAngle + (i / count) * arcLength;
    const speed = Math.random();
    particleFactory(angle, speed);
  }
}

// Color utility
export function getColorCodes(colors: Record<string, string>) {
  return Object.keys(colors).map((name) => colors[name]);
}

export function getColorTuples(colorCodes: string[]) {
  const tuples: Record<string, { r: number; g: number; b: number }> = {};
  colorCodes.forEach((hex) => {
    tuples[hex] = {
      r: parseInt(hex.substr(1, 2), 16),
      g: parseInt(hex.substr(3, 2), 16),
      b: parseInt(hex.substr(5, 2), 16),
    };
  });
  return tuples;
}
