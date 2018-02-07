import React from 'react';

class EsbServiceRequest extends React.Component {

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
                <a className="text-lighter" data-toggle="dropdown">
                  <i className="ti-more-alt rotate-90"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right"
                    x-placement="bottom-end"
                    style={this.styles.serviceMenu}>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item">
                      <span className="icon ti-cloud-up">Publish</span>
                    </a>
                </div>
              </div>
          </div>
  }

}

export default EsbServiceRequest;
