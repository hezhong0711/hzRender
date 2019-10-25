import { Polyline, PolylineCfg } from '../Polyline'
import { Line, LinePath, Point } from '../../unit/Point'

export class RightAnglePolyline extends Polyline {
    startK: number

    constructor(cfg: RightAnglePolylineCfg) {
        super(cfg)
        this.startK = cfg.startK
    }

    draw(context: any): void {
        this.drawRightAngleLine(context)
    }

    tap() {
        if (!this.clickable) {
            return
        }

        if (this.isHighlight) {
            this.onTap()
        }
        this.isHighlight = true
    }

    private drawRightAngleLine(context: any) {
        this.getRightAngleLinePaths()
        // context.beginPath()
        // context.setLineJoin('miter')
        // context.setLineWidth(2)
        // context.moveTo(130, 10)
        // context.lineTo(220, 50)
        // context.lineTo(130, 90)
        // context.stroke()

        // context.draw()
        context.beginPath()
        context.setLineJoin('miter')
        for (let i = 0; i < this.linePaths.length; i++) {
            const path = new LinePath(
                this.getScalePoint(this.linePaths[i].start),
                this.getScalePoint(this.linePaths[i].end),
            )
            if (!this.inVisualArea(path)) {
                continue
            }

            if (this.isDash) {
                context.setLineDash([4, 6])
            } else {
                context.setLineDash([])
            }
            context.setLineWidth(this.isHighlight ? this.highlightStyle.lineWidth : this.lineWidth)

            if (i === 0) {
                context.moveTo(path.start.x, path.start.y)
            } else {
                context.lineTo(path.start.x, path.start.y)
            }
            context.lineTo(path.end.x, path.end.y)
            if (this.lineGradient) {
                const grd = context.createLinearGradient(path.start.x, path.start.y, path.end.x, path.end.y)
                grd.addColorStop(0, path.start.color)
                grd.addColorStop(1, path.end.color)
                context.setStrokeStyle(grd)
            } else {
                context.setStrokeStyle(this.lineColor)
            }
        }
        context.stroke()
    }

    private getRightAngleLinePaths() {
        this.linePaths = []
        let start = null
        let end = null
        let foot = null
        for (const point of this.points) {
            if (start != null) {
                end = point
                foot = this.drawLinkTemp(start, end, foot)
                start = end
            } else {
                start = point
            }
        }
    }

    private drawLinkTemp(start: Point, end: Point, pFoot: Point) {
        const p1: Point = start
        const p2: Point = end
        // 垂足1
        const line1: Line = Line.getLineByK(p2, this.startK)
        const p3: Point = line1.calcFootPoint(p1)
        // 垂足2

        const line2: Line = Line.getLineByK(p1, this.startK)
        const p4: Point = line2.calcFootPoint(p2)
        let p: Point = null
        if (pFoot && ((p1.x > pFoot.x && p4.x > p1.x) || (p1.x < pFoot.x && p4.x < p1.x))) {
            p = p4
            const path1 = new LinePath(p1, p4)
            const path2 = new LinePath(p4, p2)
            this.linePaths.push(path1)
            this.linePaths.push(path2)
        } else {
            p = p3
            const path1 = new LinePath(p1, p3)
            const path2 = new LinePath(p3, p2)
            this.linePaths.push(path1)
            this.linePaths.push(path2)
        }

        return p
    }
}

export interface RightAnglePolylineCfg extends PolylineCfg {
    startK: number
}
