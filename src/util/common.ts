import https from 'https';
import path from 'path';
import { Uri } from 'vscode';
import { AnimationMcmeta } from '../types/AnimationMcMeta';
import { DownloadTimeOutError, GenerateError } from '../types/Error';
import { createModelTemplate, Model } from '../types/Model';
import { copyFile, createFile, pathAccessible, readFile, writeFile } from './file';

export async function isResourcepackRoot(testPath: string): Promise<boolean> {
    return await pathAccessible(path.join(testPath, 'pack.mcmeta')) && await pathAccessible(path.join(testPath, 'assets'));
}

export function fixPath(dir: Uri, type: string, ...itemAfter: string[]): Uri {
    return Uri.joinPath(dir, 'assets/minecraft', type, 'item', ...itemAfter);
}

export async function writeBaseModel(dir: Uri, baseItem: string, cmdID: number): Promise<void> {
    const model: Model = await pathAccessible(dir) ? JSON.parse(await readFile(dir)) : createModelTemplate(baseItem);
    if (!model.overrides) model.overrides = [];
    model.overrides.forEach(v => {
        if (!v.predicate) return;
        if (v.predicate.custom_model_data === cmdID)
            v.model = `item/sacred_treasure/${cmdID}`;
    });
    writeFile(dir, JSON.stringify(model, undefined, ' '.repeat(4)));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createModel(modelUri: Uri, texPathOrModel: string | { [key: string]: any }): Promise<void> {
    if (await pathAccessible(modelUri)) throw new GenerateError(`${modelUri.fsPath} はすでに生成されています。`);
    const content = typeof texPathOrModel !== 'string' ? texPathOrModel : {
        parent: 'item/generated',
        textures: {
            layer0: texPathOrModel
        }
    };
    await createFile(modelUri, JSON.stringify(content, undefined, ' '.repeat(4)));
}

export async function applyTexture(dir: Uri, texture: Uri, animSetting?: AnimationMcmeta): Promise<void> {
    await copyFile(texture, dir);
    if (animSetting)
        await createFile(Uri.file(path.join(`${dir.fsPath}.mcmeta`)), JSON.stringify(animSetting));
}

export async function download(url: string): Promise<string> {
    return await Promise.race<string>([
        new Promise<string>((resolve, reject) => {
            https.get(url, res => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('error', reject);
                res.on('end', () => resolve(body));
            }).end();
        }),
        setTimeOut(7000)
    ]);
}

export async function setTimeOut(milisec: number): Promise<never> {
    return await new Promise(
        (_, reject) => setTimeout(() => reject(new DownloadTimeOutError('ダウンロードの要求がタイムアウトしました。')), milisec)
    );
}