import { GeneratorContext } from '../types/Context';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { QuickPickItem, Uri } from 'vscode';
import { listenDir, getOption } from '../util/vscodeWrapper';
import { AbstractNode } from '../types/AbstractNode';

export class NonAnimated2DGenNode extends AbstractNode {
    private parent!: string;
    private textureUri!: Uri;

    async childQuestion(parentElement: QuickPickItem[]): Promise<void> {
        this.parent = await this.listenParentPath(parentElement);
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

    private async listenTextureFile(): Promise<Uri> {
        return await listenDir('テクスチャファイルを選択', '選択', getOption(false));
    }
}