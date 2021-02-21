import { AnimationMcmeta, createAnimationMcmeta, getInterpolateMap } from '../types/AnimationMcmeta';
import { intValidater } from '../types/Validater';
import { applyTexture, createModel } from '../util/common';
import { listenPickItem, listenInput, getOption, listenDir } from '../util/vscodeWrapper';
import { Uri } from 'vscode';
import { AbstractNode } from '../types/AbstractNode';
import { createExtendQuickPickItems } from '../types/ExtendsQuickPickItem';
import { ParentItem } from '../types/ParentItem';
import Jimp from 'jimp';


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
        const image = await Jimp.read(this._textureUris[0].fsPath);
        const height = image.getHeight();

        image.contain(image.getWidth(), height * this._textureUris.length, Jimp.VERTICAL_ALIGN_TOP);
        for (const [i, tex] of this._textureUris.slice(1).entries()) image.composite(await Jimp.read(tex.fsPath), 0, (i + 1) * height);
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