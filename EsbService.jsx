import React from 'react';
import { createFragmentContainer,
         commitMutation,
         graphql } from 'react-relay';

import environment from './Environment';

const disableServiceMutation = graphql`
  mutation EsbService_DisableService_Mutation ($serviceId: Int) {

    disableService(input: $serviceId) {
      objectId
      when_published
      address
    }
  }
`;

const deleteServiceMutation = graphql`
  mutation EsbService_DeleteService_Mutation ($serviceId: Int) {

    deleteService(input: $serviceId) {
      objectId
      when_published
      address
    }
  }
`;

class EsbService extends React.Component {

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

    this._disableService = this._disableService.bind(this);
    this._deleteService = this._deleteService.bind(this);

  }

  _disableService() {
    const variables = {
      "serviceId": this.props.service.objectId
    };

    commitMutation(
      environment,
      {
        mutation: disableServiceMutation,
        variables,
        onCompleted: (response, errors) => {
          console.log(response);
        },
        onError: err => console.error(err)
      });
  }

  _deleteService() {

    const variables = {
      "serviceId": this.props.service.objectId
    };

    commitMutation(
      environment,
      {
        mutation: deleteServiceMutation,
        variables,
        onCompleted: (response, errors) => {
          console.log(response);
        },
        onError: err => console.error(err)
      });

  }

  render() {

    let service = this.props.service;

    return (<div className="media align-items-center">
              <a className="flexbox align-items-center flex-grow gap-items">
                <div className="media-body text-truncate">
                  <h6>{service.name}</h6>
                  <small>
                    <span>{service.address}</span>
                    <span className="divider-dash">SLA: {service.sla} sec.</span>
                  </small>
                </div>
              </a>
              <span className="lead text-fade mr-25 d-none d-md-block">
                System Affiliation
              </span>
              <div className="dropdown">
                <a className="text-lighter" data-toggle="dropdown">
                  <i className="ti-more-alt rotate-90"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right"
                      x-placement="bottom-end"
                      style={this.styles.serviceMenu}>
                  <a className="dropdown-item" onClick={this._disableService}>
                    <div className="row">
                      <span className='icon ti-hand-stop' />
                      <div className='actionItem'>Disable</div>
                      </div>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" onClick={this._deleteService}>
                    <div className="row">
                        <span className='icon ti-trash' />
                        <div className='actionItem'>Delete</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>);
  }

};

export default createFragmentContainer(EsbService,
  graphql`
    fragment EsbService_service on Service {
      objectId
      name
      address
      sla
    }
  `
);
