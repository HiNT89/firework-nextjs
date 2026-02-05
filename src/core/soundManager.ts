import { MyMath } from "@/utils";

export interface SoundSource {
  volume: number;
  playbackRateMin: number;
  playbackRateMax: number;
  fileNames: string[];
  buffers?: AudioBuffer[];
}

class SoundManager {
  baseURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/";
  ctx: AudioContext | null = null;
  sources: Record<string, SoundSource> = {
    lift: {
      volume: 1,
      playbackRateMin: 0.85,
      playbackRateMax: 0.95,
      fileNames: ["lift1.mp3", "lift2.mp3", "lift3.mp3"],
    },
    burst: {
      volume: 1,
      playbackRateMin: 0.8,
      playbackRateMax: 0.9,
      fileNames: ["burst1.mp3", "burst2.mp3"],
    },
    burstSmall: {
      volume: 0.25,
      playbackRateMin: 0.8,
      playbackRateMax: 1,
      fileNames: ["burst-sm-1.mp3", "burst-sm-2.mp3"],
    },
    crackle: {
      volume: 0.2,
      playbackRateMin: 1,
      playbackRateMax: 1,
      fileNames: ["crackle1.mp3"],
    },
    crackleSmall: {
      volume: 0.3,
      playbackRateMin: 1,
      playbackRateMax: 1,
      fileNames: ["crackle-sm-1.mp3"],
    },
  };

  private _lastSmallBurstTime = 0;
  private _initialized = false;

  init() {
    if (this._initialized || typeof window === "undefined") return;

    try {
      this.ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      this._initialized = true;
    } catch (e) {
      console.warn("AudioContext not available:", e);
    }
  }

  async preload(): Promise<void[]> {
    if (!this.ctx) {
      this.init();
    }

    if (!this.ctx) {
      return Promise.resolve([]);
    }

    const allFilePromises: Promise<void>[] = [];

    const checkStatus = (response: Response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      throw new Error(response.statusText);
    };

    const types = Object.keys(this.sources);
    types.forEach((type) => {
      const source = this.sources[type];
      const { fileNames } = source;
      const filePromises: Promise<AudioBuffer>[] = [];

      fileNames.forEach((fileName) => {
        const fileURL = this.baseURL + fileName;
        const promise = fetch(fileURL)
          .then(checkStatus)
          .then((response) => response.arrayBuffer())
          .then(
            (data) =>
              new Promise<AudioBuffer>((resolve, reject) => {
                this.ctx!.decodeAudioData(data, resolve, reject);
              }),
          );

        filePromises.push(promise);
      });

      Promise.all(filePromises).then((buffers) => {
        source.buffers = buffers;
      });

      allFilePromises.push(...filePromises.map((p) => p.then(() => undefined)));
    });

    return Promise.all(allFilePromises);
  }

  pauseAll() {
    this.ctx?.suspend();
  }

  resumeAll() {
    if (!this.ctx) return;

    // Play a sound with no volume for iOS
    this.playSound("lift", 0);

    setTimeout(() => {
      this.ctx?.resume();
    }, 250);
  }

  playSound(type: string, scale = 1, canPlaySound = true, simSpeed = 1) {
    scale = MyMath.clamp(scale, 0, 1);

    if (!canPlaySound || simSpeed < 0.95 || !this.ctx) {
      return;
    }

    // Throttle small bursts
    if (type === "burstSmall") {
      const now = Date.now();
      if (now - this._lastSmallBurstTime < 20) {
        return;
      }
      this._lastSmallBurstTime = now;
    }

    const source = this.sources[type];
    if (!source || !source.buffers || source.buffers.length === 0) {
      return;
    }

    const initialVolume = source.volume;
    const initialPlaybackRate = MyMath.random(
      source.playbackRateMin,
      source.playbackRateMax,
    );

    const scaledVolume = initialVolume * scale;
    const scaledPlaybackRate = initialPlaybackRate * (2 - scale);

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = scaledVolume;

    const buffer = MyMath.randomChoice(source.buffers);
    const bufferSource = this.ctx.createBufferSource();
    bufferSource.playbackRate.value = scaledPlaybackRate;
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    bufferSource.start(0);
  }
}

export const soundManager = new SoundManager();
export default soundManager;
