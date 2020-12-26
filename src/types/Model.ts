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
    }
}

export function createModelTemplate(item: string): Model {
    const modelTemplate: Model = {
        parent: 'item/handheld_rod',
        textures: {
            layer0: `item/${item}`
        },
        overrides: []
    };
    for (let i = 1; i <= 500; i++) {
        modelTemplate.overrides!.push({
            predicate: {
                custom_model_data: i
            },
            model: `item/${item}`
        });
    }
    return modelTemplate;
}