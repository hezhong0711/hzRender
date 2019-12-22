import { Displayable, DisplayableCfg } from '../basic/Displayable';
import { Point } from '../unit/Point';
import { ScaleInfo } from '../basic/ScaleInfo';

export class Circle extends Displayable {
    c: Point;
    r: number;
    color: string;
    selectedType: string;

    constructor(cfg: CircleCfg) {
        super(cfg);
        this.c = new Point(cfg.cx, cfg.cy);
        this.r = cfg.r == null ? 10 : cfg.r;
        this.color = cfg.color == null ? 'blue' : cfg.color;
        this.selectedType = cfg.selectedType ? cfg.selectedType : 'defalut';
    }

    draw(context: CanvasContext): void {
        if (!this.inVisualArea()) {
            return;
        }

        const scaleC = this.getScalePoint(this.c);
        const scaleR = this.getScaleLength(this.r);

        if (this.selected) {
            switch (this.selectedType) {
                case 'circle': {
                    context.beginPath();
                    context.setStrokeStyle(this.color);
                    context.setFillStyle('#fff');
                    context.arc(scaleC.x, scaleC.y, scaleR + 5, 0, Math.PI * 2);
                    context.stroke();
                    context.fill();
                    break;
                }
                default: {
                    const colorCfg = this.color.split(',');
                    colorCfg.splice(colorCfg.length - 1, 1, '0.2)');
                    const color = colorCfg.join(',');
                    context.beginPath();
                    context.setFillStyle(color);
                    context.arc(scaleC.x, scaleC.y, scaleR + 5, 0, Math.PI * 2);
                    context.fill();
                }
            }
        }

        context.beginPath();
        context.arc(scaleC.x, scaleC.y, scaleR, 0, 2 * Math.PI);
        context.setFillStyle(this.color);
        context.fill();
    }

    contain(x: number, y: number): boolean {
        const p1 = new Point(x, y);
        const p2 = this.getScalePoint(this.c);
        const distance = p1.calcDistance(p2);
        return distance <= this.getScaleLength(this.r);
    }

    inVisualArea(): boolean {
        const scaleC = this.getScalePoint(this.c);
        const scaleR = this.getScaleLength(this.r);
        return (
            scaleC.x <= this.visualSize.width + scaleR &&
            scaleC.x >= 0 - scaleR &&
            scaleC.y <= this.visualSize.height + scaleR &&
            scaleC.y >= 0 - scaleR
        );
    }

    pan(scaleInfo: ScaleInfo): void {
        this.c.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
    }

    protected animateTo(delta: Point) {
        const scaleDelta = this.getScalePoint(delta);
        this.c.x = scaleDelta.x;
        this.c.y = scaleDelta.y;
    }
}

interface CircleCfg extends DisplayableCfg {
    cx: number;
    cy: number;
    r?: number;
    color?: string;
    selectedType?: string;
}
