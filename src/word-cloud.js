import WordCloud from 'wordcloud';
import { MIN_WEIGHT, MAX_WEIGHT, RENDER_OPTIONS, RETWEET_LOWER_BOUND, RETWEET_UPPER_BOUND } from './consts';
import { clamp } from './util';

function weightFunction(minWeight, maxWeight) {
    return (retweets) => (retweets - RETWEET_LOWER_BOUND) / (RETWEET_UPPER_BOUND - RETWEET_LOWER_BOUND) * (maxWeight - minWeight) + minWeight;
}

const clampRetweets = clamp(RETWEET_LOWER_BOUND, RETWEET_UPPER_BOUND);

export function render(canvas, tweets) {
    return new Promise(resolve => {
        const listener = () => {
            canvas.removeEventListener('wordcloudstop', listener);
            resolve();
        };
        canvas.addEventListener('wordcloudstop', listener);
        WordCloud(canvas, Object.assign({}, RENDER_OPTIONS, {
            list: tweets.map(({ user, retweets }) => [user.handle, clampRetweets(retweets)]),
            weightFactor: weightFunction(MIN_WEIGHT, MAX_WEIGHT),
            clearCanvas: false,
            color: 'red'
        }));
    });
}

export function renderContinously(canvas, tweets, draw) {
    return new Promise(resolve => {
        const listener = () => {
            canvas.removeEventListener('wordcloudstop', listener);
            canvas.removeEventListener('wordclouddrawn', draw);
            resolve();
        };
        canvas.addEventListener('wordcloudstop', listener);
        canvas.addEventListener('wordclouddrawn', draw);
        WordCloud(canvas, Object.assign({}, RENDER_OPTIONS, {
            list: tweets.map(({ user, retweets }) => [user.handle, clampRetweets(retweets)]),
            weightFactor: weightFunction(MIN_WEIGHT, MAX_WEIGHT),
            clearCanvas: false,
            color: 'red'
        }));
    });
}
