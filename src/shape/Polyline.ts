import { Displayable, DisplayableCfg } from '../basic/Displayable';
import { Point } from '../unit/Point';
import { Line } from '../unit/Line';
import { LinePath } from '../unit/LinePath';

export abstract class Polyline extends Displayable {
    points: Point[] = [];
    smooth: number = 0;
    lineWidth?: number;
    lineColor?: string;
    lineGradient?: boolean;
    isDash?: boolean;
    isHighlight: boolean = false;
    highlightStyle?: PolylineStyle;
    clickable: boolean;
    linePaths: any = [];
    tapOffset: number;

    constructor(cfg: PolylineCfg) {
        super(cfg);
        this.points = cfg.points;
        this.smooth = cfg.smooth !== undefined ? cfg.smooth : 0;
        this.lineWidth = cfg.lineWidth !== undefined ? cfg.lineWidth : 1;
        this.lineGradient = cfg.lineGradient !== undefined ? cfg.lineGradient : false;
        this.lineColor = cfg.lineColor !== undefined ? cfg.lineColor : 'black';
        this.isDash = cfg.isDash !== undefined ? cfg.isDash : false;
        this.tapOffset = cfg.tapOffset !== undefined ? cfg.tapOffset : 2;
        this.highlightStyle = cfg.highlightStyle !== undefined ? cfg.highlightStyle : new PolylineStyle();
        this.clickable = cfg.clickable !== undefined ? cfg.clickable : false;
    }

    contain(x: number, y: number): boolean {
        return false;
    }

    inVisualArea(linePath: LinePath): boolean {
        return !(
            !this.isPointInVisualArea(linePath.start) &&
            !this.isPointInVisualArea(linePath.end) &&
            !this.isLineInVisualArea(linePath.toLine())
        );
    }

    abstract draw(context: any): void;

    tap() {
        if (this.clickable) {
            super.tap();
            this.isHighlight = true;
        }
    }

    unTap() {
        super.unTap();
        this.isHighlight = false;
    }

    protected isLineInVisualArea(line: Line): boolean {
        return !(
            line.getCrossPointToLine(this.visualSize.topLine()) == null &&
            line.getCrossPointToLine(this.visualSize.bottomLine()) == null &&
            line.getCrossPointToLine(this.visualSize.leftLine()) == null &&
            line.getCrossPointToLine(this.visualSize.rightLine()) == null
        );
    }

    protected isPointInVisualArea(point: Point): boolean {
        return point.x <= this.visualSize.width && point.x >= 0 && point.y <= this.visualSize.height && point.y >= 0;
    }
}

export interface PolylineCfg extends DisplayableCfg {
    points: Point[];
    isDash?: boolean;
    lineWidth?: number;
    lineColor?: string;
    lineGradient?: boolean;
    smooth?: number;
    tapOffset?: number;
    highlightStyle?: PolylineStyle;
    clickable?: boolean;
}

export class PolylineStyle {
    color: string = 'black';
    lineWidth: number = 3;
    lineGradient: boolean = false;
}
