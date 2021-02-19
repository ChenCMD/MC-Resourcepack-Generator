import { ExtendQuickPickItem } from './ExtendsQuickPickItem';

export interface AnimationMcmeta {
    animation: {
        interpolate: boolean
        frametime: number
    }
}

export function createAnimationMcmeta(interpolate: ExtendQuickPickItem<boolean>, frametime: string): AnimationMcmeta {
    return {
        animation: {
            interpolate: interpolate.extend,
            frametime: Number.parseInt(frametime)
        }
    };
}

export function getInterpolateMap(): Map<string, boolean> {
    const res = new Map<string, boolean>();

    res.set('フレーム間補完(interpolate)を有効にする', true);
    res.set('フレーム間補完(interpolate)を無効にする', false);

    return res;
}