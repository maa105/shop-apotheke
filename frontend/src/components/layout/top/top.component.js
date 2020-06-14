import React from 'react';
import { Menu } from 'antd';
import { pushRouterState } from 'react-router-maa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGitAlt } from '@fortawesome/free-brands-svg-icons';

import './top.component.css';
import { useSelector } from 'react-redux';

const TopComponent = () => {
  const { page } = useSelector((state) => state.router.routerState)
  
  const selectedKeys = [];
  selectedKeys.push(page);
  
  const handleClick = ({ key }) => {
    switch(key) {
      case 'repos':
        if(page !== 'repos') {
          pushRouterState({ page: 'repos' });
        }
        break;
      default:
        break;
    }
  }

  return (
    <Menu onClick={handleClick} selectedKeys={selectedKeys} mode="horizontal" theme="dark">
      <Menu.Item key="repos" icon={<FontAwesomeIcon icon={faGitAlt} />}>
        &nbsp;Repos
      </Menu.Item>
    </Menu>
  );
};

export default TopComponent;
