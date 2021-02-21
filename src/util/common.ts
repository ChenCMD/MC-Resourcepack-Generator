import https from 'https';
import path from 'path';
import { Uri } from 'vscode';
import { AnimationMcmeta } from '../types/AnimationMcmeta';
import { DownloadTimeOutError, GenerateError } from '../types/Error';
import { ParentItem } from '../types/ParentItem';
import { createModelTemplate, Model } from '../types/Model';
import { copyFile, createFile, pathAccessible, readFile, writeFile } from './file';
import sharp from 'sharp';

export async function isResourcepackRoot(testPath: string): Promise<boolean> {
    return await pathAccessible(path.join(testPath, 'pack.mcmeta')) && await pathAccessible(path.join(testPath, 'assets'));
}

export async function writeBaseModel(dir: Uri, baseItem: string, cmdID: number, texPath: string, parentElements: ParentItem[]): Promise<void> {
    const model: Model = await pathAccessible(dir) ? JSON.parse(await readFile(dir)) : await createModelTemplate(baseItem, parentElements);
    if (!model.overrides) model.overrides = [];
    const isAlreadyExists = model.overrides.some(v => {
        if (!v.predicate || v.predicate.custom_model_data !== cmdID) return false;
        v.model = `item/${texPath}`;
        return true;
    });
    if (!isAlreadyExists) {
        let index = 0;
        let indexCMD = 0;
        model.overrides.forEach((v, i) => {
            const cmd = v.predicate?.custom_model_data ?? 0;
            if (indexCMD < cmd && cmd < cmdID) {
                index = i + 1;
                indexCMD = cmd;
            }
        });
        // eslint-disable-next-line @typescript-eslint/naming-convention
        model.overrides.splice(index, 0, { predicate: { custom_model_data: cmdID }, model: `item/${texPath}` });
    }
    await writeFile(dir, JSON.stringify(model, undefined, ' '.repeat(4)));
}

export async function createModel(modelUri: Uri, parent: string, texture?: string): Promise<void>;
export async function createModel(modelUri: Uri, model: Model): Promise<void>;
export async function createModel(modelUri: Uri, parentOrModel: string | Model, texture?: string): Promise<void> {
    if (await pathAccessible(modelUri)) throw new GenerateError(`${modelUri.fsPath} はすでに生成されています。`);
    const model: Model = typeof parentOrModel === 'object' ? parentOrModel : { parent: parentOrModel };
    if (texture) model.textures = { layer0: texture };
    await createFile(modelUri, JSON.stringify(model, undefined, ' '.repeat(4)));
}

export async function applyTexture(dir: Uri, image: sharp.Sharp, animSetting?: AnimationMcmeta): Promise<void>;
export async function applyTexture(dir: Uri, texture: Uri, animSetting?: AnimationMcmeta): Promise<void>;
export async function applyTexture(dir: Uri, texture: Uri | sharp.Sharp, animSetting?: AnimationMcmeta): Promise<void> {
    if (texture instanceof Uri)
        await copyFile(texture, dir);
    else
        await texture.toFile(dir.fsPath);

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