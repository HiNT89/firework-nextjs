// Device detection - these need to be functions for SSR compatibility
const getIsMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 640;
const getIsDesktop = () =>
  typeof window !== "undefined" && window.innerWidth > 800;
const getIsHeader = () =>
  getIsDesktop() &&
  (typeof window !== "undefined" ? window.innerHeight < 300 : false);

const getIsHighEndDevice = () => {
  if (typeof navigator === "undefined") return false;
  const hwConcurrency = navigator.hardwareConcurrency;
  if (!hwConcurrency) return false;
  const minCount =
    typeof window !== "undefined" && window.innerWidth <= 1024 ? 4 : 8;
  return hwConcurrency >= minCount;
};

// Quality constants
export const QUALITY_LOW = 1;
export const QUALITY_NORMAL = 2;
export const QUALITY_HIGH = 3;

// Sky lighting constants
export const SKY_LIGHT_NONE = 0;
export const SKY_LIGHT_DIM = 1;
export const SKY_LIGHT_NORMAL = 2;

// Color definitions
export const COLOR = {
  Red: "#ff0043",
  Green: "#14fc56",
  Blue: "#1e7fff",
  Purple: "#e60aff",
  Gold: "#ffbf36",
  White: "#ffffff",
} as const;

export type ColorName = keyof typeof COLOR;
export type ColorCode = (typeof COLOR)[ColorName];

// Special invisible color
export const INVISIBLE = "_INVISIBLE_";

// Math constants
export const PI_2 = Math.PI * 2;
export const PI_HALF = Math.PI * 0.5;

// Canvas limits
export const MAX_WIDTH = 7680;
export const MAX_HEIGHT = 4320;

// Physics
export const GRAVITY = 0.9;

// Derived color values
export const COLOR_NAMES = Object.keys(COLOR) as ColorName[];
export const COLOR_CODES = COLOR_NAMES.map((colorName) => COLOR[colorName]);
export const COLOR_CODES_W_INVIS = [...COLOR_CODES, INVISIBLE] as const;

// Color code to index mapping
export const COLOR_CODE_INDEXES = COLOR_CODES_W_INVIS.reduce(
  (obj, code, i) => {
    obj[code] = i;
    return obj;
  },
  {} as Record<string, number>,
);

// Color tuples (RGB values)
export const COLOR_TUPLES: Record<string, { r: number; g: number; b: number }> =
  {};
COLOR_CODES.forEach((hex) => {
  COLOR_TUPLES[hex] = {
    r: parseInt(hex.substring(1, 3), 16),
    g: parseInt(hex.substring(3, 5), 16),
    b: parseInt(hex.substring(5, 7), 16),
  };
});

// Help content for UI
export const helpContent = {
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

// Shell names for dropdowns
export const SHELL_NAMES = [
  "Random",
  "Crackle",
  "Crossette",
  "Crysanthemum",
  "Falling Leaves",
  "Floral",
  "Ghost",
  "Heart",
  "HeartName",
  "Horse Tail",
  "Palm",
  "Ring",
  "Strobe",
  "Willow",
] as const;

export type ShellName = (typeof SHELL_NAMES)[number];

// Shell sizes for dropdown
export const SHELL_SIZES = ['3"', '4"', '6"', '8"', '12"', '16"'] as const;

// Scale factor options
export const SCALE_FACTOR_OPTIONS = [
  0.5, 0.62, 0.75, 0.9, 1.0, 1.5, 2.0,
] as const;

// APP_CONFIG class for backward compatibility
export class APP_CONFIG {
  static get IS_MOBILE() {
    return getIsMobile();
  }
  static get IS_DESKTOP() {
    return getIsDesktop();
  }
  static get IS_HEADER() {
    return getIsHeader();
  }
  static get IS_HIGH_END_DEVICE() {
    return getIsHighEndDevice();
  }

  static MAX_WIDTH = MAX_WIDTH;
  static MAX_HEIGHT = MAX_HEIGHT;
  static GRAVITY = GRAVITY;

  static COLOR = COLOR;
  static INVISIBLE = INVISIBLE;

  static QUALITY_LOW = QUALITY_LOW;
  static QUALITY_NORMAL = QUALITY_NORMAL;
  static QUALITY_HIGH = QUALITY_HIGH;

  static SKY_LIGHT_NONE = SKY_LIGHT_NONE;
  static SKY_LIGHT_DIM = SKY_LIGHT_DIM;
  static SKY_LIGHT_NORMAL = SKY_LIGHT_NORMAL;

  static PI_2 = PI_2;
  static PI_HALF = PI_HALF;

  static COLOR_NAMES = COLOR_NAMES;
  static COLOR_CODES = COLOR_CODES;
  static COLOR_CODES_W_INVIS = COLOR_CODES_W_INVIS;
  static COLOR_CODE_INDEXES = COLOR_CODE_INDEXES;
  static COLOR_TUPLES = COLOR_TUPLES;
}

export default APP_CONFIG;
