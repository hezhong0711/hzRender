import { Point } from './Point';
import { LinePath } from './LinePath';

export class CatMullCurve extends LinePath {
    ctrl1: Point;
    ctrl2: Point;

    constructor(start: Point, ctrl1: Point, ctrl2: Point, end: Point) {
        super(start, end);
        this.ctrl1 = Point.copy(ctrl1);
        this.ctrl2 = Point.copy(ctrl2);
    }

    move(x: number, y: number) {
        this.start.move(x, y);
        this.end.move(x, y);
        this.ctrl1.move(x, y);
        this.ctrl2.move(x, y);
    }
}
