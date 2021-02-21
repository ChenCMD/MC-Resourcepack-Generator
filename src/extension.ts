import { commands, Disposable, ExtensionContext, window, workspace } from 'vscode';
import { ResourcePackGenerator } from './ResourcePackGenerator';
import { constructConfig } from './types/Config';
import { UserCancelledError } from './types/Error';
import { showError, showInfo } from './util/vscodeWrapper';

export const codeConsole = window.createOutputChannel('MC Resourcepack Generator');

export function activate(context: ExtensionContext): void {

    const disposable: Disposable[] = [];

    disposable.push(commands.registerCommand('mc-resourcepack-generator.gen', run));

    context.subscriptions.push(...disposable);
}

export function deactivate(): void { }

async function run() {
    try {
        const config = constructConfig(workspace.getConfiguration('mcrg'));
        // Generator
        const generator = new ResourcePackGenerator(config);
        // 実行
        await generator.run();
        // 終了メッセージ
        showInfo('生成したよ！');
    } catch (e) {
        if (e instanceof UserCancelledError) return;
        if (e instanceof Error) showError(e.message);
        else showError(`予期しないエラーがが発生しました。以下の内容を作者に教えていただけると解決できる場合があります。\n${e.toString()}`);
        codeConsole.appendLine(e.stack ?? e.toString());
    }
}
