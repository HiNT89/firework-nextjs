import { APP_CONFIG, COLOR, COLOR_CODES, INVISIBLE } from "@/config";

// Math utilities
export const MyMath = {
  random: (min: number, max: number): number =>
    Math.random() * (max - min) + min,

  randomChoice: <T>(arr: T[]): T => arr[(Math.random() * arr.length) | 0],

  clamp: (num: number, min: number, max: number): number =>
    Math.min(Math.max(num, min), max),

  pointDist: (x1: number, y1: number, x2: number, y2: number): number => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  pointAngle: (x1: number, y1: number, x2: number, y2: number): number =>
    Math.atan2(x2 - x1, y2 - y1),
};

export function getDefaultScaleFactor() {
  if (APP_CONFIG.IS_MOBILE) return 0.9;
  if (APP_CONFIG.IS_HEADER) return 0.75;
  return 1;
}

// Get a random color.
export function randomColorSimple() {
  return COLOR_CODES[(Math.random() * COLOR_CODES.length) | 0];
}

// Track last color for notSame option
let lastColor: string | undefined;

export function randomColor(options?: {
  notSame?: boolean;
  notColor?: string;
  limitWhite?: boolean;
}) {
  const notSame = options && options.notSame;
  const notColor = options && options.notColor;
  const limitWhite = options && options.limitWhite;
  let color = randomColorSimple();

  // limit the amount of white chosen randomly
  if (limitWhite && color === COLOR.White && Math.random() < 0.6) {
    color = randomColorSimple();
  }

  if (notSame) {
    while (color === lastColor) {
      color = randomColorSimple();
    }
  } else if (notColor) {
    while (color === notColor) {
      color = randomColorSimple();
    }
  }

  lastColor = color;
  return color;
}

export function whiteOrGold() {
  return Math.random() < 0.5 ? COLOR.Gold : COLOR.White;
}

// Shell helper to create pistil color
export function makePistilColor(shellColor: string) {
  return shellColor === COLOR.White || shellColor === COLOR.Gold
    ? randomColor({ notColor: shellColor })
    : whiteOrGold();
}

// Fit shell position in horizontal bounds
export function fitShellPositionInBoundsH(position: number) {
  const edge = 0.18;
  return (1 - edge * 2) * position + edge;
}

// Fit shell position in vertical bounds
export function fitShellPositionInBoundsV(position: number) {
  return position * 0.75;
}

// Get random shell horizontal position
export function getRandomShellPositionH() {
  return fitShellPositionInBoundsH(Math.random());
}

// Get random shell vertical position
export function getRandomShellPositionV() {
  return fitShellPositionInBoundsV(Math.random());
}

// Get random shell size with position
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

// Create particle arc helper
export function createParticleArc(
  start: number,
  arcLength: number,
  count: number,
  randomness: number,
  particleFactory: (angle: number) => void,
) {
  const angleDelta = arcLength / count;
  const end = start + arcLength - angleDelta * 0.5;

  if (end > start) {
    for (let angle = start; angle < end; angle = angle + angleDelta) {
      particleFactory(angle + Math.random() * angleDelta * randomness);
    }
  } else {
    for (let angle = start; angle > end; angle = angle + angleDelta) {
      particleFactory(angle + Math.random() * angleDelta * randomness);
    }
  }
}

// Create spherical burst of particles
export function createBurst(
  count: number,
  particleFactory: (angle: number, speedMult: number) => void,
  startAngle = 0,
  arcLength = APP_CONFIG.PI_2,
) {
  const R = 0.5 * Math.sqrt(count / Math.PI);
  const C = 2 * R * Math.PI;
  const C_HALF = C / 2;

  for (let i = 0; i <= C_HALF; i++) {
    const ringAngle = (i / C_HALF) * APP_CONFIG.PI_HALF;
    const ringSize = Math.cos(ringAngle);
    const partsPerFullRing = C * ringSize;
    const partsPerArc = partsPerFullRing * (arcLength / APP_CONFIG.PI_2);

    const angleInc = APP_CONFIG.PI_2 / partsPerFullRing;
    const angleOffset = Math.random() * angleInc + startAngle;
    const maxRandomAngleOffset = angleInc * 0.33;

    for (let j = 0; j < partsPerArc; j++) {
      const randomAngleOffset = Math.random() * maxRandomAngleOffset;
      const angle = angleInc * j + angleOffset + randomAngleOffset;
      particleFactory(angle, ringSize);
    }
  }
}
