import { Point } from '../../unit/Point';
import { LineHelper } from '../../factory/LineHelper';

describe('test Line when k is null', () => {
    const kIsNull = [new Point(0, 0), new Point(0, 20)];

    test('should create Line', () => {
        const lineKIsNull = LineHelper.getLine(kIsNull[0], kIsNull[1]);
        expect(lineKIsNull.k).toBeNull();
        let isPointInLine = lineKIsNull.isPointInLine(new Point(0, 100), 0);
        expect(isPointInLine).toBeTruthy();
        isPointInLine = lineKIsNull.isPointInLine(new Point(0, -100), 0);
        expect(isPointInLine).toBeTruthy();
        isPointInLine = lineKIsNull.isPointInLine(new Point(1, -100), 0);
        expect(isPointInLine).toBeFalsy();
    });

    test('should create Line limit', () => {
        const lineKIsNull = LineHelper.getLineLimit(kIsNull[0], kIsNull[1]);
        expect(lineKIsNull.k).toBeNull();
        let isPointInLine = lineKIsNull.isPointInLine(new Point(0, 15));
        expect(isPointInLine).toBeTruthy();
        isPointInLine = lineKIsNull.isPointInLine(new Point(0, -100));
        expect(isPointInLine).toBeFalsy();
        isPointInLine = lineKIsNull.isPointInLine(new Point(0, 21));
        expect(isPointInLine).toBeFalsy();
    });
});

describe('test Line when k is 0', () => {
    const points = [new Point(10, 10), new Point(20, 10)];

    test('should create Line', () => {
        const line = LineHelper.getLine(points[0], points[1]);
        expect(line.k).toBe(0);
        let isPointInLine = line.isPointInLine(new Point(10, 10), 0);
        expect(isPointInLine).toBeTruthy();
        isPointInLine = line.isPointInLine(new Point(20, 10), 0);
        expect(isPointInLine).toBeTruthy();
        isPointInLine = line.isPointInLine(new Point(15, 10), 0);
        expect(isPointInLine).toBeTruthy();
        isPointInLine = line.isPointInLine(new Point(-10, 10), 0);
        expect(isPointInLine).toBeTruthy();
        isPointInLine = line.isPointInLine(new Point(15, 0), 0);
        expect(isPointInLine).toBeFalsy();
    });

    test('should create Line limit', () => {
        const line = LineHelper.getLineLimit(points[0], points[1]);
        expect(line.k).toBe(0);
        let isPointInLine = line.isPointInLine(new Point(10, 10), 0);
        expect(isPointInLine).toBeTruthy();
        isPointInLine = line.isPointInLine(new Point(20, 10), 0);
        expect(isPointInLine).toBeTruthy();
        isPointInLine = line.isPointInLine(new Point(15, 10), 0);
        expect(isPointInLine).toBeTruthy();
        isPointInLine = line.isPointInLine(new Point(-10, 10), 0);
        expect(isPointInLine).toBeFalsy();
        isPointInLine = line.isPointInLine(new Point(21, 10), 0);
        expect(isPointInLine).toBeFalsy();
        isPointInLine = line.isPointInLine(new Point(15, 0), 0);
        expect(isPointInLine).toBeFalsy();
    });
});

describe('test Line', () => {
    const points = [new Point(121, 21), new Point(220, 120)];

    test('should calculate distance ', () => {
        const point = new Point(121, 21);
        const line = LineHelper.getLine(points[0], points[1]);
        console.log(line);
        console.log(line.calcFootPoint(point));
        const distance = line.calcDistanceFromPointToLine(point);
        console.log(distance);
    });
});
