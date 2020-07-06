import {grils} from './grils';

const grilContainer = document.querySelector('.grils');

grils.forEach((gril, i) => {
    const btn = document.createElement('a');
    btn.setAttribute('href', `/?tab=${i}`);
    btn.textContent = gril.name;
    grilContainer.appendChild(btn);
});
