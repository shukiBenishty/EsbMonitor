import React from 'react';
import Loadable from 'react-loadable';
import { QueryRenderer, graphql } from 'react-relay';

import environment from './Environment';

const LoadableStatsComponent = Loadable({
  loader: () => import('./Stats'),
  loading: () => { return <div>Loading...</div> }
})

const StatsRootQuery = graphql`
  query StatsRendererQuery {
    repository {
      ...Stats_repository

      categories {
        objectId
        name
      }
    }
  }
`;

class StatsRenderer extends React.Component {

  renderQueries({error, props}) {
    if( error ) {
      return (<main className="main-container">
                  <div className="main-content graphqlConnectionError">
                    {error.message}
                  </div>
              </main>)
    } else if ( props ) {

      let categories = props.repository.categories;

      return(<LoadableStatsComponent repository={props.repository}
                                     categories={categories}
              />
            )
    }

    return <div>Loading...</div>
  }

  render() {
    return <QueryRenderer
              environment={environment}
              query={StatsRootQuery}
              variables={{}}
              render={this.renderQueries}
            />
  }

};

export default StatsRenderer;
