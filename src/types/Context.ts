import { Uri } from 'vscode';

export interface GeneratorContext {
    generateDirectory: Uri
    id: number
    baseItem: string
    interjectFolder: string
}