import { Animated2DGenNode } from './Animated2DGenNode';
import { NonAnimated2DGenNode } from './NonAnimated2DGenNode';
import { NonAnimated3DGenNode } from './NonAnimated3DGenNode';
import { VanillaGenNode } from './VanillaGenNode';

export * from './VanillaGenNode';
export * from './NonAnimated2DGenNode';
export * from './Animated2DGenNode';
export * from './NonAnimated3DGenNode';

export type GenNodes =
    | typeof NonAnimated2DGenNode
    | typeof Animated2DGenNode
    | typeof VanillaGenNode
    | typeof NonAnimated3DGenNode;