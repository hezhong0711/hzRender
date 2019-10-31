import { Displayable, DisplayableCfg } from '../basic/Displayable';
import { ScaleInfo } from '../basic/ScaleInfo';
import { Point } from '../unit/Point';

export class Text extends Displayable {
    position: Point;
    text: string;
    fontSize: number;
    textAlign: 'left' | 'center' | 'right';
    color: string;
    maxLength: number;
    offset: TextOffsetCfg;

    constructor(cfg: TextCfg) {
        super(cfg);
        this.position = cfg.position;
        this.text = cfg.text;
        this.fontSize = cfg.fontSize ? cfg.fontSize : 12;
        this.textAlign = cfg.textAlign ? this.textAlign : 'center';
        this.color = cfg.color ? cfg.color : 'black';
        this.maxLength = cfg.maxLength ? cfg.maxLength : 1000;
        this.offset = cfg.offset ? cfg.offset : { offsetX: 0, offsetY: 30 };
    }

    contain(x: number, y: number): boolean {
        return false;
    }

    draw(context: any, scaleInfo?: ScaleInfo): void {
        context.setFontSize(this.fontSize);
        context.setFillStyle(this.color);
        // 判断清单名称长度,超出7个字符省略显示
        let maxText = this.text;
        if (this.text.length > this.maxLength) {
            maxText = this.text.substring(0, this.maxLength) + '...';
        }
        context.setTextAlign(this.textAlign);
        const scalePosition = this.getScalePoint(this.position);
        context.fillText(maxText, scalePosition.x + this.offset.offsetX, scalePosition.y + this.offset.offsetY);
    }

    inVisualArea(params?: any): boolean {
        return true;
    }

    pan(scaleInfo: ScaleInfo): void {
        this.position.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
    }
}

export interface TextCfg extends DisplayableCfg {
    position: Point;
    text: string;
    fontSize: number;
    textAlign: 'left' | 'center' | 'right';
    color: string;
    maxLength: number;
    offset?: TextOffsetCfg;
}

export interface TextOffsetCfg {
    offsetX: number;
    offsetY: number;
}
