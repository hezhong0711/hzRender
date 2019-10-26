import { Polyline, PolylineCfg, PolylineStyle } from '../Polyline'
import { CatMullCurve, Line, LinePath, Point } from '../../unit/Point'
import { ScaleInfo } from '../../basic/ScaleInfo'

export class CatMullCurvePolyline extends Polyline {
    catMullPaths: CatMullCurve[] = []

    constructor(cfg: PolylineCfg) {
        super(cfg)
        this.catMullPaths = this.getCatMullPaths()
    }

    draw(context: any): void {
        this.drawCatMull(context)
    }

    pan(scaleInfo: ScaleInfo): void {
        this.catMullPaths.forEach(path => {
            path.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y)
        })
    }

    getCatMullPaths() {
        const cache: CatMullCurve[] = []
        const data = this.points

        let p0
        let p1
        let p2
        let p3
        let bp1
        let bp2
        let d1
        let d2
        let d3
        let A
        let B
        let N
        let M
        let d3powA
        let d2powA
        let d3pow2A
        let d2pow2A
        let d1pow2A
        let d1powA
        const length = data.length
        for (let i = 0; i < length - 1; i++) {
            p0 = i === 0 ? data[0] : data[i - 1]
            p1 = data[i]
            p2 = data[i + 1]
            p3 = i + 2 < length ? data[i + 2] : p2

            d1 = Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2))
            d2 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
            d3 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2))

            d3powA = Math.pow(d3, this.smooth)
            d3pow2A = Math.pow(d3, 2 * this.smooth)
            d2powA = Math.pow(d2, this.smooth)
            d2pow2A = Math.pow(d2, 2 * this.smooth)
            d1powA = Math.pow(d1, this.smooth)
            d1pow2A = Math.pow(d1, 2 * this.smooth)

            A = 2 * d1pow2A + 3 * d1powA * d2powA + d2pow2A
            B = 2 * d3pow2A + 3 * d3powA * d2powA + d2pow2A
            N = 3 * d1powA * (d1powA + d2powA)
            if (N > 0) {
                N = 1 / N
            }
            M = 3 * d3powA * (d3powA + d2powA)
            if (M > 0) {
                M = 1 / M
            }

            bp1 = {
                x: (-d2pow2A * p0.x + A * p1.x + d1pow2A * p2.x) * N,
                y: (-d2pow2A * p0.y + A * p1.y + d1pow2A * p2.y) * N,
            }

            bp2 = {
                x: (d3pow2A * p1.x + B * p2.x - d2pow2A * p3.x) * M,
                y: (d3pow2A * p1.y + B * p2.y - d2pow2A * p3.y) * M,
            }

            if (bp1.x === 0 && bp1.y === 0) {
                bp1 = p1
            }
            if (bp2.x === 0 && bp2.y === 0) {
                bp2 = p2
            }

            cache.push(new CatMullCurve(p1, bp1, bp2, p2))
        }
        return cache
    }

    getScaleCatMullPaths() {
        const scalePaths = []
        for (const path of this.catMullPaths) {
            const scalePath = new CatMullCurve(
                this.getScalePoint(path.start),
                this.getScalePoint(path.ctrl1),
                this.getScalePoint(path.ctrl2),
                this.getScalePoint(path.end),
            )
            if (!this.inVisualArea(scalePath)) {
                continue
            }
            scalePaths.push(scalePath)
        }
        return scalePaths
    }

    protected isLineInVisualArea(line: Line): boolean {
        return !(
            line.getCrossPointToLine(this.visualSize.topLine()) == null &&
            line.getCrossPointToLine(this.visualSize.bottomLine()) == null &&
            line.getCrossPointToLine(this.visualSize.leftLine()) == null &&
            line.getCrossPointToLine(this.visualSize.rightLine()) == null
        )
    }

    protected isPointInVisualArea(point: Point): boolean {
        return point.x <= this.visualSize.width && point.x >= 0 && point.y <= this.visualSize.height && point.y >= 0
    }

    private drawCatMull(context: any) {
        const scalePaths = this.getScaleCatMullPaths()
        // console.log(this.catMullPaths);
        for (const path of scalePaths) {
            if (!this.inVisualArea(path)) {
                // console.log('cat mull curve is out of visual area');
                continue
            }
            context.beginPath()
            context.moveTo(path.start.x, path.start.y)
            if (this.isDash) {
                context.setLineDash([4, 6])
            } else {
                context.setLineDash([])
            }
            context.setLineWidth(this.lineWidth)
            context.bezierCurveTo(path.ctrl1.x, path.ctrl1.y, path.ctrl2.x, path.ctrl2.y, path.end.x, path.end.y)
            if (this.lineGradient) {
                const grd = context.createLinearGradient(path.start.x, path.start.y, path.end.x, path.end.y)
                grd.addColorStop(0, path.start.color)
                grd.addColorStop(1, path.end.color)
                context.setStrokeStyle(grd)
            } else {
                context.setStrokeStyle(this.lineColor)
            }
            context.stroke()
        }
    }
}
