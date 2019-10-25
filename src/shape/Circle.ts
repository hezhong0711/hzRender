import { Displayable, DisplayableCfg } from '../basic/Displayable'
import { Point } from '../unit/Point'
import { ScaleInfo } from '../basic/ScaleInfo'

export class Circle extends Displayable {
    c: Point
    r: number
    color: string

    constructor(cfg: CircleCfg) {
        super(cfg)
        this.c = new Point(cfg.cx, cfg.cy)
        this.r = cfg.r == null ? 10 : cfg.r
        this.color = cfg.color == null ? 'blue' : cfg.color
    }

    draw(context: CanvasContext): void {
        if (!this.inVisualArea()) {
            return
        }

        const scaleC = this.getScalePoint(this.c)
        const scaleR = this.getScaleLength(this.r)
        context.beginPath()
        context.arc(scaleC.x, scaleC.y, scaleR, 0, 2 * Math.PI)
        context.setFillStyle(this.color)
        context.fill()
    }

    contain(x: number, y: number): boolean {
        const p1 = new Point(x, y)
        const p2 = this.getScalePoint(this.c)
        const distance = p1.calcDistance(p2)
        return distance <= this.getScaleLength(this.r)
    }

    inVisualArea(): boolean {
        const scaleC = this.getScalePoint(this.c)
        const scaleR = this.getScaleLength(this.r)
        return (
            scaleC.x <= this.visualSize.width + scaleR &&
            scaleC.x >= 0 - scaleR &&
            scaleC.y <= this.visualSize.height + scaleR &&
            scaleC.y >= 0 - scaleR
        )
    }

    pan(scaleInfo: ScaleInfo): void {
        this.c.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y)
    }
}

interface CircleCfg extends DisplayableCfg {
    cx: number
    cy: number
    r?: number
    color?: string
}
