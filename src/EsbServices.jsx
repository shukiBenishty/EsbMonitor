// @flow
import React from 'react';
import Select from 'react-select';

import classNames from 'classnames';

class EsbServices extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedServices: props.selectedServices,
      onChange: props.onChange
    }

    this._serviceChanged = this._serviceChanged.bind(this);
  }

  get selectedServices() {
    return this.state.selectedServices;
  }

  _serviceChanged(services) {
    this.setState({
      selectedServices: services
    })

    if( this.state.onChange ) {
      this.state.onChange(services);
    }
  }

  render() {

    let disabled = this.props.disabled;
    let className = this.props.className;

    const { selectedServices } = this.state;

    let services = this.props.services.list.map( service => (
        {
          value: service.objectId,
          label: service.name
        }
    ))

    return <Select
              className={className}
              multi
              simpleValue
              disabled={disabled}
              removeSelected={true}
              name="servicesSelector"
              placeholder="Select service"
              options={services}
              value={selectedServices}
              onChange={this._serviceChanged}
           />
  }

}

export default EsbServices;
