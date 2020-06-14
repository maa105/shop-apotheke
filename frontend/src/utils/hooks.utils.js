import { useState, useMemo, useCallback } from 'react';
import { map } from 'lodash';
import Fuse from 'fuse.js';
import { debounce } from 'lodash';

export const useDebounce = (value, duration = 300, deps = []) => {
  const [val, setVal] = useState(value);
  const cb = useCallback(debounce(setVal, duration), deps);
  cb(value);
  return val;
};

/**
 * fuze options. See [their documentation]{@link https://fusejs.io/api/options.html#basic-options}.
 * @typedef {Object} FuzeOptions
 * @property {boolean} isCaseSensitive
 * @property {boolean} includeScore
 * @property {boolean} shouldSort
 * @property {boolean} includeMatches
 * @property {boolean} findAllMatches
 * @property {number} minMatchCharLength
 * @property {number} location
 * @property {number} threshold
 * @property {number} distance
 * @property {boolean} useExtendedSearch
 */

/**
 * Assumes `searchKeys` wont change
 * @param {Array<object>} list array to search
 * @param {Array<string>} searchKeys the keys in the `list` to search in
 * @param {string} searchText the search text 
 * @param {FuzeOptions} fuseOptions options for fuse fuzzy indexer 
 * @param {number} minLength the minimum length of `searchText` to begin search
 * @param {boolean} returnFullIfShort if length of `searchText` is less than `minLength` return whole list or empty list
 */
export const useSearcher = (list, searchKeys, searchText, fuseOptions = { findAllMatches: true }, minLength = 3, returnFullIfShort = true) => {
  const indexer = useMemo(() => {
    if(list) {
      if(searchKeys) {
        fuseOptions.keys = searchKeys
      }
      return new Fuse(list, fuseOptions);
    }
  }, [list, fuseOptions]); // assumes that searchKeys will not change

  if(!list) {
    return list;
  }
  if(searchText.length < minLength) {
    return returnFullIfShort ? list : [];
  }
  return map(indexer.search(searchText), 'item');
};

