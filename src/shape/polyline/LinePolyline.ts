import { Polyline, PolylineCfg } from '../Polyline';
import { Point } from '../../unit/Point';
import { ScaleInfo } from '../../basic/ScaleInfo';
import { LinePath } from '../../unit/LinePath';

export class LinePolyline extends Polyline {
    constructor(cfg: PolylineCfg) {
        super(cfg);
        this.linePaths = this.getLinePaths();
    }
    contain(x: number, y: number): boolean {
        const scalePaths = this.getScaleLinePaths();
        const point = new Point(x, y);
        for (const path of scalePaths) {
            const distance = path.toLine().calcDistanceFromPointToLine(point);
            if (distance < this.tapOffset) {
                return true;
            }
        }
        return false;
    }

    inVisualArea(linePath: LinePath): boolean {
        return !(
            !this.isPointInVisualArea(linePath.start) &&
            !this.isPointInVisualArea(linePath.end) &&
            !this.isLineInVisualArea(linePath.toLine())
        );
    }

    draw(context: any): void {
        this.drawLine(context);
    }

    pan(scaleInfo: ScaleInfo): void {
        this.linePaths.forEach(path => {
            path.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        });
    }

    tap() {
        if (this.clickable) {
            super.tap();
            this.isHighlight = true;
        }
    }

    unTap() {
        super.unTap();
        this.isHighlight = false;
    }

    getLinePaths() {
        const cache: LinePath[] = [];

        for (let i = 1; i < this.points.length; i++) {
            cache.push(new LinePath(this.points[i - 1], this.points[i]));
        }
        return cache;
    }

    getScaleLinePaths() {
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

    protected drawLine(context: any) {
        const scalePaths = this.getScaleLinePaths();
        for (let i = 0; i < scalePaths.length; i++) {
            const path = scalePaths[i];
            if (!this.inVisualArea(path)) {
                // console.log('line is out of visual area');
                continue;
            }

            context.beginPath();
            if (this.isDash) {
                context.setLineDash([4, 6]);
            } else {
                context.setLineDash([]);
            }
            context.setLineWidth(this.lineWidth);
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
            context.stroke();
        }
    }
}
