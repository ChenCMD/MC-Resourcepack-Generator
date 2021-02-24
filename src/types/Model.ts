import { ParentItem, listenParentPath } from './ParentItem';

/* eslint-disable @typescript-eslint/naming-convention */
export interface Model {
    parent: string,
    overrides?: {
        predicate?: {
            custom_model_data?: number
        },
        model?: string
    }[],
    textures?: {
        layer0?: string
    } & { [key: string]: string }
}

export async function createModelTemplate(item: string, parentElements: ParentItem[]): Promise<Model> {
    const modelTemplate: Model = {
        parent: await listenParentPath(parentElements, 'ベースのmodelファイルのparent'),
        textures: {
            layer0: `item/${item}`
        },
        overrides: []
    };
    return modelTemplate;
}