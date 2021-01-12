import path from 'path';
import { GeneratorContext } from '../types/Context';
import { Model } from '../types/Model';
import { ThreeDimension } from '../types/ThreeDimension';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { readFile } from '../util/file';

export class Single3DGenNode extends ThreeDimension {
    async childQuestion(): Promise<void> {
        await this.listenModelFile();
        await this.listenTextureFiles();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        const modelPath = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        const modelData: Model = JSON.parse(await readFile(this.modelUri));
        const texUri = (name: string) =>
            makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}/${name}`));

        for (const tex of Object.keys(modelData.textures ?? {})) {
            const lastStr = modelData.textures![tex].split(/(\/|\\)/).pop();

            if (this.texturePngs.some(png => path.basename(png.fsPath, '.png') === lastStr))
                modelData.textures![tex] = `item/${injectPath(ctx.interjectFolder, `${ctx.id}/${lastStr}`)}`;
        }

        await createModel(modelPath, modelData);
        this.texturePngs.forEach(async png => await applyTexture(texUri(path.basename(png.fsPath)), png));
    }
}