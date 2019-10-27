import { Coordinate } from './Coordinate';

export class ScaleInfo {
    deltaScale: number = 1;
    scale: number = 1;
    lastOffset: Coordinate = new Coordinate(0, 0);
    point: Coordinate = new Coordinate(0, 0);
    panOffset: Coordinate = new Coordinate(0, 0);
}
