import { AnimationMcmeta, createAnimationMcmeta, getInterpolateMap } from '../types/AnimationMcMeta';
import { GeneratorContext } from '../types/Context';
import { createQuickPickItemHasIds } from '../types/QuickPickItemHasId';
import { intValidater } from '../types/Validater';
import { applyTexture, createModel, injectPath, makeUri } from '../util/common';
import { listenPickItem, listenInput } from '../util/vscodeWrapper';
import { Animation } from '../types/Animation';
import { TwoDimension } from '../types/TwoDimension';


export class Animated2DGenNode extends TwoDimension implements Animation {
    async childQuestion(): Promise<void> {
        await this.listenTextureFile();
        await this.listenAnimationSetting();
    }

    async generate(ctx: GeneratorContext): Promise<void> {
        const modelPath = makeUri(ctx.generateDirectory, 'models', injectPath(ctx.interjectFolder, `${ctx.id}.json`));
        await createModel(modelPath, `item/${injectPath(ctx.interjectFolder, ctx.id.toString())}`);

        const texPath = makeUri(ctx.generateDirectory, 'textures', injectPath(ctx.interjectFolder, `${ctx.id}.png`));
        await applyTexture(texPath, this.texturePng, this.animSetting);
    }

    animSetting!: AnimationMcmeta;
    async listenAnimationSetting(): Promise<void> {
        const interpolate = await listenPickItem('フレーム間補完を有効にしますか？', createQuickPickItemHasIds(getInterpolateMap()), false);
        const frametime = await listenInput('フレームの推移速度', v => intValidater(v, '有効な数値を入力してください'));
        this.animSetting = createAnimationMcmeta(interpolate, frametime);
    }
}