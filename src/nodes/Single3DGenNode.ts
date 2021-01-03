import path from 'path';
import { GeneratorContext } from '../types/Context';
import { ThreeDimension } from '../types/ThreeDimension';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { readFile } from '../util/file';

export class Single2DGenNode extends ThreeDimension {
    async childQuestion(): Promise<void> {
        await this.listenModelFile();
        await this.listenTextureFiles();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        const modelPath = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(modelPath, JSON.parse(await readFile(this.modelUri)));

        const texUri = (name: string) =>
            makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}/${name}.png`));
        for (const png of this.texturePngs)
            await applyTexture(texUri(path.parse(png.fsPath).name), png);
    }
}