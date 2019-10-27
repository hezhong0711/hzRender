import { Displayable, DisplayableCfg } from '../basic/Displayable';
import { Point } from '../unit/Point';
import { ScaleInfo } from '../basic/ScaleInfo';

export class Rect extends Displayable {
    p: Point;
    width: number;
    height: number;
    color: string;

    constructor(cfg: RectCfg) {
        super(cfg);
        this.p = new Point(cfg.px, cfg.py);
        this.width = cfg.width;
        this.height = cfg.height;
        this.color = cfg.color == null ? 'blue' : cfg.color;
    }

    contain(x: number, y: number): boolean {
        const point = this.getScalePoint(this.p);
        const wh = this.getScaleWidthAndHeight();
        const deltaX = x - point.x;
        const deltaY = y - point.y;

        return deltaX >= 0 && deltaX <= wh.width && deltaY >= 0 && deltaY <= wh.height;
    }

    inVisualArea(): boolean {
        const p = this.getScalePoint(this.p);
        const wh = this.getScaleWidthAndHeight();

        return (
            p.x >= 0 - wh.width &&
            p.x <= wh.width + this.visualSize.width &&
            p.y >= 0 - wh.height &&
            p.y <= wh.width + this.visualSize.height
        );
    }

    draw(context: any): void {
        if (!this.inVisualArea()) {
            return;
        }
        const point = this.getScalePoint(this.p);
        const wh = this.getScaleWidthAndHeight();
        context.beginPath();
        context.rect(point.x, point.y, wh.width, wh.height);
        context.setFillStyle(this.color);
        context.fill();
    }

    pan(scaleInfo: ScaleInfo): void {
        this.p.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
    }

    private getScaleWidthAndHeight() {
        return {
            width: this.getScaleLength(this.width),
            height: this.getScaleLength(this.height),
        };
    }
}

interface RectCfg extends DisplayableCfg {
    px: number;
    py: number;
    width: number;
    height: number;
    color?: string;
}
