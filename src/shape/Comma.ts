import { Displayable, DisplayableCfg } from '../basic/Displayable';
import { Point } from '../unit/Point';
import { ScaleInfo } from '../basic/ScaleInfo';

export class Comma extends Displayable {
    point: Point;
    color: string;
    baseScale: number = 0.618;
    baseR: number = 21.85;
    wholeScale: number = 1 / 3;
    baseScale5: number = Math.pow(this.baseScale, 5);

    constructor(cfg: CommaCfg) {
        super(cfg);
        this.point = cfg.point;
        this.color = cfg.color;
    }

    contain(x: number, y: number): boolean {
        return false;
    }

    draw(context: any, scaleInfo?: ScaleInfo): void {
        if (!this.inVisualArea()) {
            return;
        }

        const scalePoint = this.getScalePoint(this.point);
        const scaleR = this.getScaleLength(this.wholeScale);
        context.beginPath();

        context.setFillStyle(this.color);
        context.arc(scalePoint.x, scalePoint.y, this.baseR * scaleR, 0, 2 * Math.PI);
        context.arc(
            scalePoint.x - 9.07 * scaleR,
            scalePoint.y - 9.93 * scaleR,
            (this.baseR / this.baseScale) * scaleR,
            0.266 * Math.PI,
            0.849 * Math.PI,
        );
        context.arc(
            scalePoint.x - 39.53 * scaleR,
            scalePoint.y + 5.51 * scaleR,
            this.baseR * this.baseScale5 * scaleR,
            0.668 * Math.PI,
            1.634 * Math.PI,
        );
        context.arc(
            scalePoint.x - 34.42 * scaleR,
            scalePoint.y - 8.33 * scaleR,
            this.baseR * this.baseScale * scaleR,
            0.61 * Math.PI,
            0.065 * Math.PI,
            true,
        );
        context.fill();

        context.beginPath();
        context.setFillStyle('#fafaff');
        context.arc(
            scalePoint.x + 5.1 * scaleR,
            scalePoint.y - 1.26 * scaleR,
            this.baseR * this.baseScale * this.baseScale * scaleR,
            0,
            2 * Math.PI,
        );
        context.fill();
        context.closePath();
    }

    inVisualArea(params?: any): boolean {
        return true;
    }

    pan(scaleInfo: ScaleInfo): void {}
}

export interface CommaCfg extends DisplayableCfg {
    point: Point;
    color: string;
}
