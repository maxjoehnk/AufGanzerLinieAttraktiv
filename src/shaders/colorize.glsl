precision mediump float;

varying vec2 texCoords;

uniform sampler2D u_img;
uniform sampler2D u_word_cloud;

void main() {
    vec4 img = texture2D(u_img, texCoords);
    vec4 word_cloud = texture2D(u_word_cloud, texCoords);

    vec4 inverted = 1.0 - word_cloud - img;

    gl_FragColor = 1.0 - inverted;
}
