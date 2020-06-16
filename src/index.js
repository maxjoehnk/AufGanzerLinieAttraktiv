import { renderWebGl } from './webgl-renderer';

const grils = [
    
	{ name: 'Harvey Weinstein', url: require('../assets/weinstein.png') },
	{ name: 'European Parliament', url: require('../assets/euparl.png') },
	{ name: 'Alexa', url: require('../assets/alexa.png') },
	{ name: 'Hollywood', url: require('../assets/hollywood.png') },/*
	{ name: 'Carl Sargeant', url: require('../assets/carl_sargeant.png') },
	{ name: 'Danny Masterson', url: require('../assets/danny_masterson.png')},
	{ name: 'Dieter Wedel', url: require('../assets/dieter_wedel.png')},
	{ name: 'James Toback', url: require('../assets/james_toback.png')},*/
	{ name: 'Jörg Kachelmann', url: require('../assets/joerg_kachelmann.png')}
	//{ name: 'Ron Jeremy', url: require('../assets/ron-jeremy.png')}
];

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
    const refreshBtn = document.querySelector('button');
    const grilContainer = document.querySelector('.grils');
    let selectedIndex = 0;

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
