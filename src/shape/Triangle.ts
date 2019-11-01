import { Displayable, DisplayableCfg } from '../basic/Displayable';
import { Point } from '../unit/Point';
import { ScaleInfo } from '../basic/ScaleInfo';
import { LineHelper } from '../factory/LineHelper';

export class Triangle extends Displayable {
    point: Point;
    color: string;
    size: number;

    private pcRight: Point;
    private pcLeft: Point;
    private pcTop: Point;

    private pRightLeft: Point;
    private pLeftRight: Point;
    private pTopRight: Point;
    private pRightTop: Point;
    private pTopLeft: Point;
    private pLeftTop: Point;

    constructor(cfg: TriangleCfg) {
        super(cfg);
        this.point = cfg.point;
        this.color = cfg.color;
        this.size = cfg.size !== undefined ? cfg.size : 1;
        this.calcTriangle();
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

        const scaleTopRight = this.getScalePoint(this.pTopRight);
        const scaleRightTop = this.getScalePoint(this.pRightTop);
        const scaleRight = this.getScalePoint(this.pcRight);
        const scaleRightLeft = this.getScalePoint(this.pRightLeft);
        const scaleLeftRight = this.getScalePoint(this.pLeftRight);
        const scaleLeft = this.getScalePoint(this.pcLeft);
        const scaleLeftTop = this.getScalePoint(this.pLeftTop);
        const scaleTopLeft = this.getScalePoint(this.pTopLeft);
        const scaleTop = this.getScalePoint(this.pcTop);
        context.beginPath();
        context.moveTo(scaleTopRight.x, scaleTopRight.y);
        context.lineTo(scaleRightTop.x, scaleRightTop.y);
        context.quadraticCurveTo(scaleRight.x, scaleRight.y, scaleRightLeft.x, scaleRightLeft.y);
        context.lineTo(scaleRightLeft.x, scaleRightLeft.y);

        context.lineTo(scaleLeftRight.x, scaleLeftRight.y);
        context.quadraticCurveTo(scaleLeft.x, scaleLeft.y, scaleLeftTop.x, scaleLeftTop.y);
        context.lineTo(scaleLeftTop.x, scaleLeftTop.y);

        context.lineTo(scaleTopLeft.x, scaleTopLeft.y);
        context.quadraticCurveTo(scaleTop.x, scaleTop.y, scaleTopRight.x, scaleTopRight.y);
        context.lineTo(scaleTopRight.x, scaleTopRight.y);
        context.fillStyle = this.color;
        context.fill();
    }

    inVisualArea(params?: any): boolean {
        return true;
    }

    pan(scaleInfo: ScaleInfo): void {
        this.point.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        this.pcTop.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        this.pcLeft.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        this.pcRight.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        this.pTopRight.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        this.pLeftRight.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        this.pRightLeft.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        this.pLeftTop.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        this.pTopLeft.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        this.pRightTop.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
    }

    private calcTriangle() {
        // 三角形三个顶点
        this.pcTop = new Point(this.point.x, this.point.y - 7 * this.size);
        this.pcLeft = new Point(this.point.x - 7 * this.size, this.point.y + 5 * this.size);
        this.pcRight = new Point(this.point.x + 5 * this.size, this.point.y + 3 * this.size);
        // 三角形三条边的斜率
        const k1 = LineHelper.calcK(this.pcTop, this.pcLeft);
        const k2 = LineHelper.calcK(this.pcTop, this.pcRight);
        const k3 = LineHelper.calcK(this.pcLeft, this.pcRight);

        // 圆角三角形弧线的六个顶点
        const offset1 = 4 * this.size;
        this.pLeftTop = new Point(this.pcLeft.x + offset1, this.pcLeft.y + k1 * offset1);

        const offset2 = 4 * this.size;
        this.pTopLeft = new Point(this.pcTop.x - offset2, this.pcTop.y - k1 * offset2);

        const offset3 = 2 * this.size;
        this.pRightTop = new Point(this.pcRight.x - offset3, this.pcRight.y - k2 * offset3);

        const offset4 = 3 * this.size;
        this.pTopRight = new Point(this.pcTop.x + offset4, this.pcTop.y + k2 * offset4);

        const offset5 = 6 * this.size;
        this.pLeftRight = new Point(this.pcLeft.x + offset5, this.pcLeft.y + k3 * offset5);

        const offset6 = -5 * this.size;
        this.pRightLeft = new Point(this.pcRight.x + offset6, this.pcRight.y + k3 * offset6);
    }
}

export interface TriangleCfg extends DisplayableCfg {
    point: Point;
    color: string;
    size: number;
}
