import { WorkspaceConfiguration } from 'vscode';
import { ParentItem } from './ParentItem';

export interface Config {
    customizeInjectFolder: string | string[]
    version: string
    parentElements: ParentItem[]
    fileName: string
}

const defaultConfig: Config = {
    customizeInjectFolder: '',
    version: '1.16.4', // ベータベースに1.16.5のデータが存在しないので1.16.4を使用する
    parentElements: [
        {
            label: 'item/generated',
            description: '通常のアイテムの持ち方',
            hasTextures: false
        },
        {
            label: 'item/handheld',
            description: '剣の持ち方',
            hasTextures: false
        },
        {
            label: 'item/handheld_rod',
            description: '人参棒の持ち方',
            detail: '剣と比べるとテクスチャの向きが違い、一人称視点でアイテムを前方に向けた持ち方をします',
            hasTextures: false
        },
        {
            label: 'item/bow',
            description: '弓の持ち方',
            hasTextures: false
        }
    ],
    fileName: '{item}/{custom_model_data}'
};

export function constructConfig(custom: WorkspaceConfiguration, base = defaultConfig): Config {
    const config = {
        ...base, ...custom
    };

    console.log('config loaded.');
    console.log(JSON.stringify(config, undefined, ' '.repeat(4)));

    return config;
}