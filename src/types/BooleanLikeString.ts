export type BooleanLikeString = 'true' | 'false';

export function toBoolean(boolLike: BooleanLikeString): boolean {
    return boolLike === 'true';
}