import { renderWebGl } from './webgl-renderer';
import { grils } from './grils';

async function fetchTweets() {
    const res = await fetch('api/tweets');
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

async function setup() {
    const refreshBtn = document.getElementById('refresh-btn');
    const grilContainer = document.querySelector('.grils');
    let tabQuery = /\?tab=([0-9]+)$/.exec(document.location);
    if (tabQuery != null) {
        grilContainer.classList.add('show');
    }
    let selectedIndex = tabQuery == null ? 0 : parseInt(tabQuery[1], 10);

    const grilBtns = grils.map((gril, i) => {
        const btn = document.createElement('button');
        btn.textContent = gril.name;
        btn.addEventListener('click', () => {
            selectedIndex = i;
            render(gril.url);
        });
        grilContainer.appendChild(btn);
        return btn;
    });

    const refreshBtns = () =>
        grilBtns.forEach((btn, i) => i === selectedIndex ?
            btn.classList.add('active') :
            btn.classList.remove('active')
        );
    
    const disable = btn => btn.setAttribute('disabled', '');
    const enable = btn => btn.removeAttribute('disabled');

    const render = async url => {
        grilBtns.forEach(disable);
        disable(refreshBtn);
        refreshBtns();
        try {
            const img = await fetchImage(url);
            const tweets = await fetchTweets();
            const final = await renderWebGl(img, tweets);
        }catch(e) {
            console.error(e);
        }
        grilBtns.forEach(enable);
        enable(refreshBtn);
    };

    const refresh = () => render(grils[selectedIndex].url);

    refreshBtn.addEventListener('click', refresh);

    await refresh();
    
    document.querySelector('.interactions').classList.add('show');
    grilContainer.classList.add('show');
}

setup()
    .catch(err => console.error(err))
