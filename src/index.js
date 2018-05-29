import { render, rerender } from './renderer';

const IMAGE_URL = require('../assets/jolie.png');

async function fetchTweets() {
    const res = await fetch('/api/tweets');
    return await res.json();
}

function fetchImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', reject);
    });
}

function onOpenTweet(event) {
    console.log(event);
}

async function setup() {
    const tweets = await fetchTweets();
    const img = await fetchImage(IMAGE_URL);
    const instance = await render(img, tweets);
    const canvas = document.querySelector('canvas');
    canvas.width = instance.canvas.width;
    canvas.height = instance.canvas.height;
    const context = canvas.getContext('2d');
    context.putImageData(instance.final, 0, 0);

    while (true) {
        await timeout(10000);
        try {
            const tweets = await fetchTweets();
            const final = await rerender(instance, tweets);
            context.putImageData(final, 0, 0);
            console.log('rendered');
        }catch(err) {
            console.error(err);
        }
    }
}

const timeout = time => new Promise(resolve => setTimeout(resolve, time));

setup()
    .catch(err => console.error(err))