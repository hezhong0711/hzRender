import { Point } from '../unit/Point';
import { Line, LineInfo } from '../unit/Line';
import { LimitLine } from '../unit/LimitLine';

export class LineHelper {
    static getLineLimit(start: Point, end: Point) {
        const lineInfo = LineHelper.getLineInfo(start, end);
        return new LimitLine(lineInfo.k, lineInfo.b, start, end);
    }

    static getLine(p1: Point, p2: Point) {
        const lineInfo = LineHelper.getLineInfo(p1, p2);
        return new Line(lineInfo.k, lineInfo.b, p1);
    }

    static getLineByK(p: Point, k: number) {
        let b: number = 0;
        if (k != null) {
            b = p.y - k * p.x;
        }
        return new Line(k, b, p);
    }

    // 计算斜率
    static calcK(p1: Point, p2: Point) {
        if (p2.x === p1.x) {
            return null;
        }
        return (p2.y - p1.y) / (p2.x - p1.x);
    }

    static getLineInfo(p1: Point, p2: Point) {
        const k = LineHelper.calcK(p1, p2);
        let b: number = 0;
        if (k != null) {
            b = p1.y - k * p1.x;
        }
        return new LineInfo(k, b);
    }
}
