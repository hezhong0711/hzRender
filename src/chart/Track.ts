import { Chart, ChartCfg, ChartModal } from '../basic/Chart';
import { Point } from '../unit/Point';
import { Circle } from '../shape/Circle';
import { ScaleType } from '../basic/Displayable';
import { RightAnglePolyline } from '../shape/polyline/RightAnglePolyline';
import { ReadType } from './ReadType';
import { LineHelper } from '../factory/LineHelper';
import { PolylineStyle } from '../shape/Polyline';

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
const MAX_DATA_SIZE = 100;

export class Track extends Chart {
    trackModals: TrackModal[] = [];
    solidLinePoints: Point[][] = [];
    dashLinePoints: Point[][] = [];

    solidLineStyle: PolylineStyle;
    dashLineStyle: PolylineStyle;
    circleScaleType?: ScaleType;
    solidLineScaleType?: ScaleType;
    dashLineScaleType?: ScaleType;

    onTap: (e: any) => void;

    constructor(cfg: TrackCfg) {
        super(cfg);
        this.selfAdaptation.paddingRight = cfg.paddingRight ? cfg.paddingRight : RADIOUS;
        this.selfAdaptation.paddingTop = cfg.paddingTop ? cfg.paddingTop : RADIOUS;
        this.selfAdaptation.paddingLeft = cfg.paddingLeft ? cfg.paddingLeft : RADIOUS;
        this.selfAdaptation.paddingBottom = cfg.paddingBottom ? cfg.paddingBottom : RADIOUS;
        this.solidLineStyle = cfg.solidLineStyle ? cfg.solidLineStyle : new PolylineStyle();
        this.dashLineStyle = cfg.dashLineStyle ? cfg.dashLineStyle : new PolylineStyle();
        this.circleScaleType = cfg.circleScaleType ? cfg.circleScaleType : ScaleType.SHAPE;
        this.dashLineScaleType = cfg.dashLineScaleType ? cfg.dashLineScaleType : ScaleType.POSITION;
        this.solidLineScaleType = cfg.solidLineScaleType ? cfg.solidLineScaleType : ScaleType.POSITION;
        this.onTap = cfg.onTap;
        this.process(cfg.data);
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
        this.drawDashLine(startK);
        this.drawSolidLine(startK);
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
                    scaleType: this.circleScaleType,
                    onTap: () => {
                        if (this.onTap) {
                            this.onTap(modal);
                        }
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
                    lineWidth: this.solidLineStyle.lineWidth,
                    smooth: 1,
                    lineColor: this.solidLineStyle.color,
                    scaleType: this.solidLineScaleType,
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
                        lineWidth: this.dashLineStyle.lineWidth,
                        smooth: 1,
                        isDash: true,
                        lineColor: this.dashLineStyle.color,
                        scaleType: this.dashLineScaleType,
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
    onTap?: (e: any) => void;
    solidLineStyle?: PolylineStyle;
    dashLineStyle?: PolylineStyle;
    circleScaleType?: ScaleType;
    solidLineScaleType?: ScaleType;
    dashLineScaleType?: ScaleType;
}

export class TrackModal extends ChartModal {
    static mapper(data: TrackDataModal) {
        const modal = new TrackModal();
        modal.point = new Point(data.list_info.list_x, data.list_info.list_y, colorList[data.list_info.list_type]);
        modal.title = data.list_info.list_title.title_detail;
        // modal.content = data.list_content;
        modal.readType = data.read_type as ReadType;
        modal.id = data.list_info.list_id;
        return modal;
    }

    point: Point;
    title: string;
    content: string;
    id: string;
    readType: ReadType;
}

export class TrackDataModal {
    delete_status: number;
    list_info: TrackListInfo;
    read_type: string;
    user_info: any;

    // list_id: string;
    // list_title: string;
    // list_content: string;
    // list_x: number;
    // list_y: number;
    // list_type: number;
}

export class TrackListInfo {
    delete_status: number;
    list_content: [];
    list_first_link_num: number;
    list_id: string;
    list_title: TrackListTitle;
    list_type: number;
    list_x: number;
    list_y: number;
    user_id: string;
}

export class TrackListTitle {
    link: [];
    title_detail: string;
}
