// @flow
import React from 'react';
import { connect } from 'react-redux'

type Props = {

};

type State = {
  filterValue: String,
  socketSwitch: Boolean
}

class EventsFilter extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    this.styles = {
      filterStyle: {
        backgroundColor: '#d3d3d3',
        display: 'flex',
        flexDirection: 'row'
      }
    }

    this.state ={
      filterValue: '',
      socketSwitch: true
    }

    this._toggleSocket = this._toggleSocket.bind(this);
    this._cleanEvents = this._cleanEvents.bind(this);
  }

  updateFilterValue(evt) {
    this.setState({
        filterValue: evt.target.value
    });

    this.props.dispatch({
      type: 'FILTER_CHANGED',
      data: {
        filterValue: evt.target.value
      }

    })
  }

  _toggleSocket() {

    this.setState({
      socketSwitch: !this.state.socketSwitch
    }, () => { // supply callback because setState is async,
               // so change to socketSwitch is not applied immediately
      this.props.dispatch({
        type: 'TOOGLE_SOCKET',
        switch: this.state.socketSwitch
      });
    })

  }

  _cleanEvents() {
    this.props.dispatch({
      type: 'CLEAN_EVENTS'
    })
  }

  render() {
    return(
      <div style={this.styles.filterStyle}>
        <button className="btn btn-danger btn-round btn-square"
          onClick={this._toggleSocket}>
          <i className="ti-power-off"></i>
        </button>
        <button className="btn btn-info btn-round btn-square"
          onClick={this._cleanEvents}>
          <i className="ti-eraser"></i>
        </button>
        <input type="text"
               value={this.state.filterValue}
               placeholder="Filter"
               onChange={evt => this.updateFilterValue(evt)}  />
      </div>
    );
  }

}

export default connect()(EventsFilter);
