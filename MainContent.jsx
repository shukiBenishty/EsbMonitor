// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import EventList from './EventList';
import Stats from './Stats';
import Analyze from './Analyze';

class MainContent extends React.Component<{}> {

  render() {
    return (<Switch>
                  <Route exact path='/' component={EventList} />
                  <Route path='/stats' component={Stats} />
                  <Route path='/analytics' component={Analyze} />
            </Switch>);
  }

};

export default MainContent;
