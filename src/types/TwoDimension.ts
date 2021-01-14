import { Uri } from 'vscode';
import { AbstractNode } from './AbstractNode';

export interface TwoDimension extends AbstractNode {
    textureUri: Uri;

    listenTextureFile(): Promise<Uri>;
}