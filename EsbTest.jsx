import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';

import environemnt from './Environment';
import EsbTestCategory from './EsbTestCategory';
import EsbTestService from './EsbTestService';

const sericesQuery = graphql`
  query EsbTest_Serices_Query {
    services {
      ...EsbTestService_service
    }
    categories {
      ...EsbTestCategory_category
    }
  }
`;

class EsbTest extends React.Component {

  constructor() {
    super();

    this.styles = {
      container: {
        display: 'flex'
      }
    }

    this.renderServices = this.renderServices.bind(this);
  }

  renderServices({error, props}) {
    if( error ) {
      return <div>{error.message}</div>
    } else if( props ) {
      return (<div style={this.styles.container}>
                <div>{
                  props.services.map( (service, index) => {
                    return <EsbTestService key={index} service={service} />
                  })
                }
                </div>
                <div>{
                  props.categories.map( (category, index) => {
                    return <EsbTestCategory key={index} category={category} />
                  })
                }
                </div>
              </div>);
    }

    return <div>Loading...</div>
  }

  render() {

    return (<main className="main-container maxHeight">
              <div className="main-content maxHeight">
              <header className="flexbox align-items-center media-list-header bg-transparent b-0 py-16">

                  <QueryRenderer
                      environment={environemnt}
                      query={sericesQuery}
                      variables={{}}
                      render={this.renderServices}
                  />
                </header>
              </div>
            </main>);
  }

};

export default EsbTest;
