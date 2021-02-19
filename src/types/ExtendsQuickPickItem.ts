import { QuickPickItem } from 'vscode';

export type ExtendQuickPickItem<T> = QuickPickItem & { extend: T };

export function createExtendQuickPickItems<T>(map: Map<string, T>): ExtendQuickPickItem<T>[] {
    const messages: ExtendQuickPickItem<T>[] = [];
    for (const label of map.keys()) messages.push({ label, extend: map.get(label)! });
    return messages;
}

export type ParentItem = (QuickPickItem & { hasTextures?: boolean });