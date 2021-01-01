import { GeneratorContext } from '../types/Context';
import { pathValidater } from '../types/Validater';
import { createModel, injectPath, makeUri } from '../util/common';
import { listenInput } from '../util/vscodeWrapper';
import { AbstractNode } from '../types/AbstractNode';

export class VanillaGenNode implements AbstractNode {
    private texturePath!: string;

    async childQuestion(): Promise<void> {
        await this.listenTexturePath();
    }

    private async listenTexturePath(): Promise<void> {
        this.texturePath = await listenInput('テクスチャのパス', v => pathValidater(v, 'パスはitem/又はblock/から始まる必要があります。'));
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        const path = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(path, this.texturePath);
    }
}