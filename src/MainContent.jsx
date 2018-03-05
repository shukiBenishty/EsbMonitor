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

const MainContent = () => {

  return (<Switch>
                <Route exact path='/' component={Dashboard} />
                <Route path='/realtime' component={EventList} />
                <Route path='/stat' component={StatsRenderer} />
                <Route path='/analyze' component={Analyze} />
                <Route path="/admin" component={EsbAdminRenderer} />
          </Switch>);
}

export default MainContent;
