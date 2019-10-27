import { scaleInfo } from '../common/common';
import { Point } from '../../unit/Point';

describe('test Point', () => {
    const point = new Point(10, 20);

    test('create point', () => {
        console.log(scaleInfo);
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
});
