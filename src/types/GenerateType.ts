import { AbstractNode } from './AbstractNode';
import { Animated2DGenNode } from '../nodes/Animated2DGenNode';
import { Single2DGenNode } from '../nodes/Single2DGenNode';
import { VanillaGenNode } from '../nodes/VanillaGenNode';

export type GenerateType = 'single' | 'animation' | 'vanilla'/* | '3D'*/;

export function getGenTypeMap(): Map<string, AbstractNode> {
    const res = new Map<string, AbstractNode>();

    res.set('単体テクスチャ', new Single2DGenNode());
    res.set('アニメーションテクスチャ', new Animated2DGenNode());
    res.set('バニラテクスチャ', new VanillaGenNode());
    // res.set('3D', '3Dモデル');

    return res;
}