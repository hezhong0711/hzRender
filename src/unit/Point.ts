import { Coordinate } from '../basic/Coordinate'
import { ScaleInfo } from '../basic/ScaleInfo'

export class Point extends Coordinate {
    static scale(point: Point, scaleInfo: ScaleInfo) {
        const x = scaleInfo.scale * point.x + scaleInfo.lastOffset.x
        const y = scaleInfo.scale * point.y + scaleInfo.lastOffset.y
        return new Point(x, y)
    }
    color: string

    constructor(x: number, y: number, color?: string) {
        super(x, y)
        this.color = color ? color : 'black'
    }

    move(distanceX: number, distanceY: number) {
        this.x = this.x + distanceX
        this.y = this.y + distanceY
    }

    calcDistance(p: Coordinate) {
        return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2))
    }
}

export class LinePath {
    start: Point
    end: Point

    constructor(start: Point, end: Point) {
        this.start = start
        this.end = end
    }

    toLine() {
        const line = Line.getLine(this.start, this.end)
        line.setLineStart(this.start)
        line.setLineEnd(this.end)
        return line
    }
}

export class CatMullCurve extends LinePath {
    ctrl1: Point
    ctrl2: Point

    constructor(start: Point, ctrl1: Point, ctrl2: Point, end: Point) {
        super(start, end)
        this.ctrl1 = ctrl1
        this.ctrl2 = ctrl2
    }
}

export class Line {
    static getLineLimit(start: Point, end: Point) {
        const line = this.getLine(start, end)
        line.setLineStart(start)
        line.setLineEnd(end)
        return line
    }

    static getLine(p1: Point, p2: Point) {
        const k = Line.calcK(p1, p2)
        let b: number = 0
        if (k != null) {
            b = p1.y - k * p1.x
        }
        return new Line(k, b, p1)
    }

    static getLineByStartAndEnd(pStart: Point, pEnd: Point) {
        const line = this.getLine(pStart, pEnd)
        line.setLineStart(pStart)
        line.setLineEnd(pEnd)
        return line
    }

    static getLineByK(p: Point, k: number) {
        let b: number = 0
        if (k != null) {
            b = p.y - k * p.x
        }
        return new Line(k, b, p)
    }

    // 计算斜率
    static calcK(p1: Point, p2: Point) {
        if (p2.x === p1.x) {
            return null
        }
        return (p2.y - p1.y) / (p2.x - p1.x)
    }
    start?: Point
    end?: Point
    point: Point
    k: number | null
    b: number = 0
    isKNull: boolean

    constructor(k: number | null, b: number, point: Point) {
        this.k = k
        this.b = b
        this.isKNull = this.k == null
        this.point = point
        this.start = undefined
        this.end = undefined
    }

    setLineStart(pStart: Point) {
        this.start = pStart
    }

    setLineEnd(pEnd: Point) {
        this.end = pEnd
    }

    // 判断点和线的距离是否小于一个偏移量
    isPointInLine(point: Point, offset: number = 0.1) {
        const distance = this.calcDistanceFromPointToLine(point)
        return distance <= offset
    }

    // 判断点是否在起点和终点之间
    isPointInLineLimit(point: Point) {
        let result = true
        if (this.start != null && this.end != null) {
            if (this.isKNull) {
                result =
                    (point.y <= this.end.y && point.y >= this.start.y) ||
                    (point.y <= this.start.y && point.y >= this.end.y)
            } else {
                result =
                    (point.x <= this.end.x && point.x >= this.start.x && this.start.x < this.end.x) ||
                    (point.x >= this.end.x && point.x <= this.start.x && this.start.x > this.end.x)
            }
        }
        return result
    }

    // 判断是否和线平行
    isParallelToLine(line: Line) {
        return (this.isKNull && line.isKNull) || this.k === line.k
    }

    // 计算两条线的交点
    getCrossPointToLine(line: Line, inLimit: boolean = true) {
        // 平行没有交点
        if (this.isParallelToLine(line)) {
            return null
        }
        let point: Point | null = null

        if (this.k == null && line.k != null) {
            const x = this.point.x
            const y = line.k * x + line.b
            point = new Point(x, y)
        } else if (this.k != null && line.k == null) {
            const x = line.point.x
            const y = this.k * x + this.b
            point = new Point(x, y)
        } else if (this.k != null && line.k != null) {
            const x = (this.b - line.b) / (line.k - this.k)
            const y = line.k * x + line.b
            point = new Point(x, y)
        }

        if (point == null) {
            return null
        }

        if (inLimit) {
            if (this.isPointInLine(point) && line.isPointInLine(point)) {
                return point
            } else {
                return null
            }
        }
        return point
    }

    // 计算点到线的距离
    calcDistanceFromPointToLine(point: Point) {
        // 计算垂足
        const footPoint = this.calcFootPoint(point)
        // 如果 垂足在线段上
        let distance = 10000
        if (this.isPointInLineLimit(footPoint)) {
            // 计算两点的距离
            distance = point.calcDistance(footPoint)
        } else {
            // 计算起点或者终点的距离
            const d1 = point.calcDistance(this.start as Point)
            const d2 = point.calcDistance(this.end as Point)
            distance = d1 > d2 ? d2 : d1
        }

        return distance
    }

    // 计算点到条线的垂足
    calcFootPoint(point: Point) {
        if (this.k == null) {
            return new Point(this.point.x, point.y)
        }

        if (this.k === 0) {
            return new Point(point.x, this.b)
        }

        const kv = -1 / this.k
        const bv = point.y - kv * point.x
        const x = (this.b - bv) / (kv - this.k)
        const y = this.k * x + this.b

        return new Point(x, y)
    }
}
