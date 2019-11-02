import { Point } from '../unit/Point';
import { Tools } from '../unit/Tools';

export class Animator {
    startPosition: Point;
    endPosition: Point;
    durationTime: number;
    onDone: (e: any) => void;
    isDone: boolean = false;
    isStop: boolean = false;

    constructor(cfg: AnimatorCfg) {
        this.startPosition = cfg.startPosition;
        this.endPosition = cfg.endPosition;
        this.durationTime = cfg.durationTime || 1000;
        this.onDone = cfg.onDone;
    }

    // 动画执行偏移量
    animateDelta(execTime: number): Point {
        if (this.isDone) {
            return this.endPosition;
        }

        const percent = this.getAnimatePercent(execTime);

        if (percent === 1) {
            this.isDone = true;
        }
        const deltaX = this.startPosition.x + percent * (this.endPosition.x - this.startPosition.x);
        const deltaY = this.startPosition.y + percent * (this.endPosition.y - this.startPosition.y);
        return new Point(deltaX, deltaY);
    }

    done() {
        this.isDone = true;
    }

    stop() {
        this.isStop = true;
    }

    private getAnimatePercent(execTime: number) {
        let percent = 0;
        if (this.isStop) {
            percent = 1;
        } else {
            percent = Tools.getMin(execTime / this.durationTime, 1);
        }
        return percent;
    }
}

export class AnimatorCfg {
    startPosition: Point;
    endPosition: Point;
    durationTime: number;
    onDone: (e: any) => void;
}
