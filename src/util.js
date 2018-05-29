import { ALIASING_THRESHOLD } from './consts';

export function clamp(min, max) {
    return value => Math.max(min, Math.min(max, value));
}

export function bindVertices(gl) {
    const vertices = new Float32Array([
        -1, -1,
        -1, 1,
        1, 1,
    
        -1, -1,
        1, 1,
        1, -1,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

export function getContext(canvas) {
    return canvas.getContext('webgl', {
        antialias: false
    });
}

export function clearContext(gl) {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export function clearCanvas(canvas) {
    const context = getContext(canvas);
    clearContext(context);
}

export function setupCanvas(img) {
    const canvas = document.querySelector('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    return canvas;
}
