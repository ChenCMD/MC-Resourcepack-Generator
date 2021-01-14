import { commands, Disposable, ExtensionContext, window, workspace } from 'vscode';
import { ResourcePackGenerator } from './ResourcePackGenerator';
import { constructConfig } from './types/Config';
import { UserCancelledError } from './types/Error';
import { showError, showInfo } from './util/vscodeWrapper';

export const codeConsole = window.createOutputChannel('MC Resourcepack Generator');

export function activate(context: ExtensionContext): void {

    const disposable: Disposable[] = [];

    disposable.push(commands.registerCommand('mc-resourcepack-generator.gen', () => run(context)));

    context.subscriptions.push(...disposable);
}

export function deactivate(): void { }

async function run(context: ExtensionContext) {
    try {
        const config = constructConfig(workspace.getConfiguration('mcrg'));
        // Generator
        const generator = new ResourcePackGenerator(config, context.globalStorageUri);
        // 実行
        await generator.run();
        // 終了メッセージ
        showInfo('生成したよ！');
    } catch (e) {
        if (e instanceof UserCancelledError) return;
        if (e instanceof Error) showError(e.message);
        else showError(e.toString());
        codeConsole.appendLine(e.stack ?? e.toString());
    }
}
