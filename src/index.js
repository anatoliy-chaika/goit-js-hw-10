import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

// https://restcountries.com/v3.1/name/peru?fields=name,capital,population,flags.svg,languages

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const ulRef = document.querySelector('.country-list');
const divRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(fetchCountries, DEBOUNCE_DELAY));

function fetchCountries() {
  const inputValue = inputRef.value;
  if (inputValue.trim() === '') {
    ulRef.innerHTML = '';
    return;
  }
  countriesApi(inputValue)
    .then(data => {
      if (data.length === 1) {
        divRef.innerHTML = createInfo(data);
        ulRef.innerHTML = '';
        return;
      }
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        ulRef.innerHTML = '';
      }
      if (data.length < 10) {
        ulRef.innerHTML = createMarcup(data);
        divRef.innerHTML = '';
      }
    })
    .catch(error => console.log(error));
}

function countriesApi(query) {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  return fetch(
    `${BASE_URL}${query}?fields=name,capital,population,flags,languages`
  ).then(resp => {
    console.log(resp);
    if (!resp.ok) {
      Notiflix.Notify.failure('Oops, there is no country with that name', {
        timeout: 2000,
      });
    }
    return resp.json();
  });
}

function createMarcup(arr) {
  return arr
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li>
  <img src="${svg}" alt="flag" width="250">
  <p>${official}</p>
</li>`
    )
    .join('');
}

function createInfo(array) {
  return array
    .map(
      ({
        name: { official },
        flags: { svg },
        capital,
        languages,
        population,
      }) =>
        `<img src="${svg}" alt="flag" width="100"/>
<h3>${official}</h3>
<ul>
  <li>capital:<p>${capital}</p></li>
  <li>population:<p>${population}</p></li>
  <li>languages:<p>${Object.values(languages).join(', ')}</p></li>
</ul>`
    )
    .join('');
}
