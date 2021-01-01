import { commands, Disposable, ExtensionContext, window, workspace } from 'vscode';
import { ResourcePackGenerator } from './ResourcePackGenerator';
import { constructConfig } from './types/Config';
import { UserCancelledError } from './types/Error';
import { showError, showInfo } from './util/vscodeWrapper';

export const codeConsole = window.createOutputChannel('TSB Resourcepack Generator');

export function activate(context: ExtensionContext): void {

    const disposable: Disposable[] = [];

    disposable.push(commands.registerCommand('tsb-resource-pack-generator.gen', run));

    context.subscriptions.push(...disposable);
}

export function deactivate(): void { }

async function run() {
    try {
        const config = constructConfig(workspace.getConfiguration('mcrg'));
        // Generator
        const generator = new ResourcePackGenerator(config);
        // 生成するディレクトリ
        await generator.listenDir();
        // 生成する種類
        await generator.listenGenType();
        // CustomModelDataのID
        await generator.listenCustomModelDataID();
        // 元となるアイテム
        await generator.listenBaseItem();
        // 生成する種類について処理の分岐
        switch (generator.getGenType()) {
            case 'vanilla':
                // 参照するバニラテクスチャのパス
                await generator.listenTexturePath();

                break;
            case 'single':
                // テクスチャファイル
                await generator.listenTextureFile();

                break;
            case 'animation':
                // テクスチャファイル
                await generator.listenTextureFile();
                // アニメーションテクスチャの設定
                await generator.listenAnimationSetting();

                break;
        }
        // 生成
        await generator.generate();
        // 終了メッセージ
        showInfo('生成したよ！');
    } catch (e) {
        if (e instanceof UserCancelledError) return;
        if (e instanceof Error) showError(e.message);
        else showError(e.toString());
        codeConsole.appendLine(e.stack ?? e.toString());
    }
}
