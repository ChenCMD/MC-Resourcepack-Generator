import { Uri } from 'vscode';
import { ParentItem } from './ParentItem';

export interface GeneratorContext {
    parentElements: ParentItem[]
    genDir: Uri
    id: number
    baseItem: string
    injectFolder: string
    globalStorageUri: Uri
}