import https from 'https';
import path from 'path';
import { Uri } from 'vscode';
import { AnimationMcmeta } from '../types/AnimationMcmeta';
import { DownloadTimeOutError, GenerateError } from '../types/Error';
import { createModelTemplate, Model } from '../types/Model';
import { copyFile, createFile, pathAccessible, readFile, writeFile } from './file';

export async function isResourcepackRoot(testPath: string): Promise<boolean> {
    return await pathAccessible(path.join(testPath, 'pack.mcmeta')) && await pathAccessible(path.join(testPath, 'assets'));
}

// eslint-disable-next-line no-shadow
export function injectPath(interjectFolder: string, path: string): string {
    return interjectFolder ? `${interjectFolder}/${path}` : path;
}

export function makeUri(generateDirectory: Uri, category: string, ...itemAfter: string[]): Uri {
    return Uri.joinPath(generateDirectory, 'assets/minecraft', category, 'item', ...itemAfter);
}

export async function writeBaseModel(dir: Uri, baseItem: string, cmdID: number, texPath: string): Promise<void> {
    const model: Model = await pathAccessible(dir) ? JSON.parse(await readFile(dir)) : createModelTemplate(baseItem);
    if (!model.overrides) model.overrides = [];
    model.overrides.forEach(v => {
        if (!v.predicate) return;
        if (v.predicate.custom_model_data === cmdID) v.model = `item/${texPath}`;
    });
    writeFile(dir, JSON.stringify(model, undefined, ' '.repeat(4)));
}

export async function createModel(modelUri: Uri, parent: string, texture?: string): Promise<void>;
export async function createModel(modelUri: Uri, model: Model): Promise<void>;
export async function createModel(modelUri: Uri, parentOrModel: string | Model, texture?: string): Promise<void> {
    if (await pathAccessible(modelUri)) throw new GenerateError(`${modelUri.fsPath} はすでに生成されています。`);
    const model: Model = typeof parentOrModel === 'object' ? parentOrModel : { parent: parentOrModel };
    if (texture) model.textures = { layer0: texture };
    await createFile(modelUri, JSON.stringify(model, undefined, ' '.repeat(4)));
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