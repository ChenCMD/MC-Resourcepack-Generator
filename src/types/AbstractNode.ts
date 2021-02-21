import { GeneratorContext } from './Context';
import { ParentItem, listenParentPath } from './ParentItem';

export abstract class AbstractNode {
    abstract childQuestion(parentElements: ParentItem[]): Promise<void>;
    abstract generate(ctx: GeneratorContext): Promise<void>;

    protected async listenParentPath(parentElements: ParentItem[], withoutNonHasTextures?: boolean): Promise<string> {
        return await listenParentPath(parentElements, 'parent', withoutNonHasTextures);
    }
}