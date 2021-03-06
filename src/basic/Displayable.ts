import EventFul from './EventFul';
import {ScaleInfo} from './ScaleInfo';
import {Point} from '../unit/Point';
import {LineHelper} from '../factory/LineHelper';
import {Animator} from '../animation/Animator';

export abstract class Displayable extends EventFul {
    zIndex: number;
    onTap?: () => void;
    onUnTap?: () => void;
    onScale?: () => void;
    onPan?: (x: number, y: number) => void;
    scaleInfo: ScaleInfo = new ScaleInfo();
    scaleType: ScaleType;
    visualSize: VisualSize = new VisualSize();
    selected: boolean = false;
    selectable: boolean;
    animator: Animator;

    protected constructor(cfg: DisplayableCfg) {
        super();
        this.zIndex = cfg.zIndex == null ? 0 : cfg.zIndex;
        this.onTap = cfg.onTap;
        this.onUnTap = cfg.onUnTap;
        this.onPan = cfg.onPan;
        this.onScale = cfg.onScale;
        this.scaleType = cfg.scaleType !== undefined ? cfg.scaleType : ScaleType.NONE;
        this.selectable = cfg.selectable !== undefined ? cfg.selectable : false;
        this.selected = cfg.selected !== undefined ? cfg.selected : false;
        this.animator = cfg.animator !== undefined ? cfg.animator : null;
    }

    abstract draw(context: any, scaleInfo?: ScaleInfo): void;

    abstract contain(x: number, y: number): boolean;

    abstract inVisualArea(params?: any): boolean;

    scale(scaleInfo: ScaleInfo) {
        if (this.scaleType === ScaleType.NONE) {
            return;
        }
        this.scaleInfo = scaleInfo;
    }

    animate(execTime: number) {
        const deltaPosition = this.animator.animateDelta(execTime);
        this.animateTo(deltaPosition);
    }

    abstract pan(scaleInfo: ScaleInfo): void;

    unTap() {
        this.selected = false;
        if(this.onUnTap) {
            this.onUnTap();
        }
    }

    tap() {
        if (this.selectable) {
            this.selected = !this.selected;
        }
        this.onTap();
    }

    getScaleLength(length: number) {
        if (this.scaleType === ScaleType.SHAPE) {
            return length * this.scaleInfo.scale;
        }
        return length;
    }

    getScalePoint(point: Point) {
        if (this.scaleType === ScaleType.NONE) {
            return point;
        }
        return Point.scale(point, this.scaleInfo);
    }

    protected animateTo(deltaPosition: Point) {
    }
}

export interface DisplayableCfg {
    zIndex?: number;
    onTap?: () => void;
    onUnTap?: () => void;
    onPan?: (x: number, y: number) => void;
    onScale?: () => void;
    scaleType?: ScaleType; // 缩放类型
    selectable?: boolean; // 是否可以选中
    selected?: boolean; // 是否选中
    animator?: Animator;
}

export class VisualSize {
    width: number = 0;
    height: number = 0;

    topLine() {
        return LineHelper.getLineLimit(new Point(0, 0), new Point(this.width, 0));
    }

    bottomLine() {
        return LineHelper.getLineLimit(new Point(0, this.height), new Point(this.width, this.width));
    }

    leftLine() {
        return LineHelper.getLineLimit(new Point(0, 0), new Point(0, this.width));
    }

    rightLine() {
        return LineHelper.getLineLimit(new Point(this.width, 0), new Point(this.width, this.width));
    }
}

export enum ScaleType {
    NONE, // 不缩放
    SHAPE, // 缩放大小
    POSITION, // 缩放位置
}
