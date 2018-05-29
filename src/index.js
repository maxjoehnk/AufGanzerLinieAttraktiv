import { renderWebGl } from './webgl-renderer';

const JOLIE_URL = require('../assets/jolie.png');
const SCARLET_URL = require('../assets/johannsonborder.png');

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
    const jolie = await fetchImage(JOLIE_URL);
    const renderJolie = render(jolie);
    const refreshBtn = document.querySelector('button');
    refreshBtn.addEventListener('click', renderJolie);

    await renderJolie();
    
    document.querySelector('.interactions').classList.add('show');
    document.querySelector('.grils').classList.add('show');

    const jolieBtn = document.querySelector('#jolie');
    const scarletBtn = document.querySelector('#scarlet');

    const scarlet = await fetchImage(SCARLET_URL);
    const renderScarlet = render(scarlet);

    const enable = () => {
        refreshBtn.removeAttribute('disabled');
        scarletBtn.removeAttribute('disabled');
        jolieBtn.removeAttribute('disabled');
    };

    const disable = () => {
        refreshBtn.setAttribute('disabled', '');
        scarletBtn.setAttribute('disabled', '');
        jolieBtn.setAttribute('disabled', '');
    };

    jolieBtn.addEventListener('click', async() => {
        refreshBtn.addEventListener('click', renderJolie);
        refreshBtn.removeEventListener('click', renderScarlet);
        disable();
        try {
            await renderJolie();
        }catch(e) {}
        enable();
    });

    scarletBtn.addEventListener('click', async() => {
        refreshBtn.addEventListener('click', renderScarlet);
        refreshBtn.removeEventListener('click', renderJolie);
        disable();
        try {
            await renderScarlet();
        }catch(e) {}
        enable();
    });
}

function render(img) {
    return async() => {
        const tweets = await fetchTweets();
        const final = await renderWebGl(img, tweets);
    };
}

setup()
    .catch(err => console.error(err))