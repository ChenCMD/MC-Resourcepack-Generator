import { Uri } from 'vscode';
import { ResourcePackGenerator } from '../ResourcePackGenerator';
import { AbstractNode } from './AbstractNode';
import { GeneratorContext } from './Context';
import { listenDir } from '../util/vscodeWrapper';

export abstract class TwoDimension implements AbstractNode {
    protected texturePng!: Uri;

    abstract childQuestion(): Promise<void>;
    abstract generate(ctx: GeneratorContext): Promise<void>;

    protected async listenTextureFile(): Promise<void> {
        this.texturePng = await listenDir('テクスチャファイルを選択', '選択', ResourcePackGenerator.getOption(false));
    }
}