import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';

import environemnt from './Environment';
import EsbTestCategories from './EsbTestCategories';
import EsbTestServices from './EsbTestServices';

const sericesQuery = graphql`
  query EsbTest_Services_Query($categoryId: ID!) {
    categories {
      ...EsbTestCategories_categories
    }
    category(id: $categoryId) {
      name
      services {
        ...EsbTestServices_list
      }
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
                  <EsbTestCategories categories={props.categories} />
                  <EsbTestServices list={props.category.services} />
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
                      variables={{categoryId: 2}}
                      render={this.renderServices}
                  />
                </header>
              </div>
            </main>);
  }

};

export default EsbTest;
