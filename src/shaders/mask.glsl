precision mediump float;

varying vec2 texCoords;

uniform sampler2D textureSampler;

void main() {
    vec4 texture = texture2D(textureSampler, texCoords);
    bool white = any(lessThan(vec3(texture.r, texture.g, texture.b), vec3(1.0, 1.0, 1.0)));
    texture = vec4(white, white, white, 1.0);
    gl_FragColor = texture;
}
