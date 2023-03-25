import './css/styles.css';

const _debounce = require('lodash.debounce');
import { Notify } from 'notiflix';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};

const onSeekThisCountry = e => {
  let countryForSearch = e.target.value.trim().toLowerCase();

  if (!countryForSearch) {
    clearMarkup();
    return;
  }

  fetchCountries(countryForSearch)
    .then(markup)
    .catch(() => {
      clearMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
};

refs.inputEl.addEventListener(
  'input',
  _debounce(onSeekThisCountry, DEBOUNCE_DELAY)
);

function markup(resp) {
  let markup = '';

  if (resp.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (resp.length > 1) {
    resp.forEach(({ name, flags }) => {
      markup += `<li>
        <img src="${flags.svg}" alt="${flags.alt}" width="40" height="25">
        <span>${name.official}</span>
      </li>`;
    });
  } else {
    resp.forEach(({ name, capital, population, flags, languages }) => {
      markup += `<h2>
        <img src="${flags.svg}" alt="${flags.alt}" width="60" height="40">
        <span>${name.official}</span>
      </h2>
      <p><b>Capital:</b><span>${capital}</span></p>
      <p><b>Population:</b>
        <span>${population.toLocaleString('uk-UA')}</span>
      </p>
      <p><b>Languages:</b>
        <span>${Object.values(languages).join(', ')}</span>
      </p>`;
    });
  }

  refs.countryList.innerHTML = markup;
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryCard.innerHTML = '';
}
