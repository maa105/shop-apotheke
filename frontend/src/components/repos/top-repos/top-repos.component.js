import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Table, Divider, Tag } from 'antd';

import './top-repos.component.css';

import { loadLastWeekTopRepos, changePageSize, toggleRepoStarred as toggleRepoStarredAction, setLanguageFilters } from '../../../actions/repos.actions';

import config from '../../../config';
import { map, isEqual } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';

const TopRepos = () => {
  const dispatch = useDispatch();
  const {
    loadLastWeekTopReposStarted: loadStarted,
    loadLastWeekTopReposPageError: loadError,
  
    lastWeekTopReposPageSize: pageSize,
    lastWeekTopReposSelectedPage: page,
    lastWeekTopReposPageItems: repos,
    lastWeekTopReposTotalItems: total,

    languageFilters,

    starredReposIx
  } = useSelector((state) => state.repos);

  useEffect(() => {
    if(!loadStarted && !repos && !loadError) {
      dispatch(loadLastWeekTopRepos(page || 1));
    }
  }, [loadStarted, repos, loadError]);

  const allLanguageFilters = useMemo(() => {
    return map(config.repos.languages, (l) => ({ text: l, value: l }));
  }, []);

  if(loadError) {
    return <div>Error Loading Data</div>;
  }

  if(!repos) {
    return null;
  }

  const toggleRepoStarred = (repo) => {
    dispatch(toggleRepoStarredAction(repo));
  };

  const onPageChange = (_page) => {
    if(_page !== page) {
      dispatch(loadLastWeekTopRepos(_page));
    }
  };

  const onPageSizeChange = (current, size) => {
    dispatch(changePageSize(size));
  };

  const paginationOptions = {
    current: page,
    pageSize,
    hideOnSinglePage: true,
    pageSizeOptions: config.repos.pageSizeOptions,
    onChange: onPageChange,
    onShowSizeChange: onPageSizeChange,
    total: total <= 1000 ? total : 1000,
    showTotal: (_total) => `Total ${total} items` + (_total !== total ? `. Only top 1000 are searchable` : '')
  };

  const onTableChange = (pagination, filters, sorter, extra) => {
    if(filters) {
      const _languageFilters = [...(filters.language || [])].sort();
      if(!isEqual(_languageFilters, languageFilters)) {
        dispatch(setLanguageFilters(_languageFilters));
      }
    }
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
    width: '25%'
  }, {
    title: 'Language',
    dataIndex: 'language',
    key: 'language',
    filters: allLanguageFilters,
    width: '25%'
  }, {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    width: '50%'
  }, {
    title: 'Stars',
    dataIndex: 'stargazers_count',
    key: 'stars',
    render: (count) => {
      return <Tag>{count}</Tag>
    },
    width: '90px'
  }];

  return <>
    <Divider orientation="left">Top starred repos of last week</Divider>
    <Table dataSource={repos}
      onChange={onTableChange}
      bordered
      columns={reposColumns}
      pagination={paginationOptions}
      locale={{emptyText: languageFilters.length ? 'No repos matching filters' : 'No repos available'}}
    />
  </>;
};

export default TopRepos;
