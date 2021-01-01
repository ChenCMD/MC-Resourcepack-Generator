import { WorkspaceConfiguration } from 'vscode';

export interface Config {
    customizeInjectFolder: string;
}

const defaultConfig: Config = {
    customizeInjectFolder: ''
};

export function constructConfig(custom: WorkspaceConfiguration, base = defaultConfig): Config {
    const config = {
        ...base, ...custom
    };

    console.log('config loadded.');
    console.log(JSON.stringify(config, undefined, ' '.repeat(4)));

    return config;
}