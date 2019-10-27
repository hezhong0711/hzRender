import { Coordinate } from '../basic/Coordinate';
import { ScaleInfo } from '../basic/ScaleInfo';

export class Point extends Coordinate {
    static scale(point: Point, scaleInfo: ScaleInfo) {
        const x = scaleInfo.scale * point.x + scaleInfo.lastOffset.x;
        const y = scaleInfo.scale * point.y + scaleInfo.lastOffset.y;
        return new Point(x, y, point.color);
    }

    static copy(point: Point) {
        return new Point(point.x, point.y, point.color);
    }

    color: string;

    constructor(x: number, y: number, color?: string) {
        super(x, y);
        this.color = color ? color : 'black';
    }

    move(distanceX: number, distanceY: number) {
        this.x = this.x + distanceX;
        this.y = this.y + distanceY;
    }

    calcDistance(p: Coordinate) {
        return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
    }
}
