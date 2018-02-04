// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import EventList from './EventList';
import Stats from './Stats';
import Analyze from './Analyze';
import EsbAdmin from './EsbAdmin';
import StatsRenderer from './StatsRenderer';

const MainContent = () => {

  return (<Switch>
                <Route exact path='/' component={Dashboard} />
                <Route path='/realtime' component={EventList} />
                <Route path='/stat' component={StatsRenderer} />
                <Route path='/analytics' component={Analyze} />
                <Route path="/admin" component={EsbAdmin} />
          </Switch>);

}

export default MainContent;
