import { GeneratorContext } from '../types/Context';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { Uri } from 'vscode';
import { listenDir, getOption, listenInput } from '../util/vscodeWrapper';
import { AbstractNode } from '../types/AbstractNode';
import { pathValidater } from '../types/Validater';

export class NonAnimated2DGenNode implements AbstractNode {
    parent!: string;
    textureUri!: Uri;

    async childQuestion(): Promise<void> {
        this.parent = await this.listenParentPath();
        this.textureUri = await this.listenTextureFile();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        // modelファイルの出力
        const modelUri = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(modelUri, this.parent, `item/${injectPath(ctx.interjectFolder, ctx.id.toString())}`);

        // textureファイル
        const texUri = makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}.png`));
        await applyTexture(texUri, this.textureUri);
    }

    async listenParentPath(): Promise<string> {
        return await listenInput('parent', v => pathValidater(v, 'parentはitem/又はblock/から始まる必要があります。'));
    }

    async listenTextureFile(): Promise<Uri> {
        return await listenDir('テクスチャファイルを選択', '選択', getOption(false));
    }
}