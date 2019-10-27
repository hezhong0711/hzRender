import { scaleInfo } from '../common/common';
import { Point } from '../../unit/Point';

describe('test Point', () => {
    const point = new Point(10, 20);

    test('create point', () => {
        expect(point.x).toBe(10);
        expect(point.y).toBe(20);
        expect(point.color).toBe('black');
    });

    test('scale point', () => {
        const scalePoint = Point.scale(point, scaleInfo);
        // 10 * 1.1 + 110
        expect(scalePoint.x).toBe(121);
    });

    test('move point', () => {
        point.move(20, 30);
        expect(point.x).toBe(30);
        expect(point.y).toBe(50);
    });

    test('copy point', () => {
        const copyPoint = Point.copy(point);
        expect(point.x).toBe(copyPoint.x);
        expect(point.y).toBe(copyPoint.y);
        expect(point.color).toBe(copyPoint.color);
    });
    test('calculate distance between two points', () => {
        const p = new Point(0, 0);
        const p2 = new Point(3, 4);
        const distance = p.calcDistance(p2);
        expect(distance).toBe(5);
    });
    test('calculate distance when two points are the same', () => {
        const p = new Point(0, 0);
        const p2 = new Point(0, 0);
        const distance = p.calcDistance(p2);
        expect(distance).toBe(0);
    });
});
