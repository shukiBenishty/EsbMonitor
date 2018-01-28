import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import EsbTestService from './EsbTestService';

class EsbTestServicesList extends React.Component {

  render() {

    let list = this.props.list;

    return (<div>
              {list.map( (service, index) => <EsbTestService key={index} service={service} /> )}
            </div>);
  }

};

export default createFragmentContainer(EsbTestServicesList,
graphql`
  fragment EsbTestServicesList_list on Service @relay(plural: true){
    ...EsbTestService_service
  }
`);
