import { isVanillaItem } from './VanillaItemData';

type Validater = (str: string, mes: string) => undefined | string | Promise<undefined | string>;

export const intValidater: Validater = (str, mes) => /^[1-9][0-9]*$/.test(str) && Number.parseInt(str) <= 2147483647 ? undefined : mes;
export const itemValidater: Validater = async (str, mes) => await isVanillaItem(str, '1.16.2') ? undefined : mes;
export const pathValidater: Validater = (str, mes) => (/^(item|block)\/.*$/.test(str)) ? undefined : mes;