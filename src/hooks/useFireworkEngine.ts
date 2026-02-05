import { useEffect, useRef, useCallback } from "react";
import {
  COLOR,
  COLOR_CODES,
  COLOR_CODES_W_INVIS,
  COLOR_TUPLES,
  GRAVITY,
  INVISIBLE,
  MAX_HEIGHT,
  MAX_WIDTH,
  PI_2,
  PI_HALF,
  SKY_LIGHT_NONE,
  APP_CONFIG,
} from "@/config";
import { useFireworkStore } from "@/stores/useFireworkStore";
import { Star, Spark, BurstFlash, Stage, StarInstance } from "@/core/particles";
import { soundManager } from "@/core/soundManager";
import {
  MyMath,
  createBurst,
  createParticleArc,
  getRandomShellSize,
  getRandomShellPositionH,
  getRandomShellPositionV,
} from "@/utils";
import {
  ShellConfig,
  shellFromConfig,
  randomFastShell,
  randomShell,
  crysanthemumShell,
  ringShell,
  shellTypes,
} from "@/helper/shell";

// Shell class
class Shell {
  shellSize: number;
  spreadSize: number;
  starLife: number;
  starLifeVariation: number;
  starCount: number;
  starDensity: number;
  color: string | string[];
  secondColor?: string | null;
  glitter?: string;
  glitterColor: string;
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
  comet?: StarInstance;

  constructor(options: ShellConfig) {
    Object.assign(this, options);
    this.shellSize = options.shellSize;
    this.spreadSize = options.spreadSize;
    this.starLife = options.starLife;
    this.starLifeVariation = options.starLifeVariation || 0.125;
    this.color = options.color || "#ffffff";
    this.glitterColor = options.glitterColor || (this.color as string);
    this.starDensity = options.starDensity || 1;

    if (!options.starCount) {
      const scaledSize = this.spreadSize / 54;
      this.starCount = Math.max(6, scaledSize * scaledSize * this.starDensity);
    } else {
      this.starCount = options.starCount;
    }
  }

  launch(
    position: number,
    launchHeight: number,
    stageW: number,
    stageH: number,
    canPlaySound: boolean,
    simSpeed: number,
  ) {
    const width = stageW;
    const height = stageH;
    const hpad = 60;
    const vpad = 50;
    const minHeightPercent = 0.45;
    const minHeight = height - height * minHeightPercent;

    const launchX = position * (width - hpad * 2) + hpad;
    const launchY = height;
    const burstY = minHeight - launchHeight * (minHeight - vpad);

    const launchDistance = launchY - burstY;
    const launchVelocity = Math.pow(launchDistance * 0.04, 0.64);

    const comet = (this.comet = Star.add(
      launchX,
      launchY,
      typeof this.color === "string" && this.color !== "random"
        ? this.color
        : COLOR.White,
      Math.PI,
      launchVelocity * (this.horsetail ? 1.2 : 1),
      launchVelocity * (this.horsetail ? 100 : 400),
    ));

    comet.heavy = true;
    comet.spinRadius = MyMath.random(0.32, 0.85);
    comet.sparkFreq = 32;
    comet.sparkLife = 320;
    comet.sparkLifeVariation = 3;

    if (this.glitter === "willow" || this.fallingLeaves) {
      comet.sparkFreq = 20;
      comet.sparkSpeed = 0.5;
      comet.sparkLife = 500;
    }

    if (this.color === INVISIBLE) {
      comet.sparkColor = COLOR.Gold;
    }

    if (Math.random() > 0.4 && !this.horsetail) {
      comet.secondColor = INVISIBLE;
      comet.transitionTime = Math.pow(Math.random(), 1.5) * 700 + 500;
    }

    comet.onDeath = () =>
      this.burst(comet.x, comet.y, stageW, stageH, canPlaySound, simSpeed);

    soundManager.playSound("lift", 1, canPlaySound, simSpeed);
  }

  getHeartPattern() {
    const points: { x: number; y: number }[] = [];
    const scale = 0.8 + this.shellSize * 0.2;

    for (let t = 0; t < PI_2; t += 0.1) {
      const x = 16 * Math.pow(Math.sin(t), 3) * scale * 0.02;
      const y =
        -(13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)) *
        scale *
        0.02;
      points.push({ x, y });
    }

    return points;
  }

  getHeartNamePattern() {
    const points: { x: number; y: number; type: string }[] = [];
    const scale = 0.8 + this.shellSize * 0.2;

    for (let t = 0; t < PI_2; t += 0.2) {
      const x = 16 * Math.pow(Math.sin(t), 3) * scale * 0.02;
      const y =
        -(13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)) *
        scale *
        0.02;
      points.push({ x, y, type: "heart" });
    }

    const textScale = scale * 0.02;
    const customTextPoints = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
    ];

    customTextPoints.forEach(([px, py]) => {
      const x = px * textScale;
      const y = py * textScale;
      points.push({ x, y, type: "text" });
    });

    return points;
  }

  burst(
    x: number,
    y: number,
    stageW: number,
    stageH: number,
    canPlaySound: boolean,
    simSpeed: number,
  ) {
    const speed = this.spreadSize / 96;
    const store = useFireworkStore.getState();
    const quality = store.quality;
    const isHighQuality = store.isHighQuality;

    let color: string | null;
    let onDeath: ((star: StarInstance) => void) | undefined;
    let sparkFreq = 0;
    let sparkSpeed = 0;
    let sparkLife = 0;
    let sparkLifeVariation = 0.25;
    let playedDeathSound = false;

    // Star effects
    if (this.crossette) {
      onDeath = (star) => {
        if (!playedDeathSound) {
          soundManager.playSound("crackleSmall", 1, canPlaySound, simSpeed);
          playedDeathSound = true;
        }
        this.crossetteEffect(star);
      };
    }
    if (this.crackle) {
      onDeath = (star) => {
        if (!playedDeathSound) {
          soundManager.playSound("crackle", 1, canPlaySound, simSpeed);
          playedDeathSound = true;
        }
        this.crackleEffect(star, isHighQuality);
      };
    }
    if (this.floral)
      onDeath = (star) =>
        this.floralEffect(star, quality, canPlaySound, simSpeed);
    if (this.fallingLeaves)
      onDeath = (star) =>
        this.fallingLeavesEffect(star, quality, canPlaySound, simSpeed);

    // Glitter settings
    if (this.glitter === "light") {
      sparkFreq = 400;
      sparkSpeed = 0.3;
      sparkLife = 300;
      sparkLifeVariation = 2;
    } else if (this.glitter === "medium") {
      sparkFreq = 200;
      sparkSpeed = 0.44;
      sparkLife = 700;
      sparkLifeVariation = 2;
    } else if (this.glitter === "heavy") {
      sparkFreq = 80;
      sparkSpeed = 0.8;
      sparkLife = 1400;
      sparkLifeVariation = 2;
    } else if (this.glitter === "thick") {
      sparkFreq = 16;
      sparkSpeed = isHighQuality ? 1.65 : 1.5;
      sparkLife = 1400;
      sparkLifeVariation = 3;
    } else if (this.glitter === "streamer") {
      sparkFreq = 32;
      sparkSpeed = 1.05;
      sparkLife = 620;
      sparkLifeVariation = 2;
    } else if (this.glitter === "willow") {
      sparkFreq = 120;
      sparkSpeed = 0.34;
      sparkLife = 1400;
      sparkLifeVariation = 3.8;
    }

    sparkFreq = sparkFreq / quality;

    const starFactory = (angle: number, speedMult: number) => {
      const standardInitialSpeed = this.spreadSize / 1800;

      const star = Star.add(
        x,
        y,
        color || "#ffffff",
        angle,
        speedMult * speed,
        this.starLife + Math.random() * this.starLife * this.starLifeVariation,
        this.horsetail ? this.comet?.speedX || 0 : 0,
        this.horsetail ? this.comet?.speedY || 0 : -standardInitialSpeed,
      );

      if (this.secondColor) {
        star.transitionTime = this.starLife * (Math.random() * 0.05 + 0.32);
        star.secondColor = this.secondColor;
      }

      if (this.strobe) {
        star.transitionTime = this.starLife * (Math.random() * 0.08 + 0.46);
        star.strobe = true;
        star.strobeFreq = Math.random() * 20 + 40;
        if (this.strobeColor) {
          star.secondColor = this.strobeColor;
        }
      }

      star.onDeath = onDeath;

      if (this.glitter) {
        star.sparkFreq = sparkFreq;
        star.sparkSpeed = sparkSpeed;
        star.sparkLife = sparkLife;
        star.sparkLifeVariation = sparkLifeVariation;
        star.sparkColor = this.glitterColor;
        star.sparkTimer = Math.random() * star.sparkFreq;
      }
    };

    if (typeof this.color === "string") {
      color = this.color === "random" ? null : this.color;

      if (this.ring) {
        const ringStartAngle = Math.random() * Math.PI;
        const ringSquash = Math.pow(Math.random(), 2) * 0.85 + 0.15;

        createParticleArc(0, PI_2, this.starCount, 0, (angle) => {
          const initSpeedX = Math.sin(angle) * speed * ringSquash;
          const initSpeedY = Math.cos(angle) * speed;
          const newSpeed = MyMath.pointDist(0, 0, initSpeedX, initSpeedY);
          const newAngle =
            MyMath.pointAngle(0, 0, initSpeedX, initSpeedY) + ringStartAngle;
          const star = Star.add(
            x,
            y,
            color || "#ffffff",
            newAngle,
            newSpeed,
            this.starLife +
              Math.random() * this.starLife * this.starLifeVariation,
          );

          if (this.glitter) {
            star.sparkFreq = sparkFreq;
            star.sparkSpeed = sparkSpeed;
            star.sparkLife = sparkLife;
            star.sparkLifeVariation = sparkLifeVariation;
            star.sparkColor = this.glitterColor;
            star.sparkTimer = Math.random() * star.sparkFreq;
          }
        });
      } else if (this.heart) {
        const heartPoints = this.getHeartPattern();
        heartPoints.forEach(({ x: px, y: py }) => {
          const angle = MyMath.pointAngle(0, 0, px, py);
          const distance = MyMath.pointDist(0, 0, px, py) * speed;
          const star = Star.add(
            x,
            y,
            color || "#ffffff",
            angle,
            distance,
            this.starLife +
              Math.random() * this.starLife * this.starLifeVariation,
          );

          if (this.glitter) {
            star.sparkFreq = sparkFreq;
            star.sparkSpeed = sparkSpeed;
            star.sparkLife = sparkLife;
            star.sparkLifeVariation = sparkLifeVariation;
            star.sparkColor = this.glitterColor;
            star.sparkTimer = Math.random() * star.sparkFreq;
          }
        });
      } else if (this.heartName) {
        const heartNamePoints = this.getHeartNamePattern();
        heartNamePoints.forEach(({ x: px, y: py, type }) => {
          const angle = MyMath.pointAngle(0, 0, px, py);
          const distance = MyMath.pointDist(0, 0, px, py) * speed;
          const pointColor =
            type === "text" ? this.textColor! : color || "#ffffff";

          const star = Star.add(
            x,
            y,
            pointColor,
            angle,
            distance,
            this.starLife +
              Math.random() * this.starLife * this.starLifeVariation,
          );

          if (this.glitter && type === "heart") {
            star.sparkFreq = sparkFreq;
            star.sparkSpeed = sparkSpeed;
            star.sparkLife = sparkLife;
            star.sparkLifeVariation = sparkLifeVariation;
            star.sparkColor = this.glitterColor;
            star.sparkTimer = Math.random() * star.sparkFreq;
          }
        });
      } else {
        createBurst(this.starCount, starFactory);
      }
    } else if (Array.isArray(this.color)) {
      if (Math.random() < 0.5) {
        const start = Math.random() * Math.PI;
        const start2 = start + Math.PI;
        const arc = Math.PI;
        color = this.color[0];
        createBurst(this.starCount, starFactory, start, arc);
        color = this.color[1];
        createBurst(this.starCount, starFactory, start2, arc);
      } else {
        color = this.color[0];
        createBurst(this.starCount / 2, starFactory);
        color = this.color[1];
        createBurst(this.starCount / 2, starFactory);
      }
    }

    if (this.pistil) {
      const innerShell = new Shell({
        shellSize: this.shellSize,
        spreadSize: this.spreadSize * 0.5,
        starLife: this.starLife * 0.6,
        starLifeVariation: this.starLifeVariation,
        starDensity: 1.4,
        color: this.pistilColor as string,
        glitter: "light",
        glitterColor:
          this.pistilColor === COLOR.Gold ? COLOR.Gold : COLOR.White,
      });
      innerShell.burst(x, y, stageW, stageH, canPlaySound, simSpeed);
    }

    if (this.streamers) {
      const innerShell = new Shell({
        shellSize: this.shellSize,
        spreadSize: this.spreadSize * 0.9,
        starLife: this.starLife * 0.8,
        starLifeVariation: this.starLifeVariation,
        starCount: Math.floor(Math.max(6, this.spreadSize / 45)),
        color: COLOR.White,
        glitter: "streamer",
      });
      innerShell.burst(x, y, stageW, stageH, canPlaySound, simSpeed);
    }

    BurstFlash.add(x, y, this.spreadSize / 4);

    if (this.comet) {
      const store = useFireworkStore.getState();
      const maxDiff = 2;
      const sizeDifferenceFromMaxSize = Math.min(
        maxDiff,
        store.getShellSize() - this.shellSize,
      );
      const soundScale = (1 - sizeDifferenceFromMaxSize / maxDiff) * 0.3 + 0.7;
      soundManager.playSound("burst", soundScale, canPlaySound, simSpeed);
    }
  }

  crossetteEffect(star: StarInstance) {
    const startAngle = Math.random() * PI_HALF;
    createParticleArc(startAngle, PI_2, 4, 0.5, (angle) => {
      Star.add(
        star.x,
        star.y,
        star.color,
        angle,
        Math.random() * 0.6 + 0.75,
        600,
      );
    });
  }

  floralEffect(
    star: StarInstance,
    quality: number,
    canPlaySound: boolean,
    simSpeed: number,
  ) {
    const count = 12 + 6 * quality;
    createBurst(count, (angle, speedMult) => {
      Star.add(
        star.x,
        star.y,
        star.color,
        angle,
        speedMult * 2.4,
        1000 + Math.random() * 300,
        star.speedX,
        star.speedY,
      );
    });
    BurstFlash.add(star.x, star.y, 46);
    soundManager.playSound("burstSmall", 1, canPlaySound, simSpeed);
  }

  fallingLeavesEffect(
    star: StarInstance,
    quality: number,
    canPlaySound: boolean,
    simSpeed: number,
  ) {
    createBurst(7, (angle, speedMult) => {
      const newStar = Star.add(
        star.x,
        star.y,
        INVISIBLE,
        angle,
        speedMult * 2.4,
        2400 + Math.random() * 600,
        star.speedX,
        star.speedY,
      );

      newStar.sparkColor = COLOR.Gold;
      newStar.sparkFreq = 144 / quality;
      newStar.sparkSpeed = 0.28;
      newStar.sparkLife = 750;
      newStar.sparkLifeVariation = 3.2;
    });
    BurstFlash.add(star.x, star.y, 46);
    soundManager.playSound("burstSmall", 1, canPlaySound, simSpeed);
  }

  crackleEffect(star: StarInstance, isHighQuality: boolean) {
    const count = isHighQuality ? 32 : 16;
    createParticleArc(0, PI_2, count, 1.8, (angle) => {
      Spark.add(
        star.x,
        star.y,
        COLOR.Gold,
        angle,
        Math.pow(Math.random(), 0.45) * 2.4,
        300 + Math.random() * 200,
      );
    });
  }
}

