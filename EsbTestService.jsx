import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

class EsbTestItem extends React.Component {

  render() {

    const service = this.props.service;

    return (<h5>
                {service.name}
            </h5>);
  }

};

export default createFragmentContainer(EsbTestItem,
  graphql`
    fragment EsbTestService_service on Service {
      id
      name
    }
  `
)
