import { LinePath } from './LinePath';
import { Point } from './Point';

export class Curve extends LinePath {
    ctrl: Point;

    constructor(start: Point, ctrl: Point, end: Point) {
        super(start, end);
        this.ctrl = Point.copy(ctrl);
    }

    move(x: number, y: number) {
        this.start.move(x, y);
        this.end.move(x, y);
        this.ctrl.move(x, y);
    }
}
