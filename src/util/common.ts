import https from 'https';
import path from 'path';
import { Uri } from 'vscode';
import { AnimationMcmeta } from '../types/AnimationMcmeta';
import { DownloadTimeOutError, GenerateError } from '../types/Error';
import { ParentItem } from '../types/ParentItem';
import { createModelTemplate, Model } from '../types/Model';
import { copyFile, createDir, createFile, pathAccessible, readFile, writeFile } from './file';
import Jimp from 'jimp';

export async function isResourcepackRoot(testPath: string): Promise<boolean> {
    return await pathAccessible(path.join(testPath, 'pack.mcmeta')) && await pathAccessible(path.join(testPath, 'assets'));
}

export async function writeBaseModel(dir: Uri, baseItem: string, cmdID: number, texPath: string, parentElements: ParentItem[]): Promise<void> {
    const baseModel: Model = await pathAccessible(dir) ? JSON.parse(await readFile(dir)) : await createModelTemplate(baseItem, parentElements);

    const setOverride = (cmdID2: number, model: string, replace = true) => {
        let index;
        if (!baseModel.overrides) baseModel.overrides = [];
        for (const [i, v] of baseModel.overrides.entries()) {
            if (!v.predicate || v.predicate.custom_model_data !== cmdID2) continue;
            index = replace ? i : -1;
            break;
        }
        if (index === undefined) {
            index = 0;
            let indexCMD = 0;
            for (const [i, v] of baseModel.overrides.entries()) {
                const cmd = v.predicate?.custom_model_data ?? 0;
                if (indexCMD < cmd && cmd < cmdID2) index = i + 1, indexCMD = cmd;
            }
            baseModel.overrides.splice(index, 0, {});
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        if (index !== -1) baseModel.overrides[index] = { predicate: { custom_model_data: cmdID2 }, model };
    };

    setOverride(cmdID, `item/${texPath}`);
    setOverride(cmdID + 1, `item/${baseItem}`, false);
    await writeFile(dir, JSON.stringify(baseModel, undefined, ' '.repeat(4)));
}

export async function createModel(modelUri: Uri, parent: string, texture?: string): Promise<void>;
export async function createModel(modelUri: Uri, model: Model): Promise<void>;
export async function createModel(modelUri: Uri, parentOrModel: string | Model, texture?: string): Promise<void> {
    if (await pathAccessible(modelUri)) throw new GenerateError(`${modelUri.fsPath} はすでに生成されています。`);
    const model: Model = typeof parentOrModel === 'object' ? parentOrModel : { parent: parentOrModel };
    if (texture) model.textures = { layer0: texture };
    await createFile(modelUri, JSON.stringify(model, undefined, ' '.repeat(4)));
}

export async function applyTexture(dir: Uri, image: Jimp, animSetting?: AnimationMcmeta): Promise<void>;
export async function applyTexture(dir: Uri, texture: Uri, animSetting?: AnimationMcmeta): Promise<void>;
export async function applyTexture(dir: Uri, image: Uri | Jimp, animSetting?: AnimationMcmeta): Promise<void> {
    await createDir(path.dirname(dir.fsPath));
    if (image instanceof Uri)
        await copyFile(image, dir);
    else
        await image.writeAsync(dir.fsPath);

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