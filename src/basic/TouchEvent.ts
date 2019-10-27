import AnyTouch from 'any-touch';
import { ScaleInfo } from './ScaleInfo';
import EventFul, { EventType } from './EventFul';
import { Point } from '../unit/Point';

export class TouchEvent {
    FRAME_RATE: number = 1000 / 60;
    anyTouch = new AnyTouch();
    onScale: (scaleInfo: ScaleInfo) => void | undefined;
    onTap: (x: number, y: number, scale: number) => void | undefined;
    onPan: (scaleInfo: ScaleInfo) => void | undefined;
    gesturePanStatus: GestureStatus = GestureStatus.NONE;
    gesturePinchStatus: GestureStatus = GestureStatus.NONE;
    private scaleInfo: ScaleInfo = new ScaleInfo();
    private lastTimeStamp: number = 0;

    constructor(private id: string) {
        uni.$on(EventFul.getEventName(EventType.onTouchStart, this.id), event => {
            this.anyTouch.catchEvent(this.mapTouchEvent(event));
        });
        uni.$on(EventFul.getEventName(EventType.onTouchEnd, this.id), event => {
            this.anyTouch.catchEvent(this.mapTouchEvent(event));
        });
        uni.$on(EventFul.getEventName(EventType.onTouchMove, this.id), event => {
            this.anyTouch.catchEvent(this.mapTouchEvent(event));
        });

        this.anyTouch.on('pinch', ev => {
            if (this.gesturePinchStatus === GestureStatus.START) {
                this.gesturePinchStatus = GestureStatus.ON;
            }
            if (this.gesturePinchStatus === GestureStatus.ON) {
                // console.log('pinch');
                if (ev.center) {
                    this.scaleInfo.deltaScale = ev.deltaScale;
                    this.scaleInfo.point = new Point(ev.center.x, ev.center.y);
                    this.scaleInfo.scale = this.scaleInfo.scale * this.scaleInfo.deltaScale;
                    this.scaleInfo.lastOffset = new Point(
                        this.scaleInfo.lastOffset.x * this.scaleInfo.deltaScale +
                            (1 - this.scaleInfo.deltaScale) * this.scaleInfo.point.x,
                        this.scaleInfo.lastOffset.y * this.scaleInfo.deltaScale +
                            (1 - this.scaleInfo.deltaScale) * this.scaleInfo.point.y,
                    );
                    this.requestAnimationFrame(ev.timestamp, () => {
                        if (this.onScale) {
                            this.onScale(this.scaleInfo);
                        }
                    });
                }
            }
        });

        this.anyTouch.on('pinchstart', ev => {
            if (this.gesturePinchStatus === GestureStatus.NONE) {
                this.gesturePinchStatus = GestureStatus.START;
                console.log('pinchstart');
            }
        });

        this.anyTouch.on('pinchend', ev => {
            if (this.gesturePinchStatus === GestureStatus.ON || this.gesturePinchStatus === GestureStatus.START) {
                console.log('pinchend');
                this.gesturePinchStatus = GestureStatus.NONE;
            }
        });

        this.anyTouch.on('tap', ev => {
            console.log('tap');
            // console.log(ev.x, ev.y);
            this.requestAnimationFrame(ev.timestamp, () => {
                if (this.onTap) {
                    this.onTap(ev.x, ev.y, this.scaleInfo.scale);
                }
            });
        });

        this.anyTouch.on('panstart', ev => {
            if (this.gesturePanStatus === GestureStatus.NONE) {
                this.gesturePanStatus = GestureStatus.START;
                console.log('panstart');
            }
        });
        this.anyTouch.on('panend', ev => {
            if (this.gesturePanStatus === GestureStatus.ON || this.gesturePanStatus === GestureStatus.START) {
                console.log('panend');
                this.gesturePanStatus = GestureStatus.NONE;
            }
        });
        this.anyTouch.on('pan', ev => {
            if (this.gesturePanStatus === GestureStatus.START) {
                this.gesturePanStatus = GestureStatus.ON;
            }
            if (this.gesturePanStatus === GestureStatus.ON) {
                // console.log('pan');
                this.scaleInfo.panOffset.x += ev.deltaX;
                this.scaleInfo.panOffset.y += ev.deltaY;
                this.requestAnimationFrame(ev.timestamp, () => {
                    if (this.onPan) {
                        this.scaleInfo.panOffset.x = this.scaleInfo.panOffset.x / this.scaleInfo.scale;
                        this.scaleInfo.panOffset.y = this.scaleInfo.panOffset.y / this.scaleInfo.scale;
                        this.onPan(this.scaleInfo);
                    }
                    this.scaleInfo.panOffset.x = 0;
                    this.scaleInfo.panOffset.y = 0;
                });
            }
        });
    }

    // 将 touchEvent 装换成 anyTouch 可以使用的类型
    private mapTouchEvent(event: any) {
        for (const touch of event.touches) {
            touch.clientX = touch.x;
            touch.clientY = touch.y;
        }
        for (const touch of event.changedTouches) {
            touch.clientX = touch.x;
            touch.clientY = touch.y;
        }
        return event;
    }

    private requestAnimationFrame = (currentTimeStemp: number, callback: () => void) => {
        const deltaTimeStamp = currentTimeStemp - this.lastTimeStamp;
        if (deltaTimeStamp > this.FRAME_RATE) {
            this.lastTimeStamp = currentTimeStemp;
            callback();
        }
    };
}

export interface TouchEventCfg {
    scalable?: boolean;
}

enum GestureStatus {
    NONE,
    START,
    ON,
}
