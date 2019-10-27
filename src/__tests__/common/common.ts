import { ScaleInfo } from '../../basic/ScaleInfo';
import { Point } from '../../unit/Point';

export const scaleInfo: ScaleInfo = new ScaleInfo();
scaleInfo.scale = 1.1;
scaleInfo.lastOffset = new Point(110, 10);
scaleInfo.panOffset = new Point(1, 1);
