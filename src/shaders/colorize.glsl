precision mediump float;

varying vec2 texCoords;

uniform sampler2D u_img;
uniform sampler2D u_word_cloud;

void main() {
    vec4 img = 1.0 - texture2D(u_img, texCoords);
    vec4 word_cloud = texture2D(u_word_cloud, texCoords);

    float red = float(any(lessThan(vec3(word_cloud.r, word_cloud.g, word_cloud.b), vec3(1.0, 0.5, 0.5))));

    vec3 colors = 1.0 - vec3(red * img.r, red * img.g, red * img.b);

    vec4 texture = vec4(colors, 1.0);

    gl_FragColor = texture;
}
