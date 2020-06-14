import { useDebounce } from '../../utils/hooks.utils';
import { useState, useCallback, setReturns as setReactReturns } from 'react';
import { debounce, setReturns as setLodashReturns } from 'lodash';

jest.mock('react', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    useState: jest.fn(() => returnFuncs.useState ? returnFuncs.useState() : returns.useState),
    useCallback: jest.fn(() => returnFuncs.useCallback ? returnFuncs.useCallback() : returns.useCallback)
  };
});
jest.mock('lodash', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    debounce: jest.fn(() => returnFuncs.debounce ? returnFuncs.debounce() : returns.debounce)
  };
});

it('useDebounce', () => {

  const setVal = jest.fn();
  const cb = jest.fn();
  setReactReturns({
    useState: [11, setVal],
    useCallback: cb
  });
  setLodashReturns({
    debounce: 'debounce ret'
  });
  const ret = useDebounce(10, 200, 'deps');
  expect(ret).toEqual(11);

  expect(useState.mock.calls.length).toEqual(1);
  expect(useState.mock.calls[0]).toEqual([10]);

  expect(debounce.mock.calls.length).toEqual(1);
  expect(debounce.mock.calls[0]).toEqual([setVal, 200]);

  expect(useCallback.mock.calls.length).toEqual(1);
  expect(useCallback.mock.calls[0]).toEqual(['debounce ret', 'deps']);

  expect(cb.mock.calls.length).toEqual(1);
  expect(cb.mock.calls[0]).toEqual([10]);
});

