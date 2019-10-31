import { Chart, ChartCfg } from '../basic/Chart';
import { Point } from '../unit/Point';
import { Comma } from '../shape/Comma';
import { Text } from '../shape/Text';
import { ScaleType } from '../basic/Displayable';

export class CommaChart extends Chart {
    commaModals: CommaModal[];
    onCommaTap: (e: any) => void;
    commaSelected: boolean = false;

    constructor(cfg: CommaChartCfg) {
        super(cfg);
        this.commaModals = cfg.data;
        this.onCommaTap = cfg.onCommaTap;
        this.commaSelected = cfg.commaSelected ? cfg.commaSelected : false;
        this.process();
    }

    process() {
        // 转换数据

        // 自适应计算
        const points = this.commaModals.map(v => {
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
        this.commaModals.forEach(modal => {
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
        this.commaModals.forEach(modal => {
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

interface CommaChartCfg extends ChartCfg {
    data: any;
    onCommaTap?: (e: any) => void;
    commaSelected?: boolean;
}

interface CommaModal {
    point: Point;
    text: string;
    color: string;
    originData: any;
}
