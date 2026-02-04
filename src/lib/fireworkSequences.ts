import { getRandomShellSize } from "./fireworkUtils";
import {
  getRandomShellPositionH,
  getRandomShellPositionV,
} from "./fireworkUtils";

export interface Shell {
  launch: (x: number, y: number) => void;
  starLife: number;
}

export class FireworkSequencer {
  private isFirstSeq = true;
  private finaleCount = 32;
  private currentFinaleCount = 0;
  private seqSmallBarrage_lastCalled = Date.now();
  private seqSmallBarrage_cooldown = 15000;

  constructor(
    private onLaunchShell: (x: number, y: number, shellSize: number) => void,
    private getShellConfig: (name: string, size: number) => any,
    private getConfig: () => any,
  ) {}

  seqRandomShell() {
    const size = getRandomShellSize(+this.getConfig().size);
    this.onLaunchShell(size.x, size.height, size.size);
    return 900 + Math.random() * 600 + this.getConfig().starLife;
  }

  seqRandomFastShell() {
    const size = getRandomShellSize(+this.getConfig().size);
    this.onLaunchShell(size.x, size.height, size.size);
    return 900 + Math.random() * 600 + this.getConfig().starLife;
  }

  seqTwoRandom() {
    const size1 = getRandomShellSize(+this.getConfig().size);
    const size2 = getRandomShellSize(+this.getConfig().size);

    this.onLaunchShell(size1.x, size1.height, size1.size);
    setTimeout(() => {
      this.onLaunchShell(size2.x, size2.height, size2.size);
    }, 100);

    return 900 + Math.random() * 600 + 1200;
  }

  seqTriple() {
    const size1 = getRandomShellSize(+this.getConfig().size);
    const size2 = getRandomShellSize(+this.getConfig().size);
    const size3 = getRandomShellSize(+this.getConfig().size);

    this.onLaunchShell(size1.x, size1.height, size1.size);
    setTimeout(() => {
      this.onLaunchShell(size2.x, size2.height, size2.size);
    }, 100);
    setTimeout(() => {
      this.onLaunchShell(size3.x, size3.height, size3.size);
    }, 200);

    return 900 + Math.random() * 600 + 1200;
  }

  seqPyramid() {
    const barrageCount = 10;
    const barrageCountHalf = Math.ceil(barrageCount / 2);
    let count = 0;
    let delay = 0;

    while (count <= barrageCountHalf) {
      const size = getRandomShellSize(+this.getConfig().size);
      setTimeout(() => {
        this.onLaunchShell(size.x, size.height, size.size);
      }, delay);
      count++;
      delay += 150;
    }

    count = barrageCountHalf - 1;
    while (count > 0) {
      const size = getRandomShellSize(+this.getConfig().size);
      setTimeout(() => {
        this.onLaunchShell(size.x, size.height, size.size);
      }, delay);
      count--;
      delay += 150;
    }

    return delay + 600;
  }

  seqSmallBarrage() {
    const barrageCount = 8;
    let count = 0;
    let delay = 0;

    while (count < barrageCount) {
      const size = getRandomShellSize(+this.getConfig().size);
      setTimeout(() => {
        this.onLaunchShell(size.x, size.height, size.size);
      }, delay);
      count++;
      delay += 75 + Math.random() * 75;
    }

    return delay + 200;
  }

  startSequence() {
    const config = this.getConfig();
    const finale = config.finale;

    if (finale) {
      if (this.currentFinaleCount++ >= this.finaleCount) {
        return this.seqRandomShell();
      }

      const size = getRandomShellSize(+config.size);
      this.onLaunchShell(
        Math.random() * 0.5 + 0.25,
        Math.random() * 0.5 + 0.25,
        size.size,
      );

      return 800 + Math.random() * 400;
    }

    if (this.isFirstSeq) {
      this.isFirstSeq = false;
      return 1400;
    }

    if (this.seqSmallBarrage_cooldown) {
      const timeSinceLastCall = Date.now() - this.seqSmallBarrage_lastCalled;
      if (timeSinceLastCall < this.seqSmallBarrage_cooldown) {
        return this.seqSmallBarrage_cooldown - timeSinceLastCall;
      }
    }

    const sequences = [
      () => this.seqRandomShell(),
      () => this.seqTwoRandom(),
      () => this.seqTriple(),
      () => this.seqPyramid(),
      () => this.seqSmallBarrage(),
    ];

    const randomSeq = sequences[Math.floor(Math.random() * sequences.length)];
    this.seqSmallBarrage_lastCalled = Date.now();
    return randomSeq();
  }

  resetFinaleCount() {
    this.currentFinaleCount = 0;
  }
}
