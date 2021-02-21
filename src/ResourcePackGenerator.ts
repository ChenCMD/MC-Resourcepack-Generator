import { Uri } from 'vscode';
import { Config } from './types/Config';
import { GenerateError } from './types/Error';
import { createExtendQuickPickItems } from './types/ExtendsQuickPickItem';
import { ParentItem } from './types/ParentItem';
import { getGenTypeMap } from './types/GenerateType';
import { intValidater, itemValidater } from './types/Validater';
import { isResourcepackRoot } from './util/common';
import { listenDir, listenInput, listenPickItem } from './util/vscodeWrapper';
import { GenNodes } from './nodes';
import { GeneratorContext } from './types/Context';

export class ResourcePackGenerator {
    private readonly _injectFolder: string;
    private readonly _version: string;
    private readonly _parentElements: ParentItem[];

    constructor(config: Config) {
        this._injectFolder = config.customizeInjectFolder;
        this._version = config.version;
        this._parentElements = config.parentElements;
    }

    async run(): Promise<void> {
        // 生成するディレクトリ
        const genDir = await this._listenDir();
        // 元となるアイテム
        const baseItem = await this._listenBaseItem();
        // CustomModelDataのID
        const id = await this._listenID();
        const ctx: GeneratorContext = {
            parentElements: this._parentElements,
            genDir,
            baseItem,
            id,
            injectFolder: this._injectFolder
        };
        // 生成する種類
        const genNode = new (await this._listenGenType())(ctx);
        // 生成する種類について処理の分岐
        await genNode.childQuestion(this._parentElements);
        // 生成
        await genNode.generate();
    }

    private async _listenDir(): Promise<Uri> {
        const res = await listenDir('リソースパックフォルダを選択', '選択');
        if (!await isResourcepackRoot(res.fsPath)) throw new GenerateError('選択したディレクトリはリソースパックフォルダじゃないよ。');
        return res;
    }

    private async _listenGenType(): Promise<GenNodes> {
        const res = await listenPickItem('生成タイプを選択してください', createExtendQuickPickItems(getGenTypeMap()), false);
        return res.extend;
    }

    private async _listenID(): Promise<number> {
        const res = await listenInput('CustomModelDataのID', v => intValidater(v, '有効な数値を入力してください'));
        return Number.parseInt(res);
    }

    private async _listenBaseItem(): Promise<string> {
        return await listenInput('元となるアイテムのitemID', v => itemValidater(v, `「${v}」は有効なItemIDではありません。`, this._version));
    }
}