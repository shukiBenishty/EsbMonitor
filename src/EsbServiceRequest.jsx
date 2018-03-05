// @flow
import React from 'react';
import { commitMutation, createFragmentContainer, graphql } from 'react-relay';

import environment from './Environment';

const publishServiceMutation = graphql`
  mutation EsbServiceRequest_Publish_Mutation ($serviceId: Int) {
    publishServiceRequest(input: $serviceId) {
      objectId
      name
      address
      categoryId
      when_published
    }
  }
`;

const deleteServiceRequestMutation = graphql`
  mutation EsbServiceRequest_DeleteRequest_Mutation ($serviceRequestId: Int) {
    deleteServiceRequest(requestId: $serviceRequestId) {
      id
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
    this._deleteServiceRequest = this._deleteServiceRequest.bind(this);
  }

  _deleteServiceRequest() {

    const variables = {
      "serviceRequestId": this.props.serviceRequest.objectId
    };

    commitMutation(
      this.props.relay.environment,
      {
        mutation: deleteServiceRequestMutation,
        variables,
        updater: (proxyStore: RecordSourceSelectorProxy) => {

            const payloadProxy = proxyStore.getRootField('deleteServiceRequest');
            const _id = payloadProxy.getValue('id');

            proxyStore.delete(_id);

        },
        onCompleted: (response, errors) => {
          console.log(response);
        },
        onError: err => console.error(err)
      });

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
                <div className="dropdown-menu">
                    <a className="dropdown-item" onClick={this._publishService}>
                      <div className="row">
                        <span className="col-2 icon ti-cloud-up" />
                        <div className="col-8 actionItem">Publish</div>
                      </div>
                    </a>
                    <a className="dropdown-item" onClick={this._deleteServiceRequest}>
                      <div className="row">
                        <span className="col-2 icon ti-trash" />
                        <div className="col-8 actionItem">Delete&nbsp;Request</div>
                      </div>
                    </a>
                </div>
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
