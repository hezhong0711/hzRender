import { Chart, ChartCfg, ChartModal } from '../basic/Chart';
import { Point } from '../unit/Point';
import { Circle } from '../shape/Circle';
import { Text } from '../shape/Text';
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
    solidLinePoints: TrackModal[][] = [];
    dashLinePoints: TrackModal[][] = [];

    solidLineStyle: PolylineStyle;
    dashLineStyle: PolylineStyle;
    solidLineHighlightStyle: PolylineStyle;
    circleScaleType?: ScaleType;
    solidLineScaleType?: ScaleType;
    dashLineScaleType?: ScaleType;

    onCircleTap: (e: any, i: number) => void;
    onSolidLineTap: (e: any) => void;
    solidLineTapOffset: number;
    circleSelected: boolean = false;
    circleRadious: number;
    solidLineClickable: boolean;

    constructor(cfg: TrackCfg) {
        super(cfg);
        this.selfAdaptation.paddingRight = cfg.paddingRight !== undefined ? cfg.paddingRight : RADIOUS;
        this.selfAdaptation.paddingTop = cfg.paddingTop !== undefined ? cfg.paddingTop : RADIOUS;
        this.selfAdaptation.paddingLeft = cfg.paddingLeft !== undefined ? cfg.paddingLeft : RADIOUS;
        this.selfAdaptation.paddingBottom = cfg.paddingBottom !== undefined ? cfg.paddingBottom : RADIOUS;
        this.solidLineStyle = cfg.solidLineStyle !== undefined ? cfg.solidLineStyle : new PolylineStyle();
        this.solidLineHighlightStyle =
            cfg.solidLineHighlightStyle !== undefined ? cfg.solidLineHighlightStyle : this.solidLineStyle;
        this.dashLineStyle = cfg.dashLineStyle !== undefined ? cfg.dashLineStyle : new PolylineStyle();
        this.circleScaleType = cfg.circleScaleType !== undefined ? cfg.circleScaleType : ScaleType.SHAPE;
        this.dashLineScaleType = cfg.dashLineScaleType !== undefined ? cfg.dashLineScaleType : ScaleType.POSITION;
        this.solidLineScaleType = cfg.solidLineScaleType !== undefined ? cfg.solidLineScaleType : ScaleType.POSITION;
        this.onCircleTap = cfg.onCircleTap;
        this.onSolidLineTap = cfg.onSolidLineTap;
        this.solidLineTapOffset = cfg.solidLineTapOffset !== undefined ? cfg.solidLineTapOffset : 2;
        this.circleSelected = cfg.circleSelected !== undefined ? cfg.circleSelected : false;
        this.circleRadious = cfg.circleRadious !== undefined ? cfg.circleRadious : RADIOUS;
        this.solidLineClickable = cfg.solidLineClickable !== undefined ? cfg.solidLineClickable : true;
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
        if (points.length === 1) {
            this.drawText();
            this.drawAllPoints();
        } else {
            this.selfAdaptation.adapt(points);
            const startK = LineHelper.calcK(this.solidLinePoints[0][0].point, this.solidLinePoints[0][1].point);
            this.drawText();
            this.drawDashLine(startK);
            this.drawSolidLine(startK);
            this.drawAllPoints();
        }
    }

    render() {
        this.hz.render();
    }

    private drawText() {
        for (const modal of this.trackModals) {
            const position = new Point(
                modal.point.x * this.selfAdaptation.scaleX + this.selfAdaptation.offsetX,
                modal.point.y * this.selfAdaptation.scaleY + this.selfAdaptation.offsetY,
            );
            this.hz.add(
                new Text({
                    position,
                    text: modal.title,
                    fontSize: 12,
                    color: '#90A5CE',
                    textAlign: 'center',
                    scaleType: this.circleScaleType,
                    maxLength: 7,
                }),
            );
        }
    }

    private drawAllPoints() {
        for (let i = 0; i < this.trackModals.length; i++) {
            const modal = this.trackModals[i];
            this.hz.add(
                new Circle({
                    cx: modal.point.x * this.selfAdaptation.scaleX + this.selfAdaptation.offsetX,
                    cy: modal.point.y * this.selfAdaptation.scaleY + this.selfAdaptation.offsetY,
                    r: this.circleRadious,
                    color: modal.point.color,
                    scaleType: this.circleScaleType,
                    selectable: this.circleSelected,
                    onTap: () => {
                        if (this.onCircleTap) {
                            this.onCircleTap(modal, i);
                        }
                        console.log('click circle');
                    },
                }),
            );
        }
    }

    private drawSolidLine(startK: number) {
        this.solidLinePoints.forEach(modal => {
            const adaptPoints = modal.map(p => {
                return this.selfAdaptation.adaptPoint(p.point);
            });
            if (adaptPoints.length > 1) {
                const rap = new RightAnglePolyline({
                    startK,
                    points: adaptPoints,
                    highlightStyle: this.solidLineHighlightStyle,
                    lineWidth: this.solidLineStyle.lineWidth,
                    smooth: 1,
                    lineColor: this.solidLineStyle.color,
                    scaleType: this.solidLineScaleType,
                    clickable: this.solidLineClickable,
                    tapOffset: this.solidLineTapOffset,
                    onTap: () => {
                        if (this.onSolidLineTap) {
                            this.onSolidLineTap(modal);
                        }
                        console.log('go to');
                    },
                });
                this.hz.add(rap);
            }
        });
    }

    private drawDashLine(startK: number) {
        this.dashLinePoints.forEach(modal => {
            const adaptPoints = modal.map(m => {
                return this.selfAdaptation.adaptPoint(m.point);
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
                this.addLinePathPoint(lastReadType, modal, idx);
            }
            // 如果不相同，则要在上一个容器中添加，然后在另一个容器中新添加意向
            else {
                this.addLinePathPoint(lastReadType, modal, idx);
                switch (modal.readType) {
                    case ReadType.s:
                    case ReadType.s1:
                        idx[0]++;
                        break;
                    case ReadType.s2:
                        idx[1]++;
                        break;
                }
                this.addLinePathPoint(modal.readType, modal, idx);
            }
            lastReadType = modal.readType;
        }
    }

    private addLinePathPoint(readType: ReadType, modal: TrackModal, idx: [number, number]) {
        switch (readType) {
            case ReadType.s:
            case ReadType.s1:
                {
                    let arr = this.solidLinePoints[idx[0]];
                    if (arr == null) {
                        arr = [modal];
                    } else {
                        arr.push(modal);
                    }
                    this.solidLinePoints[idx[0]] = arr;
                }
                break;
            case ReadType.s2:
                {
                    let arr = this.dashLinePoints[idx[1]];
                    if (arr == null) {
                        arr = [modal];
                    } else {
                        arr.push(modal);
                    }
                    this.dashLinePoints[idx[1]] = arr;
                }
                break;
        }
    }
}

interface TrackCfg extends ChartCfg {
    data: any;
    onCircleTap?: (e: any) => void;
    onSolidLineTap?: (e: any) => void;
    solidLineStyle?: PolylineStyle;
    solidLineHighlightStyle?: PolylineStyle;
    dashLineStyle?: PolylineStyle;
    circleScaleType?: ScaleType;
    solidLineScaleType?: ScaleType;
    dashLineScaleType?: ScaleType;
    solidLineTapOffset?: number;
    circleSelected?: boolean;
    circleRadious?: number;
    solidLineClickable?: boolean;
}

export class TrackModal extends ChartModal {
    static mapper(data: TrackDataModal) {
        const modal = new TrackModal();
        modal.point = new Point(data.list_info.list_x, data.list_info.list_y, colorList[data.list_info.list_type]);
        modal.title = data.list_info.list_title.title_detail;
        // modal.content = data.list_content;
        modal.readType = data.read_type as ReadType;
        modal.listId = data.list_info.list_id;
        modal.originData = data;
        return modal;
    }

    point: Point;
    title: string;
    content: string;
    listId: string;
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
