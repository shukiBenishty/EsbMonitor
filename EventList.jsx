// @flow
import React from 'react';
import { connect } from 'react-redux'
import * as JsSearch from 'js-search';

import EventsFilter from './EventsFilter';
import EsbEvent from './EsbEvent';
import EsbStatus from './EsbStatus';

import { AutoSizer, List , Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css'; // no CSS modules!!!

type Props = {
  eventId: number,
  issued: Date
};


type State = {
    esbEvents: Array<Object>
}

class EventList extends React.Component<Props, State> {

  vTable: Object;
  styles: Object;
  search: Object;

  constructor(props) {
    super(props);

    this.state = {
      esbEvents: [],
    }

    this.styles = {
      eventListFrame: {
        height: "92%",
        minHeigth: "410px",
        display: "flex",
        flexDirection: "column"
      }

    }

    this.rowRenderer = this.rowRenderer.bind(this);
  }

  componentDidMount() {
    this.search = new JsSearch.Search('eventId');
    // this.search.addDocuments([{eventId: 'ab'}, {eventId: 'cd'}, {eventId: 'ef'}]);
    //this.search.addIndex('eventId');
  }

  componentWillReceiveProps(nextProps){

    if( nextProps.filterValue ) {
      let filteredEvents = this.search.search(nextProps.filterValue);
      console.log(filteredEvents.length);
    }

    const esbEvent = {
      storyId: nextProps.storyId,
      serviceName: nextProps.serviceName,
      message: nextProps.message,
      eventId: nextProps.eventId,
      issued: nextProps.issued,
      status: nextProps.status
    }

    this.setState( prevState => ({
      esbEvents: [...this.state.esbEvents, {
                      storyId: esbEvent.storyId,
                      serviceName: esbEvent.serviceName,
                      message: esbEvent.message,
                      eventId: esbEvent.eventId,
                      issued: esbEvent.issued,
                      status: esbEvent.status
                    }
                ]
    }));

    this.search.addDocuments({
                    storyId: esbEvent.storyId,
                    serviceName: esbEvent.serviceName,
                    eventId: esbEvent.eventId.toString(),
                    issued: esbEvent.issued
                  });
    this.search.addIndex('eventId');
    this.search.addIndex('serviceName');
    this.search.addIndex('message');
    this.search.addIndex('issued');
  }

  rowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }) {

    if( this.state.esbEvents.length > 0 ) {

      this.vTable.scrollToRow(index);

      return (<div key={key} style={style}>
                <EsbEvent data={this.state.esbEvents[index]}/>
              </div>)
    } else {
      return(<div key={key} style={style}>No events</div>)
    }

  }

  render() {

    return(<main className="main-container maxHeight">
              <div className="main-content maxHeight">
              <EventsFilter />
              <div style={this.styles.eventListFrame}>
                <AutoSizer >
                    {({ height, width }) => (

                      <Table ref={c => { this.vTable = c; }}
                        width={width}
                        height={400}
                        headerHeight={20}
                        rowHeight={60}
                        rowCount={this.state.esbEvents.length}
                        rowGetter={({ index }) => this.state.esbEvents[index]}
                        rowRenderer={this.rowRenderer}>

                      </Table>
                    )}
              </AutoSizer>
              </div>
              <EsbStatus filter={this.props.filterValue}/>
            </div>
          </main>)
  }

}

function mapStateToProps(state) {
  return {
      storyId: state.storyId,
      serviceName: state.serviceName,
      message: state.message,
      eventId: state.eventId,
      issued: state.issued,
      status: state.status,
      filterValue: state.filterValue
  }
}

export default connect(mapStateToProps)(EventList);
