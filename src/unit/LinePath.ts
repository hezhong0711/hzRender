import { Point } from './Point';
import { Line } from './Line';

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
        const line = Line.getLine(this.start, this.end);
        line.setLineStart(this.start);
        line.setLineEnd(this.end);
        return line;
    }
}
