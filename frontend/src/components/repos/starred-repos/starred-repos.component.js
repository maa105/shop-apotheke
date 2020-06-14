import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Table } from 'antd';

import './starred-repos.component.css';

import { toggleRepoStarred as toggleRepoStarredAction } from '../../../actions/repos.actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faExternalLinkAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { getStrSorter } from '../../../utils';
import { useSearcher, useDebounce } from '../../../utils/hooks.utils';

const StarredRepos = ({ searchText: _searchText, clearSearch }) => {
  const dispatch = useDispatch();
  const {
    starredRepos,
    starredReposIx
  } = useSelector((state) => state.repos);

  const searchText = useDebounce(_searchText);

  const filteredStarredRepos = useSearcher(starredRepos, ['name', 'description', 'language'], searchText);
  
  const toggleRepoStarred = (repo) => {
    dispatch(toggleRepoStarredAction(repo));
  };

  const reposColumns = [{
    title: () => <>
      Name&nbsp;<FontAwesomeIcon className="repos-name-header-ico" icon={faExternalLinkAlt} title="Click in the names to go to github repo" />
    </>,
    dataIndex: 'name',
    key: 'name',
    render: (name, repo) => <>
      <a className="repos-star-repo-icon" onClick={() => toggleRepoStarred(repo)} title="Click to star/unstar"><FontAwesomeIcon icon={starredReposIx[repo.id] ? faStar : faStarOutline} /></a>
      &nbsp;
      <a className="repos-star-repo-link" href={repo.html_url} target="_blank">{name}&nbsp;<FontAwesomeIcon icon={faExternalLinkAlt} /></a>
    </>,
    sorter: getStrSorter('name')
  }, {
    title: 'Language',
    dataIndex: 'language',
    key: 'language',
    sorter: getStrSorter('language')
  }, {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    sorter: getStrSorter('description')
  }];

  return <>
    { searchText.length >= 3 ? <div className="starred-repos-search-message">Filtered for "{searchText}" <a className="starred-repos-clear-search" onClick={clearSearch} title="Clear search"><FontAwesomeIcon icon={faTimes} /></a></div> : null }
    <Table dataSource={filteredStarredRepos}
      bordered
      columns={reposColumns}
      pagination={{
        pageSize: 10,
        hideOnSinglePage: true,
        showTotal: (total) => `Total ${total} items`
      }}
      locale={{emptyText: 'No starred repos yet. Click on the star in the Name column of "Top" tab to star repos.'}}
    />
  </>;
};

export default StarredRepos;
