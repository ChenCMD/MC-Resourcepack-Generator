import { Animated2DGenNode, Single2DGenNode, Single3DGenNode, VanillaGenNode } from '../nodes';
import { AbstractNode } from './AbstractNode';

export type GenerateType = 'single' | 'animation' | 'vanilla'/* | '3D'*/;

export function getGenTypeMap(): Map<string, AbstractNode> {
    const res = new Map<string, AbstractNode>();

    res.set('非アニメーションテクスチャ', new Single2DGenNode());
    res.set('アニメーションテクスチャ', new Animated2DGenNode());
    res.set('バニラテクスチャ', new VanillaGenNode());
    res.set('非アニメーション3Dモデル', new Single3DGenNode());

    return res;
}