import { Point } from '../unit/Point'

export class SelfAdaptation {
    static getMin(a: number, b: number) {
        return a > b ? b : a
    }

    static getMax(a: number, b: number) {
        return a > b ? a : b
    }

    paddingTop: number
    paddingBottom: number
    paddingLeft: number
    paddingRight: number
    width: number
    height: number
    scaleX: number = 1
    scaleY: number = 1
    offsetX: number = 0
    offsetY: number = 0

    constructor(cfg: SelfAdaptationCfg) {
        this.width = cfg.width
        this.height = cfg.height
        this.paddingTop = cfg.paddingTop ? cfg.paddingTop : 0
        this.paddingBottom = cfg.paddingBottom ? cfg.paddingBottom : 0
        this.paddingLeft = cfg.paddingLeft ? cfg.paddingLeft : 0
        this.paddingRight = cfg.paddingRight ? cfg.paddingRight : 0
    }

    adapt(points: Point[]) {
        let minX = 0
        let maxX = 0
        let minY = 0
        let maxY = 0
        for (const point of points) {
            minX = SelfAdaptation.getMin(minX, point.x)
            maxX = SelfAdaptation.getMax(maxX, point.x)
            minY = SelfAdaptation.getMin(minY, point.y)
            maxY = SelfAdaptation.getMax(maxY, point.y)
        }
        const deltaX = maxX - minX
        const deltaY = maxY - minY

        this.scaleX = deltaX === 0 ? 1 : (this.width - this.paddingLeft - this.paddingRight) / (maxX - minX)
        this.scaleY = deltaY === 0 ? 1 : (this.height - this.paddingTop - this.paddingBottom) / (maxY - minY)
        this.offsetX = this.paddingLeft - minX * this.scaleX
        this.offsetY = this.paddingTop - minY * this.scaleY
    }

    adaptPoint(point: Point) {
        return new Point(point.x * this.scaleX + this.offsetX, point.y * this.scaleY + this.offsetY, point.color)
    }
}

export interface SelfAdaptationCfg {
    width: number
    height: number
    paddingTop?: number
    paddingBottom?: number
    paddingLeft?: number
    paddingRight?: number
}
