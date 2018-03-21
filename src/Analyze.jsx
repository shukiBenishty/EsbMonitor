// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Story from './Story';
import Search from './Search';

const Analyze = ({ match }) => {

    return(
      <main className="main-container">
        <div className="main-content">
          <div className='tab-content'>

            <Switch>
              <Route exact path={match.url} component={Search} />
              <Route path={match.url + '/story/:storyId'} component={Story} />
            </Switch>

          </div>

        </div>
      </main>
    );
};

export default Analyze;
