import { RightAnglePolyline } from '../shape/polyline/RightAnglePolyline';
import { Point } from '../unit/Point';
import { ScaleType, VisualSize } from '../basic/Displayable';
import { ScaleInfo } from '../basic/ScaleInfo';
import { CatMullCurvePolyline } from '../shape/polyline/CatMullCurvePolyline';
import { LinePolyline } from '../shape/polyline/LinePolyline';

const scaleInfo: ScaleInfo = new ScaleInfo();
scaleInfo.scale = 1.1;
scaleInfo.lastOffset = new Point(110, 10);
scaleInfo.panOffset = new Point(1, 1);
const visualSize: VisualSize = new VisualSize();
visualSize.width = 400;
visualSize.height = 600;

test('RightAnglePolyline', () => {
    const startK: number = -1;
    const points: Point[] = [new Point(10, 10), new Point(100, 100)];
    const polyline = new RightAnglePolyline({
        startK,
        points,
        lineWidth: 2,
        smooth: 1,
        // lineGradient: true,
        isDash: true,
        lineColor: 'blue',
        scaleType: ScaleType.POSITION,
        clickable: true,
    });
    polyline.scaleInfo = scaleInfo;
    polyline.visualSize = visualSize;

    polyline.getRightAngleLinePaths();
    console.log(polyline.linePaths);
    console.log(polyline.getScalePaths());
    expect(polyline.contain(121, 21)).toBeTruthy();
});

test('LinePolyline', () => {
    const points: Point[] = [new Point(10, 10), new Point(100, 100)];
    const polyline = new LinePolyline({
        points,
        lineWidth: 2,
        smooth: 1,
        // lineGradient: true,
        isDash: true,
        lineColor: 'blue',
        scaleType: ScaleType.POSITION,
        clickable: true,
    });
    polyline.scaleInfo = scaleInfo;
    polyline.visualSize = visualSize;

    polyline.linePaths = polyline.getLinePaths();
    console.log(polyline.linePaths);
    console.log(polyline.getScaleLinePaths());
    expect(polyline.contain(121, 21)).toBeTruthy();
});

test('LinePolyline pan', () => {
    const points: Point[] = [new Point(10, 10), new Point(100, 100), new Point(104, 104)];
    const polyline = new LinePolyline({
        points,
        lineWidth: 2,
        smooth: 1,
        // lineGradient: true,
        isDash: true,
        lineColor: 'blue',
        scaleType: ScaleType.POSITION,
        clickable: true,
    });
    polyline.scaleInfo = scaleInfo;
    polyline.visualSize = visualSize;

    polyline.linePaths = polyline.getLinePaths();
    console.log(polyline.linePaths);
    const x1 = polyline.linePaths[1].start.x;
    polyline.pan(polyline.scaleInfo);
    const x2 = polyline.linePaths[1].start.x;
    console.log(polyline.linePaths);
    expect(x2 - x1).toBe(polyline.scaleInfo.panOffset.x);
});

test('CatMullCurvePolyline', () => {
    const points: Point[] = [new Point(10, 10), new Point(100, 100)];
    const polyline = new CatMullCurvePolyline({
        points,
        lineWidth: 2,
        smooth: 0,
        // lineGradient: true,
        isDash: true,
        lineColor: 'blue',
        scaleType: ScaleType.POSITION,
        clickable: true,
    });
    polyline.scaleInfo = scaleInfo;
    polyline.visualSize = visualSize;

    polyline.catMullPaths = polyline.getCatMullPaths();
    console.log(polyline.catMullPaths);
    console.log(polyline.getScaleCatMullPaths());
    polyline.points = [
        Point.scale(new Point(10, 10), polyline.scaleInfo),
        Point.scale(new Point(100, 100), polyline.scaleInfo),
    ];
    console.log(polyline.getCatMullPaths());
    expect(polyline.contain(20, 20)).toBeFalsy();
});
