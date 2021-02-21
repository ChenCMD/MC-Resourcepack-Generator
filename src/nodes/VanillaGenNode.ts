import { GeneratorContext } from '../types/Context';
import { createModel, injectPath, makeUri } from '../util/common';
import { AbstractNode } from '../types/AbstractNode';
import { ParentItem } from '../types/ParentItem';

export class VanillaGenNode extends AbstractNode {
    private parent!: string;

    async childQuestion(parentElement: ParentItem[]): Promise<void> {
        this.parent = await this.listenParentPath(parentElement, true);
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        // モデルファイルの生成
        const path = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(path, this.parent);
    }
}