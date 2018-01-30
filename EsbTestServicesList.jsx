import React from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import EsbTestService from './EsbTestService';

class EsbTestServicesList extends React.Component {

  constructor(props) {
    super(props);

    this._refetch = this._refetch.bind(this);
  }

  _refetch() {

    this.props.relay.refetch({"categoryId": 1});
  }

  render() {

    let list = this.props.list;

    return (<div>
              <button title='Refetch' onClick={this._refetch}>Refresh</button>
              {list.map( (service, index) => <EsbTestService key={index} service={service} /> )}
            </div>);
  }

};

// export default createFragmentContainer(EsbTestServicesList,
// graphql`
//   fragment EsbTestServicesList_list on Service @relay(plural: true){
//     ...EsbTestService_service
//   }
// `);

export default createRefetchContainer(EsbTestServicesList,
graphql`
   fragment EsbTestServicesList_list on Service @relay(plural: true){
     ...EsbTestService_service
   }
`,
graphql`
  query EsbTestServicesListRefetchQuery($categoryId: Int) {
    services(categoryId: $categoryId) {
      ...EsbTestServicesList_list
      id
    }
  }
`);
