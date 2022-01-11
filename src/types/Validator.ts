import { isVanillaItem } from './VanillaItemData';

export type Validator = (value: string) => Thenable<string | undefined> | string | undefined;

export function intValidator(str: string, mes: string): undefined | string {
    return /^[1-9][0-9]*$/.test(str) && Number.parseInt(str) <= 2147483647 ? undefined : mes;
}

export async function itemValidator(str: string, mes: string, version: string): Promise<undefined | string> {
    return await isVanillaItem(str, version) ? undefined : mes;
}

export function parentValidator(str: string, baseItem?: string): undefined | string {
    if (!/^(item|block)\/.*$/.test(str)) return 'parentはitem/又はblock/から始まる必要があります。';
    if (baseItem && str === `item/${baseItem}`) return 'parentに自身を指定することはできません。';
    return undefined;
}