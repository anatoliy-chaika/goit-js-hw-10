import Notiflix from 'notiflix';
import { ulRef, divRef } from '../src/index';

export function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  return fetch(
    `${BASE_URL}${name}?fields=name,capital,population,flags,languages`
  ).then(resp => {
    if (!resp.ok) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      ulRef.innerHTML = '';
      divRef.innerHTML = '';
    }
    return resp.json();
  });
}
