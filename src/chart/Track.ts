import { Chart, ChartCfg, ChartModal } from '../basic/Chart';
import { Point } from '../unit/Point';
import { Circle } from '../shape/Circle';
import { ScaleType } from '../basic/Displayable';
import { RightAnglePolyline } from '../shape/polyline/RightAnglePolyline';
import { ReadType } from './ReadType';
import { LineHelper } from '../factory/LineHelper';

const colorList = [
    'rgba(151,0,237,1)',
    'rgba(15,226,251,1)',
    'rgba(255,95,129,1)',
    'rgba(255,214,152,1)',
    'rgba(255,95,129,1)',
    'rgba(254,143,142,1)',
    'rgba(244,91,245,1)',
    'rgba(253,161,134,1)',
    'rgba(254,206,98,1)',
    'rgba(255,144,147,1)',
    'rgba(138,184,255,1)',
];
const RADIOUS = 5;
const MAX_DATA_SIZE = 30;

export class Track extends Chart {
    trackModals: TrackModal[] = [];
    solidLinePoints: Point[][] = [];
    dashLinePoints: Point[][] = [];

    constructor(cfg: TrackCfg) {
        super(cfg);
        this.selfAdaptation.paddingRight = cfg.paddingRight ? cfg.paddingRight : RADIOUS;
        this.selfAdaptation.paddingTop = cfg.paddingTop ? cfg.paddingTop : RADIOUS;
        this.selfAdaptation.paddingLeft = cfg.paddingLeft ? cfg.paddingLeft : RADIOUS;
        this.selfAdaptation.paddingBottom = cfg.paddingBottom ? cfg.paddingBottom : RADIOUS;
        this.process(cfg.data);

        console.log(this.trackModals);
        console.log(this.solidLinePoints);
        console.log(this.dashLinePoints);
    }

    process(data: any[]) {
        // 转换数据
        for (const item of data.slice(0, MAX_DATA_SIZE)) {
            this.trackModals.push(TrackModal.mapper(item as TrackDataModal));
        }

        // 切分数据
        this.splitTrackModal();

        // 自适应计算
        const points = this.trackModals.map(v => {
            return v.point;
        });
        this.selfAdaptation.adapt(points);

        const startK = LineHelper.calcK(this.solidLinePoints[0][0], this.solidLinePoints[0][1]);
        this.drawSolidLine(startK);
        this.drawDashLine(startK);
        this.drawAllPoints();
    }

    render() {
        this.hz.render();
    }

    private drawAllPoints() {
        for (const modal of this.trackModals) {
            this.hz.add(
                new Circle({
                    cx: modal.point.x * this.selfAdaptation.scaleX + this.selfAdaptation.offsetX,
                    cy: modal.point.y * this.selfAdaptation.scaleY + this.selfAdaptation.offsetY,
                    r: RADIOUS,
                    color: modal.point.color,
                    scaleType: ScaleType.POSITION,
                    onTap: () => {
                        console.log('click circle');
                    },
                }),
            );
        }
    }

    private drawSolidLine(startK: number) {
        this.solidLinePoints.forEach(points => {
            const adaptPoints = points.map(p => {
                return this.selfAdaptation.adaptPoint(p);
            });
            if (adaptPoints.length > 1) {
                const rap = new RightAnglePolyline({
                    startK,
                    points: adaptPoints,
                    lineWidth: 2,
                    smooth: 1,
                    // lineGradient: true,
                    // isDash: true,
                    lineColor: 'blue',
                    scaleType: ScaleType.POSITION,
                    clickable: true,
                    onTap: () => {
                        console.log('go to');
                    },
                });
                this.hz.add(rap);
            }
        });
    }

    private drawDashLine(startK: number) {
        this.dashLinePoints.forEach(points => {
            const adaptPoints = points.map(p => {
                return this.selfAdaptation.adaptPoint(p);
            });
            if (adaptPoints.length > 1) {
                this.hz.add(
                    new RightAnglePolyline({
                        startK,
                        points: adaptPoints,
                        lineWidth: 2,
                        smooth: 1,
                        // lineGradient: true,
                        isDash: true,
                        lineColor: 'blue',
                        scaleType: ScaleType.POSITION,
                        onTap: () => console.log('click polyline'),
                    }),
                );
            }
        });
    }

    private splitTrackModal() {
        const idx: [number, number] = [0, 0];
        let lastReadType: ReadType = ReadType.s;
        for (const modal of this.trackModals) {
            // readType 与上一次 readType相同，加入到上一次的容器中
            if (lastReadType === modal.readType || (lastReadType === ReadType.s && modal.readType === ReadType.s1)) {
                this.addLinePathPoint(lastReadType, modal.point, idx);
            }
            // 如果不相同，则要在上一个容器中添加，然后在另一个容器中新添加意向
            else {
                this.addLinePathPoint(lastReadType, modal.point, idx);
                switch (modal.readType) {
                    case ReadType.s:
                    case ReadType.s1:
                        idx[0]++;
                        break;
                    case ReadType.s2:
                        idx[1]++;
                        break;
                }
                this.addLinePathPoint(modal.readType, modal.point, idx);
            }
            lastReadType = modal.readType;
        }
    }

    private addLinePathPoint(readType: ReadType, point: Point, idx: [number, number]) {
        switch (readType) {
            case ReadType.s:
            case ReadType.s1:
                {
                    let arr = this.solidLinePoints[idx[0]];
                    if (arr == null) {
                        arr = [point];
                    } else {
                        arr.push(point);
                    }
                    this.solidLinePoints[idx[0]] = arr;
                }
                break;
            case ReadType.s2:
                {
                    let arr = this.dashLinePoints[idx[1]];
                    if (arr == null) {
                        arr = [point];
                    } else {
                        arr.push(point);
                    }
                    this.dashLinePoints[idx[1]] = arr;
                }
                break;
        }
    }
}

interface TrackCfg extends ChartCfg {
    data: any;
}

export class TrackModal extends ChartModal {
    static mapper(data: TrackDataModal) {
        const modal = new TrackModal();
        modal.point = new Point(data.list_x, data.list_y, colorList[data.list_type]);
        modal.title = data.list_title;
        modal.content = data.list_content;
        modal.readType = data.read_type as ReadType;
        modal.id = data.list_id;
        return modal;
    }

    point: Point;
    title: string;
    content: string;
    id: string;
    readType: ReadType;
}

export class TrackDataModal {
    list_id: string;
    read_type: string;
    list_title: string;
    list_content: string;
    list_x: number;
    list_y: number;
    list_type: number;
}
