import { ALIASING_THRESHOLD } from './consts';

export function isWhite(r, g, b) {
    return r === 255 && g === 255 && b === 255;
}

export function isWord(r, g, b) {
    return r === 255 && g < ALIASING_THRESHOLD && b < ALIASING_THRESHOLD;
}

export function clamp(min, max) {
    return value => Math.max(min, Math.min(max, value));
}

export function splice(data, i, [r, g, b, a]) {
    data[i + 0] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
}

export function fromImageData(data, i) {
    return [
        data[i + 0],
        data[i + 1],
        data[i + 2],
        data[i + 3]
    ];
}