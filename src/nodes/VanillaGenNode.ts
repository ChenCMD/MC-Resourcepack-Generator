import { GeneratorContext } from '../types/Context';
import { pathValidater } from '../types/Validater';
import { createModel, injectPath, makeUri } from '../util/common';
import { listenInput } from '../util/vscodeWrapper';
import { AbstractNode } from '../types/AbstractNode';

export class VanillaGenNode implements AbstractNode {
    private parent!: string;

    async childQuestion(): Promise<void> {
        this.parent = await this.listenParentPath();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        // モデルファイルの生成
        const path = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(path, this.parent);
    }

    private async listenParentPath(): Promise<string> {
        return await listenInput('parent', v => pathValidater(v, 'parentはitem/又はblock/から始まる必要があります。'));
    }
}