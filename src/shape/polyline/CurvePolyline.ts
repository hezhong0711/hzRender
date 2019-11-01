import { Polyline, PolylineCfg } from '../Polyline';
import { ScaleInfo } from '../../basic/ScaleInfo';
import { Curve } from '../../unit/Curve';
import { Point } from '../../unit/Point';

export class CurvePolyline extends Polyline {
    curvePath: Curve;

    constructor(cfg: PolylineCfg) {
        super(cfg);
        if (this.points.length !== 2) {
            this.points = [];
        }
        this.curvePath = this.getCurvePaths();
    }

    draw(context: any): void {
        this.drawCurve(context);
    }

    pan(scaleInfo: ScaleInfo): void {
        this.curvePath.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
    }

    inVisualArea(linePath: Curve): boolean {
        return !(
            !this.isPointInVisualArea(linePath.start) &&
            !this.isPointInVisualArea(linePath.end) &&
            !this.isPointInVisualArea(linePath.ctrl) &&
            !this.isLineInVisualArea(linePath.toLine())
        );
    }

    private getCurvePaths() {
        const ctrl = new Point((this.points[0].x - this.points[1].x) / 2, 100 + (100 - this.points[1].y) / 2);

        return new Curve(this.points[0], ctrl, this.points[1]);
    }

    private getScaleCurvePaths() {
        const scalePath = new Curve(
            this.getScalePoint(this.curvePath.start),
            this.getScalePoint(this.curvePath.ctrl),
            this.getScalePoint(this.curvePath.end),
        );

        if (!this.inVisualArea(scalePath)) {
            return null;
        }
        return scalePath;
    }

    private drawCurve(context: any) {
        const scalePaths = this.getScaleCurvePaths();
        if (scalePaths == null) {
            return;
        }
        context.beginPath();
        context.lineWidth = 0.5;
        context.strokeStyle = this.lineColor;
        context.moveTo(scalePaths.start.x, scalePaths.start.y);
        context.quadraticCurveTo(scalePaths.ctrl.x, scalePaths.ctrl.y, scalePaths.end.x, scalePaths.end.y);
        context.stroke();
    }
}
