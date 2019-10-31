import { Displayable, VisualSize } from './basic/Displayable';
import { TouchEventCfg, TouchEvent } from './basic/TouchEvent';
import { ScaleInfo } from './basic/ScaleInfo';

export class hzRender {
    id: string;
    visualSize: VisualSize = new VisualSize();
    touchEventCfg?: TouchEventCfg;

    touchEvent: TouchEvent | undefined = undefined;

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
        this.context.clearRect(20, 20, 40, 40);
        this.context.draw(true);
    }

    render() {
        this.list.forEach(item => {
            item.draw(this.context);
        });

        this.context.draw();
        //

        // setTimeout(() => {
        //     this.onScale(1.5, new Point(100, 100));
        //     this.onScale(2, new Point(200, 100));
        //     // this.clear();
        //     // this.context.draw();
        // }, 2000);
    }

    // destory() {}

    private onScale(scaleInfo: ScaleInfo) {
        // this.clear();
        // this.context.scale(scale, scale);
        for (const obj of this.list) {
            obj.scale(scaleInfo);
        }
        this.render();
    }

    private onTap(x: number, y: number) {
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
        this.render();
    }

    private onPan(scaleInfo: ScaleInfo) {
        this.list.forEach(obj => {
            obj.pan(scaleInfo);
        });
        this.render();
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
}

interface hzRenderCfg {
    id: string;
    // 可以看见的区域大小
    width: number;
    height: number;
    touchEventCfg?: TouchEventCfg;
}
