import { AnimationMcmeta, createAnimationMcmeta, getInterpolateMap } from '../types/AnimationMcmeta';
import { GeneratorContext } from '../types/Context';
import { createQuickPickItemHasIds } from '../types/QuickPickItemHasId';
import { intValidater, pathValidater } from '../types/Validater';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { listenPickItem, listenInput, getOption, listenDir } from '../util/vscodeWrapper';
import { Uri, workspace } from 'vscode';
import sharp from 'sharp';
import { AbstractNode } from '../types/AbstractNode';


export class Animated2DGenNode implements AbstractNode {
    private parent!: string;
    private textureUris!: Uri[];
    private animSetting!: AnimationMcmeta;

    async childQuestion(): Promise<void> {
        this.parent = await this.listenParentPath();
        this.textureUris = await this.listenTextureFile();
        this.animSetting = await this.listenAnimationSetting();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        // modelファイルの出力
        const modelUri = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(modelUri, this.parent, `item/${injectPath(ctx.interjectFolder, ctx.id.toString())}`);

        // テクスチャを結合してglobalStorageに書き出し
        const base = sharp(this.textureUris[0].fsPath);
        const height = (await base.metadata()).height!;

        base.extend({ top: 0, bottom: height * (this.textureUris.length - 1), left: 0, right: 0 });
        base.composite(this.textureUris.slice(1).map((tex, i) => ({ input: tex.fsPath, top: (i + 1) * height, left: 0 })));

        await base.png().toFile(ctx.globalStorageUri.fsPath);
        // textureファイルの出力
        const texUri = makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}.png`));
        await applyTexture(texUri, ctx.globalStorageUri, this.animSetting);
        // 要らないファイル消す
        await workspace.fs.delete(ctx.globalStorageUri);
    }

    private async listenParentPath(): Promise<string> {
        return await listenInput('parent', v => pathValidater(v, 'parentはitem/又はblock/から始まる必要があります。'));
    }

    private async listenTextureFile(): Promise<Uri[]> {
        const textures = await listenDir('テクスチャファイルを選択', '選択', getOption(true));
        return textures.sort((a, b) => a.fsPath > b.fsPath ? 1 : -1);
    }

    private async listenAnimationSetting(): Promise<AnimationMcmeta> {
        const interpolate = await listenPickItem('フレーム間補完を有効にしますか？', createQuickPickItemHasIds(getInterpolateMap()), false);
        const frametime = await listenInput('フレームの推移速度', v => intValidater(v, '有効な数値を入力してください'));
        return createAnimationMcmeta(interpolate, frametime);
    }
}