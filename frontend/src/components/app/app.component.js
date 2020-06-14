import React from 'react';
import { useSelector } from 'react-redux';

import './app.component.css';

import ReposPage from '../repos/repos-page.component';

import LayoutComponent from '../layout/layout.component';

const AppComponent = () => {

  const { page } = useSelector((state) => state.router.routerState);

  return (
    <LayoutComponent>
      { page === 'repos' ? <ReposPage /> : null }
    </LayoutComponent>
  );
};

export default AppComponent;
