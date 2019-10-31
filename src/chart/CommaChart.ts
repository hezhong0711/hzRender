import { Chart, ChartCfg } from '../basic/Chart';
import { Point } from '../unit/Point';
import { Comma } from '../shape/Comma';
import { ScaleType } from '../basic/Displayable';

export class CommaChart extends Chart {
    commaModals: CommaModal[];
    onCommaTap: (e: any) => void;

    constructor(cfg: CommaChartCfg) {
        super(cfg);
        this.commaModals = cfg.data;
        this.onCommaTap = cfg.onCommaTap;
        this.process();
    }

    process() {
        // 转换数据

        // 自适应计算
        const points = this.commaModals.map(v => {
            return v.point;
        });
        this.selfAdaptation.adapt(points);

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
                    scaleType: ScaleType.SHAPE,
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
}

interface CommaChartCfg extends ChartCfg {
    data: any;
    onCommaTap?: (e: any) => void;
}

interface CommaModal {
    point: Point;
    text: string;
    color: string;
    originData: any;
}
