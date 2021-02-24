import { applyTexture, createModel } from '../util/common';
import { Uri } from 'vscode';
import { listenDir, getOption } from '../util/vscodeWrapper';
import { AbstractNode } from '../types/AbstractNode';
import { ParentItem } from '../types/ParentItem';

export class NonAnimated2DGenNode extends AbstractNode {
    private _parent!: string;
    private _textureUri!: Uri;

    async childQuestion(parentElement: ParentItem[]): Promise<void> {
        this._parent = await this.listenParentPath(parentElement);
        this._textureUri = await this.listenTextureFile();
    }

    async generate(): Promise<void> {
        await super.generate();
        // modelファイルの出力
        await createModel(this.getChildModelUri(), this._parent, this.getTexturePath());

        // textureファイル
        await applyTexture(this.getTextureUri(), this._textureUri);
    }

    private async listenTextureFile(): Promise<Uri> {
        return await listenDir('テクスチャファイルを選択', '選択', getOption(false));
    }
}