import { AbstractNode } from './AbstractNode';
import { AnimationMcmeta } from './AnimationMcMeta';

export interface Animation extends AbstractNode {
    animSetting: AnimationMcmeta;

    listenAnimationSetting(): Promise<AnimationMcmeta>;
}