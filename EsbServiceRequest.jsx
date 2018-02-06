import React from 'react';

class EsbServiceRequest extends React.Component {

  render() {

    let serviceRequest = this.props.serviceRequest;

    return <div className="media align-items-center">
              <a className="flexbox align-items-center flex-grow gap-items">
                <div className="media-body text-truncate">
                  <h6>{serviceRequest.address}</h6>
                  <small>
                    <span>{serviceRequest.objectId}</span>
                    <span className="divider-dash">SLA: {serviceRequest.domain}</span>
                  </small>
                </div>
              </a>
          </div>
  }

}

export default EsbServiceRequest;
