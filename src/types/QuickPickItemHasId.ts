import { QuickPickItem } from 'vscode';

export interface QuickPickItemHasId<T extends string> extends QuickPickItem {
    id: T
}

export function createQuickPickItemHasIds<T extends string>(map: Map<T, string>): QuickPickItemHasId<T>[] {
    const messages: QuickPickItemHasId<T>[] = [];
    for (const id of map.keys())
        messages.push({ label: map.get(id)!, id });
    return messages;
}