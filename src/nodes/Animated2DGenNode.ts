import { AnimationMcmeta, createAnimationMcmeta, getInterpolateMap } from '../types/AnimationMcmeta';
import { intValidater } from '../types/Validater';
import { applyTexture, createModel } from '../util/common';
import { listenPickItem, listenInput, getOption, listenDir } from '../util/vscodeWrapper';
import { Uri } from 'vscode';
import sharp from 'sharp';
import { AbstractNode } from '../types/AbstractNode';
import { createExtendQuickPickItems } from '../types/ExtendsQuickPickItem';
import { ParentItem } from '../types/ParentItem';


export class Animated2DGenNode extends AbstractNode {
    private _parent!: string;
    private _textureUris!: Uri[];
    private _animSetting!: AnimationMcmeta;

    async childQuestion(parentElement: ParentItem[]): Promise<void> {
        this._parent = await this.listenParentPath(parentElement);
        this._textureUris = await this.listenTextureFiles();
        this._animSetting = await this.listenAnimationSetting();
    }

    async generate(): Promise<void> {
        super.generate();
        // modelファイルの出力
        await createModel(this.getChildModelUri(), this._parent, this.getTexturePath());

        // テクスチャを結合してglobalStorageに書き出し
        const image = sharp(this._textureUris[0].fsPath);
        const height = (await image.metadata()).height!;

        image.extend({ top: 0, bottom: height * (this._textureUris.length - 1), left: 0, right: 0, background: '#00000000' });
        image.composite(this._textureUris.slice(1).map((tex, i) => ({ input: tex.fsPath, top: (i + 1) * height, left: 0 })));
        image.png();
        // textureファイルの出力
        await applyTexture(this.getTextureUri(), image, this._animSetting);
    }

    private async listenTextureFiles(): Promise<Uri[]> {
        const textures = await listenDir('テクスチャファイルを選択', '選択', getOption(true));
        return textures.sort((a, b) => a.fsPath > b.fsPath ? 1 : -1);
    }

    private async listenAnimationSetting(): Promise<AnimationMcmeta> {
        const interpolate = await listenPickItem('フレーム間補完を有効にしますか？', createExtendQuickPickItems(getInterpolateMap()), false);
        const frametime = await listenInput('フレームの推移速度', v => intValidater(v, '有効な数値を入力してください'));
        return createAnimationMcmeta(interpolate, frametime);
    }
}