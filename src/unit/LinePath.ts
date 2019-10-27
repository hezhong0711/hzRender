import { Point } from './Point';
import { LineHelper } from '../factory/LineHelper';

export class LinePath {
    start: Point;
    end: Point;

    constructor(start: Point, end: Point) {
        this.start = Point.copy(start);
        this.end = Point.copy(end);
    }

    move(x: number, y: number) {
        this.start.move(x, y);
        this.end.move(x, y);
    }

    toLine() {
        return LineHelper.getLineLimit(this.start, this.end);
    }
}
