import { QuickPickItem, WorkspaceConfiguration } from 'vscode';

export interface Config {
    customizeInjectFolder: string
    version: string
    parentElement: QuickPickItem[]
}

const defaultConfig: Config = {
    customizeInjectFolder: '',
    version: '1.16.4', // ベータベースに1.16.5のデータが存在しないので1.16.4を使用する
    parentElement: [
        {
            label: 'item/generated',
            description: '通常のアイテムの持ち方'
        },
        {
            label: 'item/handheld',
            description: '剣の持ち方'
        },
        {
            label: 'item/handheld_rod',
            description: '人参棒の持ち方',
            detail: '剣と比べるとテクスチャの向きが違い、一人称視点でアイテムを前方に向けた持ち方をします'
        },
        {
            label: 'item/bow',
            description: '弓の持ち方'
        }
    ]
};

export function constructConfig(custom: WorkspaceConfiguration, base = defaultConfig): Config {
    const config = {
        ...base, ...custom
    };

    console.log('config loadded.');
    console.log(JSON.stringify(config, undefined, ' '.repeat(4)));

    return config;
}