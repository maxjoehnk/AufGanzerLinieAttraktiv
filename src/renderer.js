import WordCloud from 'wordcloud';
import {
    BLACK,
    WHITE,
    RETWEET_LOWER_BOUND,
    RETWEET_UPPER_BOUND,
    MIN_WEIGHT,
    MAX_WEIGHT,
    BACKGROUND_OPACITY,
    RENDER_OPTIONS,
    BACKGROUND_COLOR
} from './consts';
import { isWhite, isWord, clamp, splice, fromImageData } from './util';

function generateMask(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, img.width, img.height);
    const original = context.getImageData(0, 0, canvas.width, canvas.height);
    const mask = context.createImageData(original);

    for (let i = 0; i < original.data.length; i += 4) {
        const [r, g, b, a] = original.data.slice(i, i + 4);
        if (isWhite(r, g, b)) {
            splice(mask.data, i, [...BLACK, 255]);
        }else {
            splice(mask.data, i, [...WHITE, 255]);
        }
    }

    context.putImageData(mask, 0, 0);
    return {
        canvas,
        original,
        mask
    };
}

function weightFunction(minWeight, maxWeight) {
    return (retweets) => (retweets - RETWEET_LOWER_BOUND) / (RETWEET_UPPER_BOUND - RETWEET_LOWER_BOUND) * (maxWeight - minWeight) + minWeight;
}

const clampRetweets = clamp(RETWEET_LOWER_BOUND, RETWEET_UPPER_BOUND);

function renderCloud(canvas, tweets, weightFactor, onOpenTweet) {
    return new Promise(resolve => {
        const listener = () => {
            const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            canvas.removeEventListener('wordcloudstop', listener);
            resolve(data);
        };
        canvas.addEventListener('wordcloudstop', listener);
        WordCloud(canvas, Object.assign({}, RENDER_OPTIONS, {
            list: tweets.map(({ user, retweets }) => [user.handle, clampRetweets(retweets)]),
            weightFactor,
            clearCanvas: false,
            color: 'red',
            click: onOpenTweet
        }));
    });
}

function renderImage(canvas, original) {
    const context = canvas.getContext('2d');
    const mask = context.getImageData(0, 0, canvas.width, canvas.height);
    const final = context.createImageData(mask);

    for (let i = 0; i < mask.data.length; i += 4) {
        const [r, g, b, a] = mask.data.slice(i, i + 4);
        if (isWord(r, g, b)) {
            const colors = fromImageData(original.data, i);
            splice(final.data, i, colors);
        }else if (isWhite(r, g, b)) {
            const [r, g, b, a] = fromImageData(original.data, i);
            splice(final.data, i, [r, g, b, BACKGROUND_OPACITY]);
        }else { // BLACK
            splice(final.data, i, [...BACKGROUND_COLOR, 255]);
        }
    }

    return final;
}

export async function render(img, tweets, onOpenTweet) {
    const { canvas, original, mask } = generateMask(img);
    const cloud = await renderCloud(canvas, tweets, weightFunction(MIN_WEIGHT, MAX_WEIGHT), onOpenTweet);
    const final = renderImage(canvas, original);

    return {
        canvas,
        original,
        mask,
        cloud,
        final
    };
}

export async function rerender({ canvas, original, mask }, tweets, onOpenTweet) {
    const context = canvas.getContext('2d');
    context.putImageData(mask, 0, 0);
    await renderCloud(canvas, tweets, weightFunction(MIN_WEIGHT, MAX_WEIGHT), onOpenTweet);
    return renderImage(canvas, original);
}
