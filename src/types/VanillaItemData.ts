import { codeConsole } from '../extension';
import { download } from '../util/common';
import { showError } from '../util/vscodeWrapper';

interface DataObject {
    values: string[]
}

const vanillaItemData = new Map<string, string[] | undefined>();

export async function isVanillaItem(str: string, version?: string): Promise<boolean> {
    const res = await getVanillaItems(version);
    return !res || res.includes(str);
}

async function getVanillaItems(version = '1.16.4'): Promise<string[] | undefined> {
    await loadVanillaItems(version);
    return vanillaItemData.get(version);
}

export async function loadVanillaItems(version = '1.16.4'): Promise<void> {
    // すでにDLしてる場合
    if (vanillaItemData.has(version)) return;
    try {
        const procJsonString: DataObject = JSON.parse(await download(getURL(version)));
        const items = procJsonString.values.map(v => v.slice('minecraft:'.length));
        vanillaItemData.set(version, items);
    } catch (e) {
        if (e instanceof Error) showError(e.message);
        else showError(e.toString());
        codeConsole.appendLine(e.stack ?? e.toString());
        vanillaItemData.set(version, undefined);
    }
}

function getURL(version: string) {
    return `https://raw.githubusercontent.com/Arcensoth/mcdata/${version}/processed/reports/registries/item/data.min.json`;
}