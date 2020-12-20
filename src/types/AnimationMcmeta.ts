import { BooleanLikeString, toBoolean } from './BooleanLikeString';
import { QuickPickItemHasId } from './QuickPickItemHasId';

export interface AnimationMcmeta {
    animation: {
        interpolate: boolean
        frametime: number
    }
}

export function createAnimationMcmeta(interpolate: QuickPickItemHasId<BooleanLikeString>, frametime: string): AnimationMcmeta {
    return {
        animation: {
            interpolate: toBoolean(interpolate.id),
            frametime: Number.parseInt(frametime)
        }
    };
}

export function getInterpolateMap(): Map<BooleanLikeString, string> {
    const res = new Map<BooleanLikeString, string>();

    res.set('true', '単体テクスチャ');
    res.set('false', 'アニメーションテクスチャ');

    return res;
}