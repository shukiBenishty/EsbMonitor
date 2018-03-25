// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { Switch, Route } from 'react-router-dom';

import Story from './Story';
import Search from './Search';

// const LoadableStoryComponent = Loadable({
//   loader: () => import('./Story'),
//   loading: () => { return <div>Loading...</div> }
// })
//
// const LoadableSearchComponent = Loadable({
//   loader: () => import('./Story'),
//   loading: () => { return <div>Loading...</div> }
// })

const Analyze = ({ match }) => {

    return(
      <main className="main-container">
        <div className="main-content">
          <div className='tab-content'>

            <Switch>
              <Route path={match.url + '/:searchText'} component={Search} />
              <Route path={match.url + '/story/:storyId'} component={Story} />
            </Switch>

          </div>
        </div>
      </main>
    );
};

export default Analyze;
