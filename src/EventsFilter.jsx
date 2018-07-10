// @flow
import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

type Props = {

};

type State = {
  filterValue: String,
  activeTracing: Boolean
}

class EventsFilter extends React.Component<Props, State> {

  state = {
    filterValue: '',
    activeTracing: true
  }

  constructor(props) {
    super(props);

    this.styles = {
      filterStyle: {
        backgroundColor: '#d3d3d3',
        display: 'flex',
        flexDirection: 'row'
      }
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

    let playButtonClass = 'ti-control-pause';
    let playButtonText = 'Stop collecting events';
    if( !this.state.activeTracing ) {
      playButtonClass = 'ti-control-play';
      playButtonText = 'Start collecting events';
    }

    return(
      <div style={this.styles.filterStyle}>
        <button data-tip data-for='btnPlayStop'
           className='btn btn-danger btn-round btn-square btn-filter'
          onClick={::this._toggleActiveTracing}>
          <i className={playButtonClass}></i>
        </button>
        <ReactTooltip id='btnPlayStop' aria-haspopup='true'>
          <span>{playButtonText}</span>
        </ReactTooltip>
        <button data-tip data-for='btnClear'
          className='btn btn-info btn-round btn-square btn-filter'
          onClick={::this._cleanEvents}>
          <i className="ti-eraser"></i>
        </button>
        <ReactTooltip id='btnClear' aria-haspopup='true'>
          <span>Clear events list</span>
        </ReactTooltip>
        <input type="text" className='btn-filter'
               value={this.state.filterValue}
               placeholder="Filter"
               onChange={evt => this.updateFilterValue(evt)}  />
      </div>
    );
  }

}

export default connect()(EventsFilter);
