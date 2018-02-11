import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';

import environment from './Environment';
import EsbAdmin from './EsbAdmin';

const rootQuery = graphql`
  query EsbAdminRendererQuery {
    repository {
      services {
        ...EsbService_service
      }

      categories {
        objectId
        name
      }

      serviceRequests {
        objectId
        operationName
        address
        domain
        created
      }
    }
  }
`;

class EsbAdminRenderer extends React.Component {

  renderQueries({error, props}) {
    if( error ) {
      return <div>{error.message}</div>
    } else if ( props ) {

      let categories = props.repository.categories;

      return(<EsbAdmin repository={props.repository}
                       categories={categories}
              />
            )
    }

    return <div>Loading...</div>
  }

  render() {

      //return (<div>EsbAdminRenderer</div>);

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
