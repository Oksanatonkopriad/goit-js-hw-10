import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector(`#search-box`);
const listEl = document.querySelector(`.country-list`);
const cardEl = document.querySelector(`.country-info`);

inputEl.addEventListener(`input`, debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
    evt.preventDefault();
    // console.log(evt.target.value);
    const name = evt.target.value.trim();
    if (!name) {
        listEl.innerHTML = '';
        cardEl.innerHTML = '';
        return;
    }
    fetchCountries(name)
        .then(onCheck)
        .catch(errorName);
}

function onCheck(countries) {
    if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        listEl.innerHTML = '';
        cardEl.innerHTML = '';
    };

    if (countries.length > 2 && countries.length < 10) {
        renderList(countries);
        cardEl.innerHTML = '';
    }

    if (countries.length === 1) {
        renderCard(countries);
        listEl.innerHTML = '';
    }


}

function renderCard(countries) {
    const countriesInfo = countries.map(country => {
        return `
    <div class="country-info__title">
      <img class="country-info__flag" src="${country.flags.svg}" alt="${name.official}" width="40" >
      <span class="country-info__name">${country.name.official}</span>
    </div>
    <div class="country-info">
      <p><span class="country-info__feature">Capital: </span> ${country.capital}</p>
      <p><span class="country-info__feature">Population: </span> ${country.population}</p>
      <p><span class="country-info__feature">Languages: </span> ${Object.values(country.languages)}</p>
    </div>
        `
    }).join("");
    cardEl.innerHTML = countriesInfo;
}

function renderList(countries) {
    const markupList = countries.map(country => {
        return `
    <li class="country-list__item">
    <img class="country-list__image" width="40" src="${country.flags.svg}">
    <span class="country-list__name">${country.name.official}</span>
    </li>`;
    }).join('');
    listEl.innerHTML = markupList;
}

function errorName() {
Notiflix.Notify.failure('Oops, there is no country with that name');
}