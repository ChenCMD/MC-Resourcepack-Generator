import { GeneratorContext } from '../types/Context';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { TwoDimension } from '../types/TwoDimension';
import { NonAnimation } from '../types/NonAnimation';
import { Uri } from 'vscode';
import { listenDir, getOption } from '../util/vscodeWrapper';

export class NonAnimated2DGenNode implements TwoDimension, NonAnimation {
    textureUri!: Uri;

    async childQuestion(): Promise<void> {
        this.textureUri = await this.listenTextureFile();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        const modelUri = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(modelUri, `item/${injectPath(ctx.interjectFolder, ctx.id.toString())}`);

        const texUri = makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}.png`));
        await applyTexture(texUri, this.textureUri);
    }

    async listenTextureFile(): Promise<Uri> {
        return await listenDir('テクスチャファイルを選択', '選択', getOption(false));
    }
}