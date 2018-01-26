import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

class EsbTestItem extends React.Component {

  render() {

    const service = this.props.service;

    return (<div>{service.name}
            </div>)
  }

};

export default createFragmentContainer(EsbTestItem,
  graphql`
    fragment EsbTestService_service on Service {
      name
    }
  `
)
