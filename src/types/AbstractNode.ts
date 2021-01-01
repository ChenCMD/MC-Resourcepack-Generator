import { GeneratorContext } from './Context';

export interface AbstractNode {
    childQuestion(): Promise<void>;
    generate(ctx: GeneratorContext): Promise<void>;
}