import React from 'react';
import { commitMutation, graphql } from 'react-relay';

import environment from './Environment';

const publishServiceMutation = graphql`
  mutation EsbServiceRequest_Mutation ($serviceId: Int) {
    publishServiceRequest(input: $serviceId) {
      objectId
      name
      address
      categoryId
      when_published
    }
  }
`;

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

    this._publishService = this._publishService.bind(this);

  }

  _publishService() {

    const variables = {
      "serviceId": this.props.serviceRequest.objectId
    };

    commitMutation(
      environment,
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

    return <div className="media align-items-center flexbox">
              <a className="align-items-center flex-grow gap-items">
                <div className="media-body text-truncate">
                  <h6>{serviceRequest.address}</h6>
                  <small>
                    <span>{serviceRequest.operationName}</span>
                    <span className="divider-dash">Domain: {serviceRequest.domain}</span>
                  </small>
                </div>
              </a>
              <div className="dropdown">
                <a className="text-lighter" data-toggle="dropdown"
                   aria-haspopup="true">
                  <i className="ti-more-alt rotate-90"></i>
                </a>
                <div className="dropdown-menu">
                    <a className="dropdown-item" onClick={this._publishService}>
                      <span className="icon ti-cloud-up">Publish</span>
                    </a>
                </div>
              </div>
          </div>
  }

}

export default EsbServiceRequest;
