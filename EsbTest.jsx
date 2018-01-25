import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';

import environemnt from './Environment';
import EsbTestItem from './EsbTestItem';

const sericesQuery = graphql`
  query EsbTest_Serices_Query {
    services {
        ...EsbTestItem_service
    }
  }
`;

class EsbTest extends React.Component {

  renderServices({error, props}) {
    if( error ) {
      return <div>{error.message}</div>
    } else if( props ) {
      return (<div>{
                props.services.map( (service, index) => {
                  return <EsbTestItem key={index} service={service} />
                })
              }
              </div>);
    }

    return <div>Loading...</div>
  }

  render() {

    return (<div>
              <QueryRenderer
                  environment={environemnt}
                  query={sericesQuery}
                  variables={{}}
                  render={this.renderServices}
                />
            </div>);
  }

};

export default EsbTest;
