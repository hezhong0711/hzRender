import { Line } from './Line';
import { Point } from './Point';

export class LimitLine extends Line {
    start?: Point;
    end?: Point;

    constructor(k: number | null, b: number, start: Point, end: Point) {
        super(k, b, start);
        this.start = start;
        this.end = end;
    }

    // 计算点到线的距离
    calcDistanceFromPointToLine(point: Point) {
        // 计算垂足
        const footPoint = this.calcFootPoint(point);
        // 如果 垂足在线段上
        let distance = 10000;
        if (this.isPointInLineLimit(footPoint)) {
            // 计算两点的距离
            distance = point.calcDistance(footPoint);
        } else {
            // 计算起点或者终点的距离
            const d1 = point.calcDistance(this.start as Point);
            const d2 = point.calcDistance(this.end as Point);
            distance = d1 > d2 ? d2 : d1;
        }

        return distance;
    }

    // 判断点是否在起点和终点之间(不一定在线上）
    private isPointInLineLimit(point: Point) {
        let result = true;
        if (this.start != null && this.end != null) {
            if (this.isKNull) {
                result =
                    (point.y <= this.end.y && point.y >= this.start.y) ||
                    (point.y <= this.start.y && point.y >= this.end.y);
            } else {
                result =
                    (point.x <= this.end.x && point.x >= this.start.x && this.start.x < this.end.x) ||
                    (point.x >= this.end.x && point.x <= this.start.x && this.start.x > this.end.x);
            }
        }
        return result;
    }
}
