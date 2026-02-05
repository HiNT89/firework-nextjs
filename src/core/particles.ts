import { COLOR_CODES_W_INVIS, INVISIBLE, PI_2, COLOR } from "@/config";

// Helper to generate objects for storing active particles
function createParticleCollection() {
  const collection: Record<string, StarInstance[]> = {};
  COLOR_CODES_W_INVIS.forEach((color) => {
    collection[color] = [];
  });
  return collection;
}

function createSparkCollection() {
  const collection: Record<string, SparkInstance[]> = {};
  COLOR_CODES_W_INVIS.forEach((color) => {
    collection[color] = [];
  });
  return collection;
}

// Star instance interface
export interface StarInstance {
  visible: boolean;
  heavy: boolean;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  color: string;
  speedX: number;
  speedY: number;
  life: number;
  fullLife: number;
  spinAngle: number;
  spinSpeed: number;
  spinRadius: number;
  sparkFreq: number;
  sparkSpeed: number;
  sparkTimer: number;
  sparkColor: string;
  sparkLife: number;
  sparkLifeVariation: number;
  strobe: boolean;
  strobeFreq?: number;
  secondColor?: string | null;
  transitionTime?: number;
  colorChanged?: boolean;
  updateFrame?: number;
  onDeath?: (star: StarInstance) => void;
}

// Star particle system
export const Star = {
  drawWidth: 3,
  airDrag: 0.98,
  airDragHeavy: 0.992,

  active: createParticleCollection(),
  _pool: [] as StarInstance[],

  _new(): StarInstance {
    return {
      visible: true,
      heavy: false,
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      color: "",
      speedX: 0,
      speedY: 0,
      life: 0,
      fullLife: 0,
      spinAngle: 0,
      spinSpeed: 0.8,
      spinRadius: 0,
      sparkFreq: 0,
      sparkSpeed: 1,
      sparkTimer: 0,
      sparkColor: "",
      sparkLife: 750,
      sparkLifeVariation: 0.25,
      strobe: false,
    };
  },

  add(
    x: number,
    y: number,
    color: string,
    angle: number,
    speed: number,
    life: number,
    speedOffX = 0,
    speedOffY = 0,
  ): StarInstance {
    const instance = this._pool.pop() || this._new();

    instance.visible = true;
    instance.heavy = false;
    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color;
    instance.speedX = Math.sin(angle) * speed + speedOffX;
    instance.speedY = Math.cos(angle) * speed + speedOffY;
    instance.life = life;
    instance.fullLife = life;
    instance.spinAngle = Math.random() * PI_2;
    instance.spinSpeed = 0.8;
    instance.spinRadius = 0;
    instance.sparkFreq = 0;
    instance.sparkSpeed = 1;
    instance.sparkTimer = 0;
    instance.sparkColor = color;
    instance.sparkLife = 750;
    instance.sparkLifeVariation = 0.25;
    instance.strobe = false;

    this.active[color].push(instance);
    return instance;
  },

  returnInstance(instance: StarInstance) {
    instance.onDeath && instance.onDeath(instance);
    instance.onDeath = undefined;
    instance.secondColor = null;
    instance.transitionTime = 0;
    instance.colorChanged = false;
    this._pool.push(instance);
  },
};

// Spark instance interface
export interface SparkInstance {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  color: string;
  speedX: number;
  speedY: number;
  life: number;
}

// Spark particle system
export const Spark = {
  drawWidth: 0,
  airDrag: 0.9,

  active: createSparkCollection(),
  _pool: [] as SparkInstance[],

  _new(): SparkInstance {
    return {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      color: "",
      speedX: 0,
      speedY: 0,
      life: 0,
    };
  },

  add(
    x: number,
    y: number,
    color: string,
    angle: number,
    speed: number,
    life: number,
  ): SparkInstance {
    const instance = this._pool.pop() || this._new();

    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color;
    instance.speedX = Math.sin(angle) * speed;
    instance.speedY = Math.cos(angle) * speed;
    instance.life = life;

    this.active[color].push(instance);
    return instance;
  },

  returnInstance(instance: SparkInstance) {
    this._pool.push(instance);
  },
};

// Burst flash interface
export interface BurstFlashInstance {
  x: number;
  y: number;
  radius: number;
}

// Burst flash effect
export const BurstFlash = {
  active: [] as BurstFlashInstance[],
  _pool: [] as BurstFlashInstance[],

  _new(): BurstFlashInstance {
    return { x: 0, y: 0, radius: 0 };
  },

  add(x: number, y: number, radius: number): BurstFlashInstance {
    const instance = this._pool.pop() || this._new();
    instance.x = x;
    instance.y = y;
    instance.radius = radius;
    this.active.push(instance);
    return instance;
  },

  returnInstance(instance: BurstFlashInstance) {
    this._pool.push(instance);
  },
};

// Stage class for canvas management
export class Stage {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  width = 0;
  height = 0;
  dpr = 1;
  private _listeners: Map<string, Set<Function>> = new Map();

  constructor(canvasOrId?: HTMLCanvasElement | string) {
    if (typeof window === "undefined") return;

    if (typeof canvasOrId === "string") {
      this.canvas = document.getElementById(canvasOrId) as HTMLCanvasElement;
    } else if (canvasOrId) {
      this.canvas = canvasOrId;
    }

    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d");
      this.dpr = window.devicePixelRatio || 1;
    }
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  }

  resize(width: number, height: number) {
    if (!this.canvas) return;

    this.width = width;
    this.height = height;
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  addEventListener(event: string, callback: Function) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event)!.add(callback);
  }

  removeEventListener(event: string, callback: Function) {
    this._listeners.get(event)?.delete(callback);
  }

  emit(event: string, ...args: any[]) {
    this._listeners.get(event)?.forEach((cb) => cb(...args));
  }
}
