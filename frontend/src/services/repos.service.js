import { fetch, rejectNotOk } from './fetch.service';
import { map, padStart } from 'lodash';
import config from '../config';

export const loadLastWeekTopRepos = (page, pageSize, languageFilters) => {
  const langFilter = languageFilters && languageFilters.length ? ('+' + map(languageFilters, (lang) => 'language:' + encodeURIComponent(lang)).join('+')) : '';
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekStr = `${lastWeek.getFullYear()}-${padStart(lastWeek.getMonth().toString(), 2, '0')}-${padStart(lastWeek.getDate().toString(), 2, '0')}`;
  return fetch(config.backend.searchApiPrefix + `/repositories?q=created:>${lastWeekStr}${langFilter}&sort=stars&order=desc&page=${page}&per_page=${pageSize}`)
  .then(rejectNotOk.body)
  .then(({ total_count, items }) => (
    { page, total: total_count, repos: items }
  ));
};
