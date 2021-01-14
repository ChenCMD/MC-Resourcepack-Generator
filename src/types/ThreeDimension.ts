import { Uri } from 'vscode';
import { AbstractNode } from './AbstractNode';

export interface ThreeDimension extends AbstractNode {
    textureUris: Uri[];

    listenTextureFiles(): Promise<Uri[]>;

    modelUri: Uri;

    listenModelFile(): Promise<Uri>;
}