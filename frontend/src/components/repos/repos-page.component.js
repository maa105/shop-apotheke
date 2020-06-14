import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Menu, Input, Dropdown } from 'antd';

import './repos-page.component.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';

import TopRepos from './top-repos/top-repos.component';
import StarredRepos from './starred-repos/starred-repos.component';

const ReposPage = () => {
  const {
    starredRepos
  } = useSelector((state) => state.repos);

  const [selectedTab, setSelectedTab] = useState('top');
  const [searchText, setSearchText] = useState('');
  
  const tabChange = ({ key }) => {
    setSelectedTab(key);
  };

  const localSearchComp = <>
    <Input
      placeholder="Search text"
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
      style={{ width: '188px', padding: '5px 10px' }}
    />
  </>;

  return (
    <div className="repos-page">
      <Menu onClick={tabChange} selectedKeys={[selectedTab]} mode="horizontal">
        <Menu.Item key="top" icon={<FontAwesomeIcon icon={faStar} />}>
          &nbsp;Top Repos
        </Menu.Item>
        <Menu.Item key="starred" icon={<FontAwesomeIcon icon={faUser} />}>
          &nbsp;Starred by me ({starredRepos.length}) <Dropdown overlay={localSearchComp} placement="bottomCenter" trigger={[selectedTab === 'starred' ? 'hover' : 'click']}><FontAwesomeIcon icon={faSearch} /></Dropdown>
        </Menu.Item>
      </Menu>
      { selectedTab === 'top' ? <TopRepos /> : null }
      { selectedTab === 'starred' ? <StarredRepos searchText={searchText} clearSearch={() => setSearchText('')} /> : null }
    </div>
  );
};

export default ReposPage;
