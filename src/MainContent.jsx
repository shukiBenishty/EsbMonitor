// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { QueryRenderer } from 'react-relay';
import environment from './Environment';

import Dashboard from './Dashboard';
import EventList from './EventList';
import Analyze from './Analyze';
import EsbAdminRenderer from './EsbAdminRenderer';
import StatsRenderer from './StatsRenderer';

import Search from './Search';
import Story from './Story';

class MainContent extends React.Component {

  componentDidCatch = (error, info) => {
    if( error )
      console.log(error); // TBD: use JS error reporting service here, e.g. Crashlistics
  }

  render() {

      return (<Switch>
                    <Route exact path='/' component={Dashboard} />
                    <Route path='/realtime' component={EventList} />
                    <Route path='/stat' component={StatsRenderer} />
                    <Route path='/analyze' component={Analyze} />
                    <Route path="/admin" component={EsbAdminRenderer} />
              </Switch>);
  }
}

export default MainContent;
