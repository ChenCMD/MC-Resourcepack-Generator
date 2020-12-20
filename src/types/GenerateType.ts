type GenerateType = 'single' | 'animation' | 'vanilla'/* | '3D'*/;

export function getGenTypeMap(): Map<GenerateType, string> {
    const res = new Map<GenerateType, string>();

    res.set('single', '単体テクスチャ');
    res.set('animation', 'アニメーションテクスチャ');
    res.set('vanilla', 'バニラテクスチャ');
    // res.set('3D', '3Dモデル');

    return res;
}