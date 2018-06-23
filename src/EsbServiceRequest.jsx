// @flow
import React from 'react';
import { commitMutation, createFragmentContainer, graphql } from 'react-relay';

import environment from './Environment';

class EsbServiceRequest extends React.Component<{}> {

  constructor(props) {

    super(props);

    this.styles = {
      serviceMenu: {
        position: "absolute",
        top: "19px",
        left: "-147px",
        willChange: "top, left"
      }

    }

  }

  _publishService() {

    const variables = {
      "serviceId": this.props.serviceRequest.objectId
    };

    commitMutation(
      this.props.relay.environment,
      {
        mutation: publishServiceMutation,
        variables,
        onCompleted: (response, errors) => {
          console.log(response);
        },
        onError: err => console.error(err)
      });
  }

  render() {

    let serviceRequest = this.props.serviceRequest;
    // if( serviceRequest.objectId == null )
    //   return null;

    return <div className="media align-items-center flexbox bg-white b-1">
              <a className="align-items-center flex-grow gap-items">
                <div className="media-body text-truncate">
                  <h6>{serviceRequest.address}</h6>
                  <small>
                    <span>{serviceRequest.name} (ID: {serviceRequest.objectId} )</span>
                    <span className="divider-dash">Environment: {serviceRequest.environment}</span>
                  </small>
                </div>
              </a>
              <div className="dropdown">
                <a className="text-lighter" data-toggle="dropdown"
                   aria-haspopup="true">
                  <i className="ti-more-alt rotate-90"></i>
                </a>

              </div>
          </div>
  }

}

export default createFragmentContainer(EsbServiceRequest,
graphql`
  fragment EsbServiceRequest_serviceRequest on ServiceRequest {
        id
        name
        objectId
        address
        sla
        environment
        categoryId
  }
`);
