import createTexture from 'gl-texture2d';
import createShader from 'gl-shader';
import { getContext, clearCanvas, clearContext, bindVertices, setupCanvas } from './util';
import { renderContinously} from './word-cloud';
import vertexShaderSource from './shaders/vertex.glsl';
import maskFragmentShaderSource from './shaders/mask.glsl';
import colorizeFragmentShaderSource from './shaders/colorize.glsl';

function generateMask(canvas, img) {
    const gl = getContext(canvas);
    clearContext(gl);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    const shader = createShader(gl, vertexShaderSource, maskFragmentShaderSource);

    shader.bind();

    bindVertices(gl);

    shader.attributes.position.pointer();

    const texture = createTexture(gl, img);
    texture.bind(0);
    texture.magFilter = gl.LINEAR;
    texture.minFilter = gl.LINEAR;

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function colorImage(canvas, img, textCanvas) {
    const gl = getContext(canvas);
    clearContext(gl);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const shader = createShader(gl, vertexShaderSource, colorizeFragmentShaderSource);
    shader.bind();

    bindVertices(gl);

    shader.attributes.position.pointer();

    const texture = createTexture(gl, img);
    texture.magFilter = gl.LINEAR;
    texture.minFilter = gl.LINEAR;
    shader.uniforms.u_img = 0;

    texture.bind(0);
    
    const wordTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, wordTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    //const wordTexture = createTexture(gl, textCanvas);
    //wordTexture.bind(1);
    //wordTexture.magFilter = gl.LINEAR;
    //wordTexture.minFilter = gl.LINEAR;

    shader.uniforms.u_word_cloud = 1; 
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    return canvas;
}

function setupClouds(glCanvas) {
    const canvas = document.createElement('canvas');
    canvas.width = glCanvas.width;
    canvas.height = glCanvas.height;
    const gl = getContext(glCanvas);
    const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    gl.readPixels(0, 0, glCanvas.width, glCanvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const data = new Uint8ClampedArray(pixels);
    const imageData = new ImageData(data, glCanvas.width, glCanvas.height);
    const context = canvas.getContext('2d');
    context.putImageData(imageData, 0, 0);

    return canvas;
}

export async function renderWebGl(img, tweets) {
    const glCanvas = setupCanvas(img);
    generateMask(glCanvas, img);
    const cloudCanvas = setupClouds(glCanvas);
    clearCanvas(glCanvas);
    glCanvas.classList.add('show');
    await renderContinously(cloudCanvas, tweets, () => colorImage(glCanvas, img, cloudCanvas));
}
