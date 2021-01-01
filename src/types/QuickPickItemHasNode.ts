import { QuickPickItem } from 'vscode';
import { AbstractNode } from './AbstractNode';

export interface QuickPickItemHasNode<T extends AbstractNode> extends QuickPickItem {
    node: T
}

export function createQuickPickItemHasNodes<T extends AbstractNode>(map: Map<string, T>): QuickPickItemHasNode<T>[] {
    const messages: QuickPickItemHasNode<T>[] = [];
    for (const label of map.keys())
        messages.push({ label, node: map.get(label)! });
    return messages;
}