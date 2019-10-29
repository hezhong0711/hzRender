import { Polyline, PolylineCfg } from '../Polyline';
import { Point } from '../../unit/Point';
import { ScaleInfo } from '../../basic/ScaleInfo';
import { LinePath } from '../../unit/LinePath';
import { Line } from '../../unit/Line';
import { LineHelper } from '../../factory/LineHelper';

export class RightAnglePolyline extends Polyline {
    startK: number;

    constructor(cfg: RightAnglePolylineCfg) {
        super(cfg);
        this.startK = cfg.startK;
        this.getRightAngleLinePaths();
    }

    contain(x: number, y: number): boolean {
        const scalePaths = this.getScalePaths();
        const point = new Point(x, y);
        for (const path of scalePaths) {
            const distance = path.toLine().calcDistanceFromPointToLine(point);
            if (distance < this.tapOffset) {
                return true;
            }
        }
        return false;
    }

    pan(scaleInfo: ScaleInfo): void {
        this.linePaths.forEach(path => {
            path.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        });
    }

    draw(context: any): void {
        this.drawRightAngleLine(context);
    }

    tap() {
        if (!this.clickable) {
            return;
        }

        if (this.isHighlight) {
            this.onTap();
        }
        this.isHighlight = true;
    }

    getRightAngleLinePaths() {
        this.linePaths = [];
        let start = null;
        let end = null;
        let foot = null;
        for (const point of this.points) {
            if (start != null) {
                end = point;
                foot = this.drawLinkTemp(start, end, foot);
                start = end;
            } else {
                start = point;
            }
        }
    }

    getScalePaths() {
        const scalePaths = [];
        for (const path of this.linePaths) {
            const scalePath = new LinePath(this.getScalePoint(path.start), this.getScalePoint(path.end));
            if (!this.inVisualArea(scalePath)) {
                continue;
            }
            scalePaths.push(scalePath);
        }
        return scalePaths;
    }

    protected isLineInVisualArea(line: Line): boolean {
        return true;
    }

    private drawRightAngleLine(context: any) {
        const scalePaths = this.getScalePaths();
        context.beginPath();
        context.setLineJoin('miter');
        for (let i = 0; i < scalePaths.length; i++) {
            const path = scalePaths[i];
            if (!this.inVisualArea(path)) {
                continue;
            }

            if (this.isDash) {
                context.setLineDash([4, 6]);
            } else {
                context.setLineDash([]);
            }
            context.setLineWidth(this.isHighlight ? this.highlightStyle.lineWidth : this.lineWidth);

            if (i === 0) {
                context.moveTo(path.start.x, path.start.y);
            } else {
                context.lineTo(path.start.x, path.start.y);
            }
            context.lineTo(path.end.x, path.end.y);
            if (this.lineGradient) {
                const grd = context.createLinearGradient(path.start.x, path.start.y, path.end.x, path.end.y);
                grd.addColorStop(0, path.start.color);
                grd.addColorStop(1, path.end.color);
                context.setStrokeStyle(grd);
            } else {
                context.setStrokeStyle(this.lineColor);
            }
        }
        context.stroke();
    }

    private drawLinkTemp(start: Point, end: Point, pFoot: Point) {
        const p1: Point = start;
        const p2: Point = end;
        // 垂足1
        const line1: Line = LineHelper.getLineByK(p2, this.startK);
        const p3: Point = line1.calcFootPoint(p1);
        // 垂足2

        const line2: Line = LineHelper.getLineByK(p1, this.startK);
        const p4: Point = line2.calcFootPoint(p2);
        let p: Point = null;
        if (pFoot && ((p1.x > pFoot.x && p4.x > p1.x) || (p1.x < pFoot.x && p4.x < p1.x))) {
            p = p4;
            const path1 = new LinePath(p1, p4);
            const path2 = new LinePath(p4, p2);
            this.linePaths.push(path1);
            this.linePaths.push(path2);
        } else {
            p = p3;
            const path1 = new LinePath(p1, p3);
            const path2 = new LinePath(p3, p2);
            this.linePaths.push(path1);
            this.linePaths.push(path2);
        }

        return p;
    }
}

export interface RightAnglePolylineCfg extends PolylineCfg {
    startK: number;
}
