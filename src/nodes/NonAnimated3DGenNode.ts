import path from 'path';
import { Uri } from 'vscode';
import { AbstractNode } from '../types/AbstractNode';
import { GeneratorContext } from '../types/Context';
import { Model } from '../types/Model';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { readFile } from '../util/file';
import { listenDir, getOption } from '../util/vscodeWrapper';

export class NonAnimated3DGenNode extends AbstractNode {
    private modelUri!: Uri;
    private textureUris!: Uri[];

    async childQuestion(): Promise<void> {
        this.modelUri = await this.listenModelFile();
        this.textureUris = await this.listenTextureFiles();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        const modelPath = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        const modelData: Model = JSON.parse(await readFile(this.modelUri));
        const texUri = (name: string) =>
            makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}/${name}`));

        // modelファイルのtexture名書き換え
        for (const tex of Object.keys(modelData.textures ?? {})) {
            const lastStr = modelData.textures![tex].split(/(\/|\\)/).pop();

            if (this.textureUris.some(png => path.basename(png.fsPath, '.png') === lastStr))
                modelData.textures![tex] = `item/${injectPath(ctx.interjectFolder, `${ctx.id}/${lastStr}`)}`;
        }

        // modelファイルの出力
        await createModel(modelPath, modelData);
        // textureファイル
        this.textureUris.forEach(async png => await applyTexture(texUri(path.basename(png.fsPath)), png));
    }

    private async listenModelFile(): Promise<Uri> {
        return await listenDir('モデルファイルを選択', '選択', getOption(false, { filter: 'model' }));
    }

    private async listenTextureFiles(): Promise<Uri[]> {
        return await listenDir('テクスチャファイルを選択', '選択', getOption(true, { defaultUri: this.modelUri }));
    }
}