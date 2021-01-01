import { AbstractNode } from './AbstractNode';
import { AnimationMcmeta } from './AnimationMcMeta';
import { GeneratorContext } from './Context';

export interface Animation extends AbstractNode {
    animSetting: AnimationMcmeta;

    childQuestion(): Promise<void>;
    generate(ctx: GeneratorContext): Promise<void>;

    listenAnimationSetting(): Promise<void>;
}