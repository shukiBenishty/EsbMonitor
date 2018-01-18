import React from 'react';

class EsbService extends React.Component {

  constructor(props) {

    super(props);

    this.styles = {
      serviceMenu: {
        position: "absolute",
        top: "19px",
        left: "-147px",
        willChange: "top"
      }
    }

  }

  render() {
    return (<div className="media align-items-center">
              <a className="flexbox align-items-center flex-grow gap-items">
              <div className="media-body text-truncate">
                <h6>{this.props.serviceName}</h6>
                <small>
                  <span>{this.props.address}</span>
                  <span className="divider-dash">SLA: {this.props.sla} sec.</span>
                </small>
              </div>
              </a>
              <span className="lead text-fade mr-25 d-none d-md-block">
                System Affilation
              </span>
              <div className="dropdown">
                <a className="text-lighter">
                  <i className="ti-more-alt rotate-90"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right" x-placement="bottom-end"
                      style={this.styles.serviceMenu}>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item">
                    <i className="fa fa-fw fa-trash">Delete</i>
                  </a>
                </div>
              </div>
            </div>);
  }

};

export default EsbService;
