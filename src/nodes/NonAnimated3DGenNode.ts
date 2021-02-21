import path from 'path';
import { Uri } from 'vscode';
import { AbstractNode } from '../types/AbstractNode';
import { createExtendQuickPickItems } from '../types/ExtendsQuickPickItem';
import { Model } from '../types/Model';
import { applyTexture, createModel } from '../util/common';
import { readFile } from '../util/file';
import { listenDir, getOption, listenPickItem } from '../util/vscodeWrapper';

export class NonAnimated3DGenNode extends AbstractNode {
    private _modelUri!: Uri;
    private _textureUris!: Uri[];

    async childQuestion(): Promise<void> {
        this._modelUri = await this.listenModelFile();
        this._textureUris = await this.listenTextureFiles();
    }

    async generate(): Promise<void> {
        super.generate();
        const modelData: Model = JSON.parse(await readFile(this._modelUri));

        // modelファイルのtexture名書き換え
        for (const tex of Object.keys(modelData.textures ?? {})) {
            const lastStr = modelData.textures![tex].split('/').pop();

            if (this._textureUris.some(png => path.basename(png.fsPath, '.png') === lastStr))
                modelData.textures![tex] = this.getTexturePath(lastStr);
        }

        // modelファイルの出力
        await createModel(this.getChildModelUri(), modelData);
        // textureファイル
        this._textureUris.forEach(async png => await applyTexture(this.getTextureUri(path.basename(png.fsPath)), png));
    }

    private async listenModelFile(): Promise<Uri> {
        return await listenDir('モデルファイルを選択', '選択', getOption(false, { filter: 'model' }));
    }

    private async listenTextureFiles(): Promise<Uri[]> {
        const ansMap = new Map<string, boolean>();
        ansMap.set('テクスチャファイルを選択する', true);
        ansMap.set('テクスチャファイルを選択しない', false);

        const selectTexture = await listenPickItem('テクスチャファイルを選択しますか？', createExtendQuickPickItems(ansMap), false);
        if (!selectTexture.extend) return [];
        return await listenDir('テクスチャファイルを選択', '選択', getOption(true, { defaultUri: Uri.joinPath(this._modelUri, '..') }));
    }
}