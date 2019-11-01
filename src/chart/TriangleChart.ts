import { Chart, ChartCfg, ChartModal } from '../basic/Chart';
import { Point } from '../unit/Point';
import { Text } from '../shape/Text';
import { ScaleType } from '../basic/Displayable';
import { Triangle } from '../shape/Triangle';
import { CurvePolyline } from '../shape/polyline/CurvePolyline';

export class TriangleChart extends Chart {
    // 主点
    mainModal: TriangleModal;
    modals: TriangleModal[];
    onTriangleTap: (e: any) => void;
    triangleSelected: boolean = false;

    constructor(cfg: TriangleChartCfg) {
        super(cfg);
        this.modals = cfg.data;
        this.mainModal = cfg.mainModal;
        this.onTriangleTap = cfg.onTriangleTap;
        this.triangleSelected = cfg.triangleSelected ? cfg.triangleSelected : false;
        this.process();
    }

    process() {
        // 转换数据

        // 自适应计算
        const points = this.modals.map(v => {
            return v.point;
        });
        this.selfAdaptation.adapt(points);

        this.drawText();
        this.drawCurve();
        this.drawTriangles();
        this.drawMainTriangle();
    }

    render() {
        this.hz.render();
    }

    private processDate() {}

    private drawMainTriangle() {
        this.hz.add(
            new Triangle({
                point: this.mainModal.point,
                color: this.mainModal.color,
                size: this.mainModal.size,
                scaleType: ScaleType.POSITION,
                selectable: this.triangleSelected,
                onTap: () => {
                    console.log('click triangle');
                    if (this.onTriangleTap) {
                        this.onTriangleTap(this.mainModal);
                    }
                },
            }),
        );
    }

    private drawTriangles() {
        this.modals.forEach(modal => {
            this.hz.add(
                new Triangle({
                    point: modal.point,
                    color: modal.color,
                    size: modal.size,
                    scaleType: ScaleType.POSITION,
                    selectable: this.triangleSelected,
                    onTap: () => {
                        console.log('click triangle');
                        if (this.onTriangleTap) {
                            this.onTriangleTap(modal);
                        }
                    },
                }),
            );
        });
    }

    private drawText() {
        this.modals.forEach(modal => {
            const position = new Point(modal.point.x, modal.point.y);
            this.hz.add(
                new Text({
                    position,
                    text: modal.text,
                    fontSize: 12,
                    color: '#90A5CE',
                    textAlign: 'center',
                    scaleType: ScaleType.POSITION,
                    maxLength: 7,
                }),
            );
        });
    }

    private drawCurve() {
        this.modals.forEach(modal => {
            // if (modal.id === this.mainModal.id) {
            //     return;
            // }

            this.hz.add(
                new CurvePolyline({
                    points: [this.mainModal.point, modal.point],
                    scaleType: ScaleType.SHAPE,
                    lineColor: modal.color,
                }),
            );
        });
    }
}

export interface TriangleChartCfg extends ChartCfg {
    data: TriangleModal[];
    mainModal: TriangleModal;
    onTriangleTap?: (e: any) => void;
    triangleSelected?: boolean;
}

export class TriangleModal extends ChartModal {
    point: Point;
    text: string;
    color: string;
    size: number;
}
