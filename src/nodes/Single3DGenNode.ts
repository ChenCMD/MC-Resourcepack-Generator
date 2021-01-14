import path from 'path';
import { Uri } from 'vscode';
import { GeneratorContext } from '../types/Context';
import { Model } from '../types/Model';
import { NonAnimation } from '../types/NonAnimation';
import { ThreeDimension } from '../types/ThreeDimension';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { readFile } from '../util/file';
import { listenDir, getOption } from '../util/vscodeWrapper';

export class Single3DGenNode implements ThreeDimension, NonAnimation {
    modelUri!: Uri;
    textureUris!: Uri[];

    async childQuestion(): Promise<void> {
        this.modelUri = await this.listenModelFile();
        this.textureUris = await this.listenTextureFiles();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        const modelPath = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        const modelData: Model = JSON.parse(await readFile(this.modelUri));
        const texUri = (name: string) =>
            makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}/${name}`));

        for (const tex of Object.keys(modelData.textures ?? {})) {
            const lastStr = modelData.textures![tex].split(/(\/|\\)/).pop();

            if (this.textureUris.some(png => path.basename(png.fsPath, '.png') === lastStr))
                modelData.textures![tex] = `item/${injectPath(ctx.interjectFolder, `${ctx.id}/${lastStr}`)}`;
        }

        await createModel(modelPath, modelData);
        this.textureUris.forEach(async png => await applyTexture(texUri(path.basename(png.fsPath)), png));
    }

    async listenModelFile(): Promise<Uri> {
        return await listenDir('モデルファイルを選択', '選択', getOption(false, { filter: 'model' }));
    }

    async listenTextureFiles(): Promise<Uri[]> {
        return await listenDir('テクスチャファイルを選択', '選択', getOption(true, { defaultUri: this.modelUri }));
    }
}