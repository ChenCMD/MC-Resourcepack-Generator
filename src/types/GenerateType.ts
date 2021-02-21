/* eslint-disable @typescript-eslint/no-explicit-any */
import { NonAnimated2DGenNode, Animated2DGenNode, NonAnimated3DGenNode, VanillaGenNode, GenNodes } from '../nodes';

export function getGenTypeMap(): Map<string, GenNodes> {
    const res = new Map<string, GenNodes>();

    res.set('非アニメーションテクスチャ', NonAnimated2DGenNode);
    res.set('アニメーションテクスチャ', Animated2DGenNode);
    res.set('バニラテクスチャ', VanillaGenNode);
    res.set('非アニメーション3Dモデル', NonAnimated3DGenNode);

    return res;
}