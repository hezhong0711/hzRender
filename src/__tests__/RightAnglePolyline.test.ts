import { RightAnglePolyline } from '../shape/polyline/RightAnglePolyline'
import { Point } from '../unit/Point'
import { ScaleType, VisualSize } from '../basic/Displayable'
import { ScaleInfo } from '../basic/ScaleInfo'
import { Polyline } from '../shape/Polyline'

test('RightAnglePolyline', () => {
    const scaleInfo: ScaleInfo = new ScaleInfo()
    scaleInfo.scale = 1.1
    scaleInfo.lastOffset = new Point(110, 10)
    const visualSize: VisualSize = new VisualSize()
    visualSize.width = 400
    visualSize.height = 600

    const startK: number = -1
    const points: Point[] = [new Point(10, 10), new Point(100, 100)]
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
    })
    polyline.scaleInfo = scaleInfo
    polyline.visualSize = visualSize

    polyline.getRightAngleLinePaths()
    console.log(polyline.linePaths)
    console.log(polyline.getScalePaths())
    expect(polyline.contain(121, 21)).toBeTruthy()
})

test('LinePolyline', () => {
    const scaleInfo: ScaleInfo = new ScaleInfo()
    scaleInfo.scale = 1.1
    scaleInfo.lastOffset = new Point(110, 10)
    const visualSize: VisualSize = new VisualSize()
    visualSize.width = 400
    visualSize.height = 600

    const points: Point[] = [new Point(10, 10), new Point(100, 100)]
    const polyline = new Polyline({
        points,
        lineWidth: 2,
        smooth: 1,
        // lineGradient: true,
        isDash: true,
        lineColor: 'blue',
        scaleType: ScaleType.POSITION,
        clickable: true,
    })
    polyline.scaleInfo = scaleInfo
    polyline.visualSize = visualSize

    polyline.linePaths = polyline.getLinePaths()
    console.log(polyline.linePaths)
    console.log(polyline.getScaleLinePaths())
    expect(polyline.contain(121, 21)).toBeTruthy()
})
