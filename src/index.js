import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from '../src/fetchCountries';

// https://restcountries.com/v3.1/name/peru?fields=name,capital,population,flags.svg,languages

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const ulRef = document.querySelector('.country-list');
const divRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onCreate, DEBOUNCE_DELAY));

function onCreate() {
  const inputValue = inputRef.value;
  if (inputValue.trim() === '') {
    ulRef.innerHTML = '';
    divRef.innerHTML = '';
    return;
  }
  fetchCountries(inputValue)
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
        divRef.innerHTML = '';
        ulRef.innerHTML = '';
      }
      if (data.length < 10) {
        ulRef.innerHTML = createMarcup(data);
        divRef.innerHTML = '';
      }
    })
    .catch(error => console.log(error));
}

function createMarcup(arr) {
  return arr
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li class="js-li">
  <img src="${svg}" alt="flag" width="50">
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
        `<img src="${svg}" alt="flag" width="200"/>
<h3>${official}</h3>
<ul>
  <li class="js-li">Capital:<p>${capital}</p></li>
  <li class="js-li">Population:<p>${population}</p></li>
  <li class="js-li">Languages:<p>${Object.values(languages).join(', ')}</p></li>
</ul>`
    )
    .join('');
}
