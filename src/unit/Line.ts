import { Point } from './Point';

export class Line {
    point: Point;
    k: number | null;
    b: number = 0;
    isKNull: boolean;

    constructor(k: number | null, b: number, point: Point) {
        this.k = k;
        this.b = b;
        this.isKNull = this.k == null;
        this.point = point;
    }

    // 判断点和线的距离是否小于一个偏移量
    isPointInLine(point: Point, offset: number = 0.1) {
        const distance = this.calcDistanceFromPointToLine(point);
        return distance <= offset;
    }

    // 判断是否和线平行
    isParallelToLine(line: Line) {
        return (this.isKNull && line.isKNull) || this.k === line.k;
    }

    // 计算两条线的交点
    getCrossPointToLine(line: Line, inLimit: boolean = true) {
        // 平行没有交点
        if (this.isParallelToLine(line)) {
            return null;
        }
        let point: Point | null = null;

        if (this.k == null && line.k != null) {
            const x = this.point.x;
            const y = line.k * x + line.b;
            point = new Point(x, y);
        } else if (this.k != null && line.k == null) {
            const x = line.point.x;
            const y = this.k * x + this.b;
            point = new Point(x, y);
        } else if (this.k != null && line.k != null) {
            const x = (this.b - line.b) / (line.k - this.k);
            const y = line.k * x + line.b;
            point = new Point(x, y);
        }

        if (point == null) {
            return null;
        }

        if (inLimit) {
            if (this.isPointInLine(point) && line.isPointInLine(point)) {
                return point;
            } else {
                return null;
            }
        }
        return point;
    }

    // 计算点到线的距离
    calcDistanceFromPointToLine(point: Point) {
        // 计算垂足
        const footPoint = this.calcFootPoint(point);
        return point.calcDistance(footPoint);
    }

    // 计算点到条线的垂足
    calcFootPoint(point: Point) {
        if (this.k == null) {
            return new Point(this.point.x, point.y);
        }

        if (this.k === 0) {
            return new Point(point.x, this.b);
        }

        const kv = -1 / this.k;
        const bv = point.y - kv * point.x;
        const x = (this.b - bv) / (kv - this.k);
        const y = this.k * x + this.b;

        return new Point(x, y);
    }
}

export class LineInfo {
    k: number | null;
    b: number = 0;

    constructor(k: number | null, b: number) {
        this.k = k;
        this.b = b;
    }
}
