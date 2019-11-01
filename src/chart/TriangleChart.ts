import { Chart, ChartCfg, ChartModal } from '../basic/Chart';
import { Point } from '../unit/Point';
import { Comma } from '../shape/Comma';
import { Text } from '../shape/Text';
import { ScaleType } from '../basic/Displayable';

export class TriangleChart extends Chart {
    modals: TriangleModal[];
    onCommaTap: (e: any) => void;
    commaSelected: boolean = false;

    constructor(cfg: TriangleChartCfg) {
        super(cfg);
        this.modals = cfg.data;
        this.onCommaTap = cfg.onCommaTap;
        this.commaSelected = cfg.commaSelected ? cfg.commaSelected : false;
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
        this.drawComma();
    }

    render() {
        this.hz.render();
    }

    private drawComma() {
        this.modals.forEach(modal => {
            this.hz.add(
                new Comma({
                    point: modal.point,
                    color: modal.color,
                    scaleType: ScaleType.POSITION,
                    selectable: this.commaSelected,
                    onTap: () => {
                        console.log('click comma');
                        if (this.onCommaTap) {
                            this.onCommaTap(modal);
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
}

interface TriangleChartCfg extends ChartCfg {
    data: any;
    onCommaTap?: (e: any) => void;
    commaSelected?: boolean;
}

class TriangleModal extends ChartModal {
    point: Point;
    text: string;
    color: string;
}
