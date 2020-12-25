import { Uri } from 'vscode';
import { AnimationMcmeta, createAnimationMcmeta, getInterpolateMap } from './types/AnimationMcMeta';
import { GenerateError } from './types/Error';
import { GenerateType, getGenTypeMap } from './types/GenerateType';
import { createQuickPickItemHasIds } from './types/QuickPickItemHasId';
import { intValidater, itemValidater, pathValidater } from './types/Validater';
import { applyTexture, createModel, fixPath, isResourcepackRoot, writeBaseModel } from './util/common';
import { listenDir, ListenDirOption, listenInput, listenPickItem } from './util/vscodeWrapper';

export class ResourcePackGenerator {
    private generateDirectory?: Uri;
    private generateType?: GenerateType;
    private cmdID?: number;
    private baseItem?: string;

    private texturePath?: string;
    private texturePng?: Uri;
    private animSetting?: AnimationMcmeta;

    constructor(private readonly interjectFolder?: string) { }

    async listenDir(): Promise<void> {
        const res = await listenDir('リソースパックフォルダを選択', '選択');
        if (!await isResourcepackRoot(res.fsPath)) throw new GenerateError('選択したディレクトリはリソースパックフォルダじゃないよ。');
        this.generateDirectory = res;
    }

    async listenGenType(): Promise<void> {
        const res = await listenPickItem('生成タイプを選択してください', createQuickPickItemHasIds(getGenTypeMap()), false);
        this.generateType = res.id;
    }

    async listenCustomModelDataID(): Promise<void> {
        const res = await listenInput('CustomModelDataのID', v => intValidater(v, '有効な数値を入力してください'));
        this.cmdID = Number.parseInt(res);
    }

    async listenBaseItem(): Promise<void> {
        this.baseItem = await listenInput('元となるアイテムのitemID', v => itemValidater(v, `「${v}」は有効なItemIDではありません。`));
    }

    async listenTexturePath(): Promise<void> {
        this.texturePath = await listenInput('テクスチャのパス', v => pathValidater(v, 'パスはitem/又はblock/から始まる必要があります。'));
    }

    async listenTextureFile(): Promise<void> {
        this.texturePng = await listenDir('テクスチャファイルを選択', '選択', ResourcePackGenerator.getOption(false));
    }

    async listenAnimationSetting(): Promise<void> {
        const interpolate = await listenPickItem('フレーム間補完を有効にしますか？', createQuickPickItemHasIds(getInterpolateMap()), false);
        const frametime = await listenInput('フレームの推移速度', v => intValidater(v, '有効な数値を入力してください'));
        this.animSetting = createAnimationMcmeta(interpolate, frametime);
    }

    async generate(): Promise<void> {
        if (!(
            this.generateDirectory
            && this.generateType
            && this.cmdID
            && this.baseItem
            && ((this.generateType === 'vanilla' && this.texturePath) || (this.generateType !== 'vanilla' && this.texturePng))
        ))
            return;

        const injectPath = (path: string) => this.interjectFolder ? `${this.interjectFolder}/${path}` : path;
        const makePath = (category: string, ...itemAfter: string[]) => fixPath(this.generateDirectory!, category, ...itemAfter);

        const fallbackTexturePath = `item/${injectPath(this.cmdID.toString())}`;

        await writeBaseModel(makePath('models', `${this.baseItem}.json`), this.baseItem, this.cmdID);
        await createModel(makePath('models', injectPath(`${this.cmdID}.json`)), this.texturePath || fallbackTexturePath);
        if (this.generateType !== 'vanilla')
            await applyTexture(makePath('textures', injectPath(`${this.cmdID}.png`)), this.texturePng!, this.animSetting);
    }

    getGenType(): GenerateType | undefined {
        return this.generateType;
    }

    private static getOption(canSelectMany: false): ListenDirOption & { canSelectMany: false };
    private static getOption(canSelectMany: true): ListenDirOption & { canSelectMany: true };
    private static getOption(canSelectMany: boolean): ListenDirOption {
        return { canSelectFiles: true, canSelectFolders: false, canSelectMany, filters: { 'png': ['png'] } };
    }
}