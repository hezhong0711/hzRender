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
        const r = 20;
        const p1 = new Point(x, y);
        const p2 = this.getScalePoint(this.point);
        const distance = p1.calcDistance(p2);
        return distance <= this.getScaleLength(r);
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

        if (this.selected) {
            const colorCfg = this.color.split(',');
            colorCfg.splice(colorCfg.length - 1, 1, '0.2)');
            const color = colorCfg.join(',');
            context.beginPath();
            context.setFillStyle(color);
            context.arc(scalePoint.x, scalePoint.y, (this.baseR / this.baseScale) * scaleR + 10, 0, Math.PI * 2);
            context.fill();
        }
    }

    inVisualArea(params?: any): boolean {
        return true;
    }

    pan(scaleInfo: ScaleInfo): void {
        this.point.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
    }

    protected animateTo(delta: Point) {
        const scaleDelta = this.getScalePoint(delta);
        this.point.x = scaleDelta.x;
        this.point.y = scaleDelta.y;
    }
}

export interface CommaCfg extends DisplayableCfg {
    point: Point;
    color: string;
}
