// @flow
import React from 'react';
import { connect } from 'react-redux';
import EsbEvent from './EsbEvent';

import { List } from 'react-virtualized';

class EventList extends React.Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      esbEvents: []
    }

    this.rowRenderer = this.rowRenderer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const esbEvent = {
      eventId: nextProps.eventId,
      issued: nextProps.issued
    }

    this.setState( prevState => ({
      esbEvents: [...this.state.esbEvents, {
        eventId: esbEvent.eventId,
        issued: esbEvent.issued
      }]
    }));

  }

  rowRenderer({key, // Unique key within array of raows
              index, // Index of row within collection
              isScrolling,
              isVisible, // Thsi row is visible within the List
              style // Style object to be applied to row (to position it)
            }){
    if( this.state.esbEvents.length > 0 ) {

      this.vList.scrollToRow(index);

      return (<div key={key} style={style}>
                <EsbEvent data={this.state.esbEvents[index]} />
              </div>)
    } else {
      return (<div key={key} style={style}>No events</div>)
    }
  }

  render() {
    return (<List ref={ c => {this.vList = c;} }
                  width={300}
                  height={300}
                  rowCount={this.state.esbEvents.length}
                  rowHeight={20}
                  rowRenderer={this.rowRenderer}
            />);
  }

};

function mapStateToProps(state) {
  return {
    eventId: state.eventId,
    issued: state.issued
  }
}

export default connect(mapStateToProps)(EventList);
