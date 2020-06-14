import React from 'react';
import { render,  } from '@testing-library/react';
import { keys } from 'lodash';

import ReposPage from '../../../components/repos/repos-page.component';

import { setReturns as setReactReduxReturns } from 'react-redux';
import { setReturnFuncs as setReactReturnFuncs } from 'react';
import { Menu, Dropdown } from 'antd';
import TopRepos from '../../../components/repos/top-repos/top-repos.component';
import StarredRepos from '../../../components/repos/starred-repos/starred-repos.component';

jest.mock('@fortawesome/react-fontawesome', () => {
  return {
    FontAwesomeIcon: jest.fn(() => <div>Font Awesome Icon</div>)
  };
});
jest.mock('@fortawesome/free-solid-svg-icons', () => {
  return {
    faStar: jest.fn(() => <div>Fa Star</div>),
    faUser: jest.fn(() => <div>Fa User</div>),
    faSearch: jest.fn(() => <div>Fa Search</div>)
  };
});
jest.mock('react', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    ...jest.requireActual('react'),
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    useState: jest.fn(() => returnFuncs.useState ? returnFuncs.useState() : returns.useState),
  };
});
jest.mock('react-redux', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    useSelector: jest.fn(() => returnFuncs.useSelector ? returnFuncs.useSelector() : returns.useSelector),
  };
});
jest.mock('antd', () => {
  const Menu = jest.fn(({ children }) => <div>Menu: {children}</div>);
  Menu.Item = jest.fn(({ children }) => <div>Menu Item: {children}</div>);
  return {
    Menu,
    Input: jest.fn(({ children }) => <div>Input: {children}</div>),
    Dropdown: jest.fn(({ children }) => <div>Dropdown: {children}</div>)
  };
});
jest.mock('../../../components/repos/top-repos/top-repos.component', () => {
  return jest.fn(({ children }) => <div>Top Repos: {children}</div>)
});
jest.mock('../../../components/repos/starred-repos/starred-repos.component', () => {
  return jest.fn(({ children }) => <div>Starred Repos: {children}</div>)
});

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders top repos tab', () => {
  
  setReactReduxReturns({ useSelector: { starredRepos: { length: 'LenGth' } } });
  const setSelectedTab = jest.fn();
  const setSearchText = jest.fn();
  let useStateIndex = 0, useStateReturns = [
    ['top', setSelectedTab],
    ['searchText', setSearchText]
  ];
  setReactReturnFuncs({ useState: () => useStateReturns[useStateIndex++] });
  
  const reposPageJSX = <ReposPage />;
  const reposPage = render(
    reposPageJSX
  );
  expect(reposPage.asFragment()).toMatchSnapshot();
  
  expect(Menu.mock.calls.length).toEqual(1);
  
  const menuJSX = Menu.mock.calls[0][0];

  const { onClick: onMenuClick, selectedKeys: menuSelectedKeys, mode: menuMode } = menuJSX;
  expect(typeof(onMenuClick)).toEqual('function');
  expect(menuSelectedKeys).toEqual(['top']);
  expect(menuMode).toEqual('horizontal');

  onMenuClick({ key: 'starred' });
  expect(setSelectedTab.mock.calls.length).toEqual(1);
  expect(setSelectedTab.mock.calls[0]).toEqual(['starred']);

  expect(Menu.Item.mock.calls.length).toEqual(2);

  const menuTopReposJSX = menuJSX.children[0];
  const menuStarredReposJSX = menuJSX.children[1];

  expect(menuTopReposJSX.key).toEqual('top');
  expect(menuStarredReposJSX.key).toEqual('starred');

  expect(keys(menuTopReposJSX.props)).toEqual(['icon', 'children']);
  expect(keys(menuStarredReposJSX.props)).toEqual(['icon', 'children']);

  const topReposIcon = menuTopReposJSX.props.icon
  const starredReposIcon = menuStarredReposJSX.props.icon

  expect(render(topReposIcon).asFragment()).toMatchSnapshot();
  expect(render(starredReposIcon).asFragment()).toMatchSnapshot();

  expect(keys(topReposIcon.props)).toEqual(['icon']);
  expect(keys(starredReposIcon.props)).toEqual(['icon']);

  const TopReposFaIcon = topReposIcon.props.icon;
  const StarredReposFaIcon = starredReposIcon.props.icon;

  expect(render(<TopReposFaIcon/>).asFragment()).toMatchSnapshot();
  expect(render(<StarredReposFaIcon/>).asFragment()).toMatchSnapshot();

  expect(Dropdown.mock.calls.length).toEqual(1);
  const dropDownJSX = Dropdown.mock.calls[0][0];

  const { overlay: dropDownOverlayCnt, placement, trigger, children: searchIcon } = dropDownJSX;

  expect(placement).toEqual('bottomCenter');
  expect(trigger).toEqual(['click']);

  expect(render(dropDownOverlayCnt).asFragment()).toMatchSnapshot();
  expect(render(searchIcon).asFragment()).toMatchSnapshot();

  expect(keys(searchIcon.props)).toEqual(['icon']);

  const SearchFaIcon = searchIcon.props.icon;
  expect(render(<SearchFaIcon/>).asFragment()).toMatchSnapshot();

  expect(keys(dropDownOverlayCnt.props)).toEqual(['children']);

  const dropDownOverlay = dropDownOverlayCnt.props.children;
  const { placeholder: searchPlaceholder, value: searchValue, onChange: onSearchChange, style: searchStyle } = dropDownOverlay.props;

  expect(typeof(onSearchChange)).toEqual('function');
  expect(searchPlaceholder).toEqual('Search text');
  expect(searchValue).toEqual('searchText');
  expect(searchStyle).toEqual({ width: '188px', padding: '5px 10px' });

  onSearchChange({ target: { value: 'other search text' } });

  expect(setSearchText.mock.calls.length).toEqual(1);
  expect(setSearchText.mock.calls[0]).toEqual(['other search text']);

  expect(TopRepos.mock.calls.length).toEqual(1);
  expect(StarredRepos.mock.calls.length).toEqual(0);

});

it('renders top starred tab', () => {
  
  setReactReduxReturns({ useSelector: { starredRepos: { length: 'LenGth' } } });
  const setSelectedTab = jest.fn();
  const setSearchText = jest.fn();
  let useStateIndex = 0, useStateReturns = [
    ['starred', setSelectedTab],
    ['searchText', setSearchText]
  ];
  setReactReturnFuncs({ useState: () => useStateReturns[useStateIndex++] });
  
  const reposPageJSX = <ReposPage />;
  const reposPage = render(
    reposPageJSX
  );
  expect(reposPage.asFragment()).toMatchSnapshot();
  
  expect(Menu.mock.calls.length).toEqual(1);
  
  const menuJSX = Menu.mock.calls[0][0];

  const { selectedKeys: menuSelectedKeys } = menuJSX;
  expect(menuSelectedKeys).toEqual(['starred']);

  expect(Dropdown.mock.calls.length).toEqual(1);
  const dropDownJSX = Dropdown.mock.calls[0][0];

  const { trigger: dropDownTrigger } = dropDownJSX;

  expect(dropDownTrigger).toEqual(['hover']);

  expect(TopRepos.mock.calls.length).toEqual(0);
  expect(StarredRepos.mock.calls.length).toEqual(1);

  const starredReposProps = StarredRepos.mock.calls[0][0];
  expect(keys(starredReposProps)).toEqual(['searchText', 'clearSearch']);
  expect(starredReposProps.searchText).toEqual('searchText');
  expect(typeof(starredReposProps.clearSearch)).toEqual('function');

  starredReposProps.clearSearch();
  expect(setSearchText.mock.calls.length).toEqual(1);
  expect(setSearchText.mock.calls[0]).toEqual(['']);

});
