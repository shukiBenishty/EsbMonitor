import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

const EsbTestService = ({service}) => {

  return (<h5>{service.name}</h5>);

};

export default createFragmentContainer(EsbTestService,
  graphql`
    fragment EsbTestService_service on Service {
      id
      name
    }
  `
)
