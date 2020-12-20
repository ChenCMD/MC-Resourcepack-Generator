import { commands, Disposable, ExtensionContext, Uri, window } from 'vscode';
import { AnimationMcmeta, createAnimationMcmeta, getInterpolateMap } from './types/AnimationMcMeta';
import { GenerateError, UserCancelledError } from './types/Error';
import { getGenTypeMap } from './types/GenerateType';
import { createQuickPickItemHasIds } from './types/QuickPickItemHasId';
import { intValidater, itemValidater, pathValidater } from './types/Validater';
import { applyTexture, createModel, fixPath, isResourcepackRoot, writeBaseModel } from './util/common';
import { listenInput, listenDir, listenPickItem, ListenDirOption, showError } from './util/vscodeWrapper';

export const codeConsole = window.createOutputChannel('TSB Resourcepack Generator');

export function activate(context: ExtensionContext): void {

    const disposable: Disposable[] = [];

    disposable.push(commands.registerCommand('tsb-resource-pack-generator.gen', run));

    context.subscriptions.push(...disposable);
}

export function deactivate(): void { }

async function run() {
    try {
        // ディレクトリ
        const dir = await listenDir('リソースパックフォルダを選択', '選択');
        if (!await isResourcepackRoot(dir.fsPath)) throw new GenerateError('選択したディレクトリはリソースパックフォルダではありません。');
        // 生成タイプ
        const genType = await listenPickItem('生成タイプを選択してください', createQuickPickItemHasIds(getGenTypeMap()), false);
        // MCDのID
        const id = Number.parseInt(await listenInput('CustomModelDataのID', v => intValidater(v, '有効な数値を入力してください')));
        // 元となるアイテム
        const baseItem = await listenInput('元となるアイテム', v => itemValidater(v, `「${v}」は有効なItemIDではありません。`));
        // それぞれの処理
        let texPath = `item/sacred_treasure/${id}`, texture: Uri | undefined, animCfg: AnimationMcmeta | undefined;
        if (genType.id === 'vanilla')
            texPath = await listenInput('テクスチャのパス', v => pathValidater(v, 'パスはitem/又はblock/から始まる必要があります。'));

        if (genType.id === 'single')
            texture = await listenDir('テクスチャファイルを選択', '選択', getOption(false));

        if (genType.id === 'animation') {
            texture = await listenDir('テクスチャファイルを選択', '選択', getOption(/* true */ false));
            // TODO png連結
            animCfg = createAnimationMcmeta(
                await listenPickItem('フレーム間補完を有効にしますか？', createQuickPickItemHasIds(getInterpolateMap()), false),
                await listenInput('フレームの推移速度', v => intValidater(v, '有効な数値を入力してください'))
            );
        }

        await writeBaseModel(fixPath(dir, 'models', `${baseItem}.json`), baseItem, id);
        await createModel(fixPath(dir, 'models', `sacred_treasure/${id}.json`), texPath!);
        if (genType.id !== 'vanilla') await applyTexture(fixPath(dir, 'textures', `sacred_treasure/${id}.png`), texture!, animCfg);
    } catch (e) {
        if (e instanceof UserCancelledError) return;
        if (e instanceof Error) showError(e.message);
        else showError(e.toString());
        codeConsole.appendLine(e.stack ?? e.toString());
    }
}

function getOption(canSelectMany: false): ListenDirOption & { canSelectMany: false };
function getOption(canSelectMany: true): ListenDirOption & { canSelectMany: true };
function getOption(canSelectMany: boolean): ListenDirOption {
    return { canSelectFiles: true, canSelectFolders: false, canSelectMany, filters: { 'png': ['png'] } };
}