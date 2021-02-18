import { GeneratorContext } from '../types/Context';
import { createModel, injectPath, makeUri } from '../util/common';
import { AbstractNode } from '../types/AbstractNode';
import { QuickPickItem } from 'vscode';

export class VanillaGenNode extends AbstractNode {
    private parent!: string;

    async childQuestion(parentElement: QuickPickItem[]): Promise<void> {
        this.parent = await this.listenParentPath(parentElement);
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        // モデルファイルの生成
        const path = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(path, this.parent);
    }
}