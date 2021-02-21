import { createModel } from '../util/common';
import { AbstractNode } from '../types/AbstractNode';
import { ParentItem } from '../types/ParentItem';

export class VanillaGenNode extends AbstractNode {
    private _parent!: string;

    async childQuestion(parentElement: ParentItem[]): Promise<void> {
        this._parent = await this.listenParentPath(parentElement, true);
    }

    async generate(): Promise<void> {
        super.generate();
        // モデルファイルの生成
        await createModel(this.getChildModelUri(), this._parent);
    }
}