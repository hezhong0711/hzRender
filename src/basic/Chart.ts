import { hzRender } from '../hzRender';
import { SelfAdaptation, SelfAdaptationCfg } from './SelfAdaptation';

export class Chart {
    hz: hzRender;
    selfAdaptation: SelfAdaptation;
    unTap: () => void;

    constructor(cfg: ChartCfg) {
        this.hz = cfg.hz;
        this.hz.touchEventCfg.onUnTap = cfg.unTap;
        this.selfAdaptation = new SelfAdaptation({
            width: cfg.width,
            height: cfg.height,
        });
    }
}

export interface ChartCfg extends SelfAdaptationCfg {
    hz: hzRender;
    unTap?: () => void;
}

export class ChartModal {
    id: number;
    originData: any;
}
