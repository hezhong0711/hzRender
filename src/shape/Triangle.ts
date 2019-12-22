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
        const scaleSize = this.getScaleLength(this.size);
        this.calcTriangle(scalePoint, scaleSize);

        context.beginPath();
        context.moveTo(this.pTopRight.x, this.pTopRight.y);
        context.lineTo(this.pRightTop.x, this.pRightTop.y);
        context.quadraticCurveTo(this.pcRight.x, this.pcRight.y, this.pRightLeft.x, this.pRightLeft.y);
        context.lineTo(this.pRightLeft.x, this.pRightLeft.y);

        context.lineTo(this.pLeftRight.x, this.pLeftRight.y);
        context.quadraticCurveTo(this.pcLeft.x, this.pcLeft.y, this.pLeftTop.x, this.pLeftTop.y);
        context.lineTo(this.pLeftTop.x, this.pLeftTop.y);

        context.lineTo(this.pTopLeft.x, this.pTopLeft.y);
        context.quadraticCurveTo(this.pcTop.x, this.pcTop.y, this.pTopRight.x, this.pTopRight.y);
        context.lineTo(this.pTopRight.x, this.pTopRight.y);
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

    private calcTriangle(point: Point, size: number) {
        // 三角形三个顶点
        this.pcTop = new Point(point.x, point.y - 7 * size);
        this.pcLeft = new Point(point.x - 7 * size, point.y + 5 * size);
        this.pcRight = new Point(point.x + 5 * size, point.y + 3 * size);
        // 三角形三条边的斜率
        const k1 = LineHelper.calcK(this.pcTop, this.pcLeft);
        const k2 = LineHelper.calcK(this.pcTop, this.pcRight);
        const k3 = LineHelper.calcK(this.pcLeft, this.pcRight);

        // 圆角三角形弧线的六个顶点
        const offset1 = 4 * size;
        this.pLeftTop = new Point(this.pcLeft.x + offset1, this.pcLeft.y + k1 * offset1);

        const offset2 = 4 * size;
        this.pTopLeft = new Point(this.pcTop.x - offset2, this.pcTop.y - k1 * offset2);

        const offset3 = 2 * size;
        this.pRightTop = new Point(this.pcRight.x - offset3, this.pcRight.y - k2 * offset3);

        const offset4 = 3 * size;
        this.pTopRight = new Point(this.pcTop.x + offset4, this.pcTop.y + k2 * offset4);

        const offset5 = 6 * size;
        this.pLeftRight = new Point(this.pcLeft.x + offset5, this.pcLeft.y + k3 * offset5);

        const offset6 = -5 * size;
        this.pRightLeft = new Point(this.pcRight.x + offset6, this.pcRight.y + k3 * offset6);
    }
}

export interface TriangleCfg extends DisplayableCfg {
    point: Point;
    color: string;
    size: number;
}
