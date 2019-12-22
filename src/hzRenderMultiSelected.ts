import {hzRender, hzRenderCfg} from './hzRender';

export class hzRenderMultiSelected extends hzRender {
    selectedSize: number;
    maxSize: number;

    constructor(cfg: hzRenderMultiSelectedCfg) {
        super(cfg);
        this.maxSize = cfg.maxSize;
        this.selectedSize = 0;
    }

    onTap(x: number, y: number) {
        this.stopAllAnimator();
        for (let i = this.list.length - 1; i >= 0; i--) {
            const obj = this.list[i];
            if (obj.selectable && obj.contain(x, y)) {
                if (obj.selected) {
                    obj.unTap();
                    this.selectedSize--;
                } else {
                    if (this.isSelectedSizeValidate(this.selectedSize)) {
                        obj.tap();
                        this.selectedSize++;
                    }
                }

                break;
            }
        }
        this.draw();
    }


    private isSelectedSizeValidate(selectedSize: number) {
        return selectedSize < this.maxSize;
    }


}

export interface hzRenderMultiSelectedCfg extends hzRenderCfg {
    maxSize: number;
}
