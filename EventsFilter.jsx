import React from 'react';
import { connect } from 'react-redux'

class EventsFilter extends React.Component {

  constructor(props) {
    super(props);

    this.styles = {
      filterStyle: {
        backgroundColor: '#d3d3d3'
      }
    }

    this.state ={
      filterValue: ''
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

  render() {
    return(
      <div style={this.styles.filterStyle}>
        <input type="text"
               value={this.state.filterValue}
               placeholder="Filter"
               onChange={evt => this.updateFilterValue(evt)}  />
      </div>
    );
  }

}

export default connect()(EventsFilter);
