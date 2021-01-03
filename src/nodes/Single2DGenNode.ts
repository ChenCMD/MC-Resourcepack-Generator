import { GeneratorContext } from '../types/Context';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { TwoDimension } from '../types/TwoDimension';

export class Single2DGenNode extends TwoDimension {
    async childQuestion(): Promise<void> {
        await this.listenTextureFile();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        const modelUri = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(modelUri, `item/${injectPath(ctx.interjectFolder, ctx.id.toString())}`);

        const texUri = makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}.png`));
        await applyTexture(texUri, this.texturePng);
    }
}