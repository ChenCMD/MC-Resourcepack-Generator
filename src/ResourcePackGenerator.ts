import { Uri } from 'vscode';
import { AbstractNode } from './types/AbstractNode';
import { Config } from './types/Config';
import { GeneratorContext } from './types/Context';
import { GenerateError } from './types/Error';
import { getGenTypeMap } from './types/GenerateType';
import { createQuickPickItemHasNodes } from './types/QuickPickItemHasNode';
import { intValidater, itemValidater } from './types/Validater';
import { injectPath, isResourcepackRoot, makeUri, writeBaseModel } from './util/common';
import { listenDir, listenInput, listenPickItem } from './util/vscodeWrapper';

export class ResourcePackGenerator {
    private generateDirectory!: Uri;
    private generateNode!: AbstractNode;
    private id!: number;
    private baseItem!: string;

    private readonly interjectFolder: string;

    constructor(config: Config) {
        this.interjectFolder = config.customizeInjectFolder;
    }

    async run(): Promise<void> {
        // 生成するディレクトリ
        await this.listenDir();
        // 元となるアイテム
        await this.listenBaseItem();
        // CustomModelDataのID
        await this.listenID();
        // 生成する種類
        await this.listenGenType();
        // 生成する種類について処理の分岐
        await this.generateNode.childQuestion();
        // 生成
        await this.generate();
    }

    private async listenDir(): Promise<void> {
        const res = await listenDir('リソースパックフォルダを選択', '選択');
        if (!await isResourcepackRoot(res.fsPath)) throw new GenerateError('選択したディレクトリはリソースパックフォルダじゃないよ。');
        this.generateDirectory = res;
    }

    private async listenGenType(): Promise<void> {
        const res = await listenPickItem('生成タイプを選択してください', createQuickPickItemHasNodes(getGenTypeMap()), false);
        this.generateNode = res.node;
    }

    private async listenID(): Promise<void> {
        const res = await listenInput('CustomModelDataのID', v => intValidater(v, '有効な数値を入力してください'));
        this.id = Number.parseInt(res);
    }

    private async listenBaseItem(): Promise<void> {
        this.baseItem = await listenInput('元となるアイテムのitemID', v => itemValidater(v, `「${v}」は有効なItemIDではありません。`));
    }

    private async generate(): Promise<void> {
        const dir = makeUri(this.generateDirectory, 'models', `${this.baseItem}.json`);
        await writeBaseModel(dir, this.baseItem, this.id, injectPath(this.interjectFolder, this.id.toString()));
        const ctx: GeneratorContext = {
            baseItem: this.baseItem,
            generateDirectory: this.generateDirectory,
            id: this.id,
            interjectFolder: this.interjectFolder
        };
        this.generateNode.generate(ctx);
    }
}