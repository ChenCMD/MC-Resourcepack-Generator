import { AnimationMcmeta, createAnimationMcmeta, getInterpolateMap } from '../types/AnimationMcMeta';
import { GeneratorContext } from '../types/Context';
import { createQuickPickItemHasIds } from '../types/QuickPickItemHasId';
import { intValidater } from '../types/Validater';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { listenPickItem, listenInput, getOption, listenDir } from '../util/vscodeWrapper';
import { Animation } from '../types/Animation';
import { TwoDimension } from '../types/TwoDimension';
import { Uri } from 'vscode';


export class Animated2DGenNode implements TwoDimension, Animation {
    textureUri!: Uri;
    animSetting!: AnimationMcmeta;

    async childQuestion(): Promise<void> {
        this.textureUri = await this.listenTextureFile();
        this.animSetting = await this.listenAnimationSetting();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        const modelUri = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(modelUri, `item/${injectPath(ctx.interjectFolder, ctx.id.toString())}`);

        const texUri = makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}.png`));
        await applyTexture(texUri, this.textureUri, this.animSetting);
    }

    async listenTextureFile(): Promise<Uri> {
        const textures = await listenDir('テクスチャファイルを選択', '選択', getOption(true));
        return textures[0];
    }

    async listenAnimationSetting(): Promise<AnimationMcmeta> {
        const interpolate = await listenPickItem('フレーム間補完を有効にしますか？', createQuickPickItemHasIds(getInterpolateMap()), false);
        const frametime = await listenInput('フレームの推移速度', v => intValidater(v, '有効な数値を入力してください'));
        return createAnimationMcmeta(interpolate, frametime);
    }
}