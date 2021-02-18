import { isVanillaItem } from './VanillaItemData';

export type Validater = (value: string) => Thenable<string | undefined> | string | undefined;
type MakeValidater = (str: string, mes: string) => undefined | string | Promise<undefined | string>;

export const intValidater: MakeValidater = (str, mes) => /^[1-9][0-9]*$/.test(str) && Number.parseInt(str) <= 2147483647 ? undefined : mes;
export const itemValidater: MakeValidater = async (str, mes) => await isVanillaItem(str, '1.16.2') ? undefined : mes;
export const pathValidater: MakeValidater = (str, mes) => (/^(item|block)\/.*$/.test(str)) ? undefined : mes;