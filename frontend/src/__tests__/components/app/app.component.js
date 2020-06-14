import React from 'react';
import { render } from '@testing-library/react';

import AppComponent from '../../../components/app/app.component';
import LayoutComponent from '../../../components/layout/layout.component';
import { setState } from 'react-redux';

jest.mock('../../../components/layout/layout.component', () => {
  return jest.fn(() => <div>Layout Mock</div>)
});
jest.mock('../../../components/repos/repos-page.component.js', () => {
  return jest.fn(() => <div>Repos Page</div>)
});

jest.mock('react-redux', () => {
  var state = {};
  return {
    setState: (_state) => { state = _state; },
    useSelector: jest.fn((f) => f(state))
  }
});

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders nulls for invalid page', () => {
  setState({ router: { routerState: { page: 'page' } } });
  const component = render(
    <AppComponent />
  );
  expect(component.asFragment()).toMatchSnapshot();
  
  expect(LayoutComponent.mock.calls.length).toEqual(1);
  
  const children = LayoutComponent.mock.calls[0][0].children;

  expect(children).toEqual(null);
});

it('renders repos page', () => {
  setState({ router: { routerState: { page: 'repos' } } });
  const component = render(
    <AppComponent />
  );
  expect(component.asFragment()).toMatchSnapshot();
  
  expect(LayoutComponent.mock.calls.length).toEqual(1);
  
  const appChildren = LayoutComponent.mock.calls[0][0].children;

  expect(appChildren).not.toEqual(null);

  const reposComponent = render(appChildren);
  expect(reposComponent.asFragment()).toMatchSnapshot();
});
