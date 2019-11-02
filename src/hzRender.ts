import { Displayable, VisualSize } from './basic/Displayable';
import { TouchEventCfg, TouchEvent } from './basic/TouchEvent';
import { ScaleInfo } from './basic/ScaleInfo';
import { Tools } from './unit/Tools';

export class hzRender {
    id: string;
    visualSize: VisualSize = new VisualSize();
    touchEventCfg?: TouchEventCfg;

    touchEvent: TouchEvent | undefined = undefined;
    isStopAnimator: boolean = false;
    private list: Displayable[] = [];
    private context: CanvasContext;

    constructor(cfg: hzRenderCfg) {
        console.log({
            message: 'hzRender init',
        });

        this.id = cfg.id;
        this.context = uni.createCanvasContext(this.id);
        this.visualSize.height = cfg.height;
        this.visualSize.width = cfg.width;
        this.touchEventCfg = cfg.touchEventCfg;

        if (this.touchEventCfg) {
            this.registerEvent();
        }
    }

    add(shape: Displayable) {
        shape.visualSize = this.visualSize;
        this.list.push(shape);
        this.list.sort((a, b) => {
            return a.zIndex - b.zIndex;
        });
    }

    clear() {
        this.context.clearRect(0, 0, this.visualSize.width, this.visualSize.height);
        // this.context.draw(true);
    }

    render() {
        const animatorSize = this.getAnimatorList().length;
        if (animatorSize > 0) {
            this.startAnimation();
        } else {
            this.draw();
        }
    }

    private draw() {
        this.clear();
        this.list.forEach(item => {
            item.draw(this.context);
        });

        this.context.draw();
    }

    private startAnimation() {
        // 计算最大执行时间
        let maxDurtionTime = 0;
        const animatorList = this.getAnimatorList();
        animatorList.forEach(e => {
            maxDurtionTime = Tools.getMax(e.animator.durationTime, maxDurtionTime);
        });

        const rate = 1000 / 30;

        let deltaTime = 0;
        const interval = setInterval(() => {
            deltaTime += rate;
            if (deltaTime >= maxDurtionTime || this.isStopAnimator) {
                clearInterval(interval);
            }

            animatorList.forEach(e => {
                e.animate(deltaTime);
            });
            this.draw();
        }, rate);
    }

    // destory() {}

    private onScale(scaleInfo: ScaleInfo) {
        this.stopAllAnimator();
        // this.clear();
        // this.context.scale(scale, scale);
        for (const obj of this.list) {
            obj.scale(scaleInfo);
        }
        this.draw();
    }

    private onTap(x: number, y: number) {
        this.stopAllAnimator();
        let hasFindOne = false;
        for (let i = this.list.length - 1; i >= 0; i--) {
            const obj = this.list[i];
            if (!hasFindOne && obj.contain(x, y)) {
                obj.tap();
                hasFindOne = true;
            } else {
                obj.unTap();
            }
        }
        if (!hasFindOne && this.touchEventCfg.onUnTap) {
            this.touchEventCfg.onUnTap();
        }
        this.draw();
    }

    private onPan(scaleInfo: ScaleInfo) {
        this.stopAllAnimator();
        this.list.forEach(obj => {
            obj.pan(scaleInfo);
        });
        this.draw();
    }

    private registerEvent() {
        this.touchEvent = new TouchEvent(this.id);
        this.touchEvent.onScale = (scaleInfo: ScaleInfo) => {
            this.onScale(scaleInfo);
        };
        this.touchEvent.onTap = (x: number, y: number) => {
            this.onTap(x, y);
        };
        this.touchEvent.onPan = (scaleInfo: ScaleInfo) => {
            this.onPan(scaleInfo);
        };
    }

    private getAnimatorList() {
        return this.list.filter(e => e.animator !== null && !e.animator.isDone);
    }

    private stopAllAnimator() {
        this.isStopAnimator = true;
        this.getAnimatorList().forEach(e => {
            e.animator.stop();
        });
    }
}

interface hzRenderCfg {
    id: string;
    // 可以看见的区域大小
    width: number;
    height: number;
    touchEventCfg?: TouchEventCfg;
}
