// @flow
import React from 'react';
import classNames from 'classnames';

import EsbService from './EsbService';

const mockServices = [
  { serviceName: 'Service Name A', address: 'http://iis07/apps/s1.svc', sla: 2},
  { serviceName: 'Service Name B', address: 'http://iis07/apps/s2.svc', sla: 1.3}
];

type Props = {
};

type State = {
  servicePanelVisible: boolean
}

class EsbAdmin extends React.Component<Props, State> {

  // state = {
  //   servicePanelVisible: false
  // };

  constructor() {
    super();

    this.state = {
      servicePanelVisible: false
    };

    this._addService = this._addService.bind(this);
    this._openServicePanel = this._openServicePanel.bind(this);
    this._closeServicePanel = this._closeServicePanel.bind(this);
  }

  _addService() {
    // TBD
    console.log('Adding new service');

    this.setState({
        servicePanelVisible: false
    })

  }

  _openServicePanel() {

    this.setState({
      servicePanelVisible: true
    })
  }

   _closeServicePanel() {

    this.setState({
        servicePanelVisible: false
    })
  }

  render() {

    var servicePanelClass = classNames('quickview', 'quickview-lg', {
      'reveal': this.state. servicePanelVisible
    });


    return (<main className="main-container maxHeight">
                <div className="main-content maxHeight">
                  <div className="media-list media-list-divided media-list-hover">
                    <header className="flexbox align-items-center media-list-header bg-transparent b-0 py-16 pl-20">
                      <div className="flexbox align-items-center">
                      </div>
                    </header>
                    <div className="media-list-body bg-white b-1">
                    {
                      mockServices.map( (service, index) => {
                          return <EsbService key={index} {...service} />
                      })
                    }
                    </div>
                  </div>
                </div>
                <div className="fab fab-fixed">
                 <a className="btn btn-float btn-primary" onClick={this._openServicePanel}>
                   <i className="ti-plus"></i>
                 </a>
                </div>
                <div className={servicePanelClass}>
                  <header className="quickview-header">
                    <p className='quickview-title lead fw-400'>Add new service</p>
                    <span onClick={this._closeServicePanel}>
                      <i className="ti-close"></i>
                    </span>
                  </header>
                  <div className="quickview-body ps-container ps-theme-default ps-active-y">
                    <div className="quickview-block form-type-material">
                      <h6>Service Details</h6>
                      <div className="form-group">
                        <input type="text" className="form-control" />
                        <label>Name</label>
                      </div>
                      <div className="form-group">
                        <input type="text" className="form-control" />
                        <label>Address (URL)</label>
                      </div>
                      <div className="form-group">
                        <input type="text" className="form-control" />
                        <label>Expected SLA</label>
                      </div>
                      <div className="form-group">
                        <input type="text" className="form-control" />
                        <label>Affiliated System</label>
                      </div>

                    </div>
                  </div>
                  <footer className="p-12 text-right">
                    <button className="btn btn-flat btn-primary"
                      onClick={this._addService}>Add service</button>
                  </footer>
                </div>
            </main>
         );

  }

};

export default EsbAdmin;
