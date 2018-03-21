import React from 'react';
import Loadable from 'react-loadable';
import { QueryRenderer, graphql } from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import environment from './Environment';

const LoadableEsbAdminComponent = Loadable({
  loader: () => import('./EsbAdmin'),
  loading: () => { return <div>Loading...</div> }
})

const rootQuery = graphql`
  query EsbAdminRendererQuery {
    repository {

      categories {
        objectId
        name
      }

      ...EsbAdmin_repository
    }
  }
`;

class EsbAdminRenderer extends React.Component {

  renderQueries({error, props}) {
    if( error ) {
      return <div>{error.message}</div>
    } else if ( props ) {

      let categories = props.repository.categories;

      return(<MuiThemeProvider>
                <LoadableEsbAdminComponent repository={props.repository}
                       categories={categories} />
             </MuiThemeProvider>
            )
    }

    return <div>Loading...</div>
  }

  render() {

      return (<QueryRenderer
                  environment={environment}
                  query={rootQuery}
                  variables={{}}
                  render={this.renderQueries}
              />
      );
    }

}



export default EsbAdminRenderer;
