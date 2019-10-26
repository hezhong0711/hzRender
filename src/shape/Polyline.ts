import { Displayable, DisplayableCfg } from '../basic/Displayable'
import { CatMullCurve, Line, LinePath, Point } from '../unit/Point'
import { ScaleInfo } from '../basic/ScaleInfo'

export abstract class Polyline extends Displayable {
    points: Point[] = []
    smooth: number = 0
    lineWidth?: number
    lineColor?: string
    lineGradient?: boolean
    isDash?: boolean
    isHighlight: boolean = false
    highlightStyle?: PolylineStyle
    clickable: boolean
    linePaths: LinePath[] = []
    catMullPaths: CatMullCurve[] = []
    tapOffset: number

    constructor(cfg: PolylineCfg) {
        super(cfg)
        this.points = cfg.points
        this.smooth = cfg.smooth ? cfg.smooth : 0
        this.lineWidth = cfg.lineWidth ? cfg.lineWidth : 1
        this.lineGradient = cfg.lineGradient ? cfg.lineGradient : false
        this.lineColor = cfg.lineColor ? cfg.lineColor : 'black'
        this.isDash = cfg.isDash ? cfg.isDash : false
        this.tapOffset = cfg.tapOffset ? cfg.tapOffset : 2
        this.highlightStyle = cfg.highlightStyle ? cfg.highlightStyle : new PolylineStyle()
        this.clickable = cfg.clickable ? cfg.clickable : false
    }

    contain(x: number, y: number): boolean {
        return false
    }

    inVisualArea(linePath: LinePath): boolean {
        if (linePath instanceof CatMullCurve) {
            return !(
                !this.isPointInVisualArea(linePath.start) &&
                !this.isPointInVisualArea(linePath.end) &&
                !this.isPointInVisualArea(linePath.ctrl1) &&
                !this.isPointInVisualArea(linePath.ctrl2) &&
                !this.isLineInVisualArea(linePath.toLine())
            )
        }

        return !(
            !this.isPointInVisualArea(linePath.start) &&
            !this.isPointInVisualArea(linePath.end) &&
            !this.isLineInVisualArea(linePath.toLine())
        )
    }

    abstract draw(context: any): void

    tap() {
        if (this.clickable) {
            super.tap()
            this.isHighlight = true
        }
    }

    unTap() {
        super.unTap()
        this.isHighlight = false
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
}

export interface PolylineCfg extends DisplayableCfg {
    points: Point[]
    isDash?: boolean
    lineWidth?: number
    lineColor?: string
    lineGradient?: boolean
    smooth?: number
    tapOffset?: number
    highlightStyle?: PolylineStyle
    clickable?: boolean
}

export class PolylineStyle {
    color: string = 'black'
    lineWidth: number = 3
    lineGradient: boolean = false
}