export function useFireworkEngine(
  mainCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  trailsCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const mainStageRef = useRef<Stage | null>(null);
  const trailsStageRef = useRef<Stage | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isFirstSeqRef = useRef(true);
  const finaleCountRef = useRef(0);
  const currentFinaleCount = useRef(0);

  // Use getState() inside callbacks instead of subscribing to the entire store
  // This prevents re-renders when store state changes

  // Initialize stages
  const initStages = useCallback(() => {
    if (mainCanvasRef.current && trailsCanvasRef.current) {
      const store = useFireworkStore.getState();
      mainStageRef.current = new Stage(mainCanvasRef.current);
      trailsStageRef.current = new Stage(trailsCanvasRef.current);

      Spark.drawWidth = store.isHighQuality ? 0.75 : 1;

      handleResize();
    }
  }, [mainCanvasRef, trailsCanvasRef]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!containerRef.current) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const containerW = Math.min(w, MAX_WIDTH);
    const containerH = w <= 420 ? h : Math.min(h, MAX_HEIGHT);

    containerRef.current.style.width = `${containerW}px`;
    containerRef.current.style.height = `${containerH}px`;

    mainStageRef.current?.resize(containerW, containerH);
    trailsStageRef.current?.resize(containerW, containerH);

    const store = useFireworkStore.getState();
    const scaleFactor = store.getScaleFactor();
    store.setStageDimensions(
      containerW / scaleFactor,
      containerH / scaleFactor,
    );
  }, [containerRef]);

  // Launch shell from config
  const launchShellFromConfig = useCallback(
    (event?: { x: number; y: number }) => {
      const mainStage = mainStageRef.current;
      if (!mainStage) return;

      const store = useFireworkStore.getState();
      const shell = new Shell(shellFromConfig(store.getShellSize()));
      const w = mainStage.width;
      const h = mainStage.height;

      shell.launch(
        event ? event.x / w : getRandomShellPositionH(),
        event ? 1 - event.y / h : getRandomShellPositionV(),
        store.stageW,
        store.stageH,
        store.canPlaySound(),
        store.simSpeed,
      );
    },
    [],
  );

  // Start sequence
  const startSequence = useCallback(() => {
    const mainStage = mainStageRef.current;
    if (!mainStage) return 1000;

    const store = useFireworkStore.getState();

    if (isFirstSeqRef.current) {
      isFirstSeqRef.current = false;
      if (APP_CONFIG.IS_HEADER) {
        // Two random shells
        const size1 = getRandomShellSize(store.getShellSize());
        const size2 = getRandomShellSize(store.getShellSize());
        const shell1 = new Shell(shellFromConfig(size1.size));
        const shell2 = new Shell(shellFromConfig(size2.size));
        shell1.launch(
          0.3,
          size1.height,
          store.stageW,
          store.stageH,
          store.canPlaySound(),
          store.simSpeed,
        );
        setTimeout(() => {
          const store = useFireworkStore.getState();
          shell2.launch(
            0.7,
            size2.height,
            store.stageW,
            store.stageH,
            store.canPlaySound(),
            store.simSpeed,
          );
        }, 100);
        return 2400;
      } else {
        const shell = new Shell(crysanthemumShell(store.getShellSize()));
        shell.launch(
          0.5,
          0.5,
          store.stageW,
          store.stageH,
          store.canPlaySound(),
          store.simSpeed,
        );
        return 2400;
      }
    }

    if (store.isFinaleMode()) {
      const shellType = randomFastShell();
      const size = getRandomShellSize(store.getShellSize());
      const shell = new Shell(shellType(size.size));
      shell.launch(
        size.x,
        size.height,
        store.stageW,
        store.stageH,
        store.canPlaySound(),
        store.simSpeed,
      );

      if (currentFinaleCount.current < 32) {
        currentFinaleCount.current++;
        return 170;
      } else {
        currentFinaleCount.current = 0;
        return 6000;
      }
    }

    const rand = Math.random();
    const size = getRandomShellSize(store.getShellSize());
    const shell = new Shell(shellFromConfig(size.size));
    shell.launch(
      size.x,
      size.height,
      store.stageW,
      store.stageH,
      store.canPlaySound(),
      store.simSpeed,
    );

    return 900 + Math.random() * 600 + shell.starLife;
  }, []);

  // Update loop
  const update = useCallback(
    (time: number) => {
      const store = useFireworkStore.getState();

      if (!store.isRunning()) {
        animationRef.current = requestAnimationFrame(update);
        return;
      }

      const frameTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const lag = frameTime / 16.67;
      const timeStep = frameTime * store.simSpeed;
      const speed = store.simSpeed * lag;

      store.incrementFrame();

      // Auto launch
      if (store.config.autoLaunch) {
        const newAutoLaunchTime = store.autoLaunchTime - timeStep;
        if (newAutoLaunchTime <= 0) {
          store.setAutoLaunchTime(startSequence() * 1.25);
        } else {
          store.setAutoLaunchTime(newAutoLaunchTime);
        }
      }

      // Update speed bar opacity
      if (store.speedBarOpacity > 0) {
        store.setSpeedBarOpacity(store.speedBarOpacity - lag / 30);
      }

      const starDrag = 1 - (1 - Star.airDrag) * speed;
      const starDragHeavy = 1 - (1 - Star.airDragHeavy) * speed;
      const sparkDrag = 1 - (1 - Spark.airDrag) * speed;
      const gAcc = (timeStep / 1000) * GRAVITY;

      // Update particles
      COLOR_CODES_W_INVIS.forEach((color) => {
        const stars = Star.active[color];
        for (let i = stars.length - 1; i >= 0; i--) {
          const star = stars[i];
          if (star.updateFrame === store.currentFrame) continue;
          star.updateFrame = store.currentFrame;

          star.life -= timeStep;
          if (star.life <= 0) {
            stars.splice(i, 1);
            Star.returnInstance(star);
          } else {
            const burnRate = Math.pow(star.life / star.fullLife, 0.5);
            const burnRateInverse = 1 - burnRate;

            star.prevX = star.x;
            star.prevY = star.y;
            star.x += star.speedX * speed;
            star.y += star.speedY * speed;

            if (!star.heavy) {
              star.speedX *= starDrag;
              star.speedY *= starDrag;
            } else {
              star.speedX *= starDragHeavy;
              star.speedY *= starDragHeavy;
            }
            star.speedY += gAcc;

            if (star.spinRadius) {
              star.spinAngle += star.spinSpeed * speed;
              star.x += Math.sin(star.spinAngle) * star.spinRadius * speed;
              star.y += Math.cos(star.spinAngle) * star.spinRadius * speed;
            }

            if (star.sparkFreq) {
              star.sparkTimer -= timeStep;
              while (star.sparkTimer < 0) {
                star.sparkTimer +=
                  star.sparkFreq * 0.75 + star.sparkFreq * burnRateInverse * 4;
                Spark.add(
                  star.x,
                  star.y,
                  star.sparkColor,
                  Math.random() * PI_2,
                  Math.random() * star.sparkSpeed * burnRate,
                  star.sparkLife * 0.8 +
                    Math.random() * star.sparkLifeVariation * star.sparkLife,
                );
              }
            }

            if (star.life < (star.transitionTime || 0)) {
              if (star.secondColor && !star.colorChanged) {
                star.colorChanged = true;
                star.color = star.secondColor;
                stars.splice(i, 1);
                Star.active[star.secondColor].push(star);
                if (star.secondColor === INVISIBLE) {
                  star.sparkFreq = 0;
                }
              }

              if (star.strobe) {
                star.visible =
                  Math.floor(star.life / (star.strobeFreq || 40)) % 3 === 0;
              }
            }
          }
        }

        const sparks = Spark.active[color];
        for (let i = sparks.length - 1; i >= 0; i--) {
          const spark = sparks[i];
          spark.life -= timeStep;
          if (spark.life <= 0) {
            sparks.splice(i, 1);
            Spark.returnInstance(spark);
          } else {
            spark.prevX = spark.x;
            spark.prevY = spark.y;
            spark.x += spark.speedX * speed;
            spark.y += spark.speedY * speed;
            spark.speedX *= sparkDrag;
            spark.speedY *= sparkDrag;
            spark.speedY += gAcc;
          }
        }
      });

      render(speed);
      animationRef.current = requestAnimationFrame(update);
    },
    [startSequence],
  );

  // Render
  const render = useCallback(
    (speed: number) => {
      const mainStage = mainStageRef.current;
      const trailsStage = trailsStageRef.current;
      if (!mainStage?.ctx || !trailsStage?.ctx) return;

      const store = useFireworkStore.getState();
      const { dpr } = mainStage;
      const width = store.stageW;
      const height = store.stageH;
      const trailsCtx = trailsStage.ctx;
      const mainCtx = mainStage.ctx;

      if (store.getSkyLighting() !== SKY_LIGHT_NONE) {
        colorSky(speed, containerRef.current);
      }

      const scaleFactor = store.getScaleFactor();
      trailsCtx.scale(dpr * scaleFactor, dpr * scaleFactor);
      mainCtx.scale(dpr * scaleFactor, dpr * scaleFactor);

      trailsCtx.globalCompositeOperation = "source-over";
      trailsCtx.fillStyle = `rgba(0, 0, 0, ${
        store.config.longExposure ? 0.0025 : 0.175 * speed
      })`;
      trailsCtx.fillRect(0, 0, width, height);

      mainCtx.clearRect(0, 0, width, height);

      // Draw burst flashes
      while (BurstFlash.active.length) {
        const bf = BurstFlash.active.pop()!;
        const burstGradient = trailsCtx.createRadialGradient(
          bf.x,
          bf.y,
          0,
          bf.x,
          bf.y,
          bf.radius,
        );
        burstGradient.addColorStop(0.024, "rgba(255, 255, 255, 1)");
        burstGradient.addColorStop(0.125, "rgba(255, 160, 20, 0.2)");
        burstGradient.addColorStop(0.32, "rgba(255, 140, 20, 0.11)");
        burstGradient.addColorStop(1, "rgba(255, 120, 20, 0)");
        trailsCtx.fillStyle = burstGradient;
        trailsCtx.fillRect(
          bf.x - bf.radius,
          bf.y - bf.radius,
          bf.radius * 2,
          bf.radius * 2,
        );
        BurstFlash.returnInstance(bf);
      }

      trailsCtx.globalCompositeOperation = "lighten";

      // Draw stars
      trailsCtx.lineWidth = Star.drawWidth;
      trailsCtx.lineCap = store.isLowQuality ? "square" : "round";
      mainCtx.strokeStyle = "#fff";
      mainCtx.lineWidth = 1;
      mainCtx.beginPath();

      COLOR_CODES.forEach((color) => {
        const stars = Star.active[color];
        trailsCtx.strokeStyle = color;
        trailsCtx.beginPath();
        stars.forEach((star) => {
          if (star.visible) {
            trailsCtx.moveTo(star.x, star.y);
            trailsCtx.lineTo(star.prevX, star.prevY);
            mainCtx.moveTo(star.x, star.y);
            mainCtx.lineTo(
              star.x - star.speedX * 1.6,
              star.y - star.speedY * 1.6,
            );
          }
        });
        trailsCtx.stroke();
      });
      mainCtx.stroke();

      // Draw sparks
      trailsCtx.lineWidth = Spark.drawWidth;
      trailsCtx.lineCap = "butt";

      COLOR_CODES.forEach((color) => {
        const sparks = Spark.active[color];
        trailsCtx.strokeStyle = color;
        trailsCtx.beginPath();
        sparks.forEach((spark) => {
          trailsCtx.moveTo(spark.x, spark.y);
          trailsCtx.lineTo(spark.prevX, spark.prevY);
        });
        trailsCtx.stroke();
      });

      // Speed bar
      if (store.speedBarOpacity > 0) {
        const speedBarHeight = 6;
        mainCtx.globalAlpha = store.speedBarOpacity;
        mainCtx.fillStyle = COLOR.Blue;
        mainCtx.fillRect(
          0,
          height - speedBarHeight,
          width * store.simSpeed,
          speedBarHeight,
        );
        mainCtx.globalAlpha = 1;
      }

      trailsCtx.setTransform(1, 0, 0, 1, 0, 0);
      mainCtx.setTransform(1, 0, 0, 1, 0, 0);
    },
    [containerRef],
  );

  // Color sky based on stars
  const currentSkyColor = useRef({ r: 0, g: 0, b: 0 });
  const targetSkyColor = useRef({ r: 0, g: 0, b: 0 });

  const colorSky = useCallback(
    (speed: number, container: HTMLDivElement | null) => {
      if (!container) return;

      const store = useFireworkStore.getState();
      const maxSkySaturation = store.getSkyLighting() * 15;
      const maxStarCount = 500;
      let totalStarCount = 0;

      targetSkyColor.current.r = 0;
      targetSkyColor.current.g = 0;
      targetSkyColor.current.b = 0;

      COLOR_CODES.forEach((color) => {
        const tuple = COLOR_TUPLES[color];
        const count = Star.active[color].length;
        totalStarCount += count;
        targetSkyColor.current.r += tuple.r * count;
        targetSkyColor.current.g += tuple.g * count;
        targetSkyColor.current.b += tuple.b * count;
      });

      const intensity = Math.pow(
        Math.min(1, totalStarCount / maxStarCount),
        0.3,
      );
      const maxColorComponent = Math.max(
        1,
        targetSkyColor.current.r,
        targetSkyColor.current.g,
        targetSkyColor.current.b,
      );

      targetSkyColor.current.r =
        (targetSkyColor.current.r / maxColorComponent) *
        maxSkySaturation *
        intensity;
      targetSkyColor.current.g =
        (targetSkyColor.current.g / maxColorComponent) *
        maxSkySaturation *
        intensity;
      targetSkyColor.current.b =
        (targetSkyColor.current.b / maxColorComponent) *
        maxSkySaturation *
        intensity;

      const colorChange = 10;
      currentSkyColor.current.r +=
        ((targetSkyColor.current.r - currentSkyColor.current.r) / colorChange) *
        speed;
      currentSkyColor.current.g +=
        ((targetSkyColor.current.g - currentSkyColor.current.g) / colorChange) *
        speed;
      currentSkyColor.current.b +=
        ((targetSkyColor.current.b - currentSkyColor.current.b) / colorChange) *
        speed;

      container.style.backgroundColor = `rgb(${currentSkyColor.current.r | 0}, ${
        currentSkyColor.current.g | 0
      }, ${currentSkyColor.current.b | 0})`;
    },
    [],
  );

  // Initialize
  useEffect(() => {
    initStages();
    soundManager.preload();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initStages, handleResize]);

  // Start animation
  useEffect(() => {
    if (mainStageRef.current && trailsStageRef.current) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(update);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [update]);

  // Handle pointer events
  const handlePointerDown = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      const store = useFireworkStore.getState();
      if (!store.isRunning()) return;

      const rect = mainCanvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x =
        "touches" in event
          ? event.touches[0].clientX - rect.left
          : event.clientX - rect.left;
      const y =
        "touches" in event
          ? event.touches[0].clientY - rect.top
          : event.clientY - rect.top;

      launchShellFromConfig({ x, y });
    },
    [launchShellFromConfig, mainCanvasRef],
  );

  return {
    handlePointerDown,
    launchShellFromConfig,
  };
}

export default useFireworkEngine;
