import { NonAnimated2DGenNode, Animated2DGenNode, NonAnimated3DGenNode, VanillaGenNode } from '../nodes';
import { AbstractNode } from './AbstractNode';

export function getGenTypeMap(): Map<string, AbstractNode> {
    const res = new Map<string, AbstractNode>();

    res.set('非アニメーションテクスチャ', new NonAnimated2DGenNode());
    res.set('アニメーションテクスチャ', new Animated2DGenNode());
    res.set('バニラテクスチャ', new VanillaGenNode());
    res.set('非アニメーション3Dモデル', new NonAnimated3DGenNode());

    return res;
}