// @flow
import React from 'react';
import { connect } from 'react-redux'

type Props = {

};

type State = {
  filterValue: String,
  activeTracing: Boolean
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
      activeTracing: true
    }
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

  _toggleActiveTracing() {

    this.setState({
      activeTracing: !this.state.activeTracing
    }, () => { // supply callback because setState is async,
               // so change to activeTracing is not applied immediately
      this.props.dispatch({
        type: 'ACTIVE_TRACING',
        data: {
          activeTracing: this.state.activeTracing
        }
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
        <button className='btn btn-danger btn-round btn-square btn-filter'
          onClick={::this._toggleActiveTracing}>
          <i className="ti-power-off"></i>
        </button>
        <button className='btn btn-info btn-round btn-square btn-filter'
          onClick={::this._cleanEvents}>
          <i className="ti-eraser"></i>
        </button>
        <input type="text" className='btn-filter'
               value={this.state.filterValue}
               placeholder="Filter"
               onChange={evt => this.updateFilterValue(evt)}  />
      </div>
    );
  }

}

export default connect()(EventsFilter);
