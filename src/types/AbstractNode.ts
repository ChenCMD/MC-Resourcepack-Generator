import { Uri } from 'vscode';
import { writeBaseModel } from '../util/common';
import { GeneratorContext } from './Context';
import { ParentItem, listenParentPath } from './ParentItem';

export abstract class AbstractNode {
    private readonly _parentElements: ParentItem[];
    private readonly _genDir: Uri;
    private readonly _baseItem: string;
    private readonly _id: number;
    private readonly _injectFolder: string;

    constructor(ctx: GeneratorContext) {
        this._parentElements = ctx.parentElements;
        this._genDir = ctx.genDir;
        this._baseItem = ctx.baseItem;
        this._injectFolder = ctx.injectFolder;
        this._id = ctx.id;
    }

    abstract childQuestion(parentElements: ParentItem[]): Promise<void>;

    async generate(): Promise<void> {
        const dir = this._makeUri('models', `${this._baseItem}.json`);
        await writeBaseModel(dir, this._baseItem, this._id, this._injectPath(this._id.toString()), this._parentElements);
    }

    protected async listenParentPath(parentElements: ParentItem[], withoutNonHasTextures?: boolean): Promise<string> {
        return await listenParentPath(parentElements, 'parent', withoutNonHasTextures);
    }

    protected getTexturePath(customFileName?: string): string {
        return `item/${this._injectPath(customFileName ? `${this._id}/${customFileName}` : `${this._id}`)}`;
    }

    protected getTextureUri(customFileName?: string): Uri {
        return this._makeUri('textures', this._injectPath(customFileName ? `${this._id}/${customFileName}` : `${this._id}.png`));
    }

    protected getChildModelUri(): Uri {
        return this._makeUri('models', this._injectPath(`${this._id}.json`));
    }

    private _injectPath(afterPath: string): string {
        return this._injectFolder ? `${this._injectFolder}/${afterPath.toString()}` : afterPath.toString();
    }

    private _makeUri(category: string, ...itemAfter: string[]): Uri {
        return Uri.joinPath(this._genDir, 'assets/minecraft', category, 'item', ...itemAfter);
    }
}