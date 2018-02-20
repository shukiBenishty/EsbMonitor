// @flow
import React from 'react';
import { graphql, requestSubscription } from 'react-relay';
import { connect } from 'react-redux'
import * as JsSearch from 'js-search';

import EventsFilter from './EventsFilter';
import EsbEvent from './EsbEvent';
import EsbStatus from './EsbStatus';
import environment from './Environment';

//import RealtimeEventsSubscription from './RealtimeEventsSubscription';

import { AutoSizer, List , Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css'; // no CSS modules!!!

const realtimeEventsSubscription = graphql`
  subscription EventList_Subscription {
    traceAdded {
      id
      storyId
      time
      serviceName
      serviceId
      message
      eventId
      status
    }
  }
`;

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
    this.publishEsbEvent = this.publishEsbEvent.bind(this);
  }

  publishEsbEvent(payload) {

    this.props.dispatch({
      type: 'NEW_EVENT',
          data: {
            storyId: payload.storyId,
            serviceName: payload.serviceName,
            message: payload.message,
            eventId: payload.eventId,
            issued: payload.time,
            status: payload.status
          }
    })
  }

  componentDidMount() {
    this.search = new JsSearch.Search('eventId');
    // this.search.addDocuments([{eventId: 'ab'}, {eventId: 'cd'}, {eventId: 'ef'}]);
    //this.search.addIndex('eventId');

    const self = this;
    const subscriptionConfig = {
      subscription: realtimeEventsSubscription,
      variables: {},
      onNext: payload => {

        // TBD: Temporay solution: change this to use Relay fragment!
        self.publishEsbEvent(payload.traceAdded);

      },
      updater: proxyStore => {

        //  Reading values off the Payload
        const rootField = proxyStore.getRootField('traceAdded');
        const __type = rootField.getType();
        const __status = rootField.getValue('status');

        // Reading Values off the Relay Store
        let root = proxyStore.getRoot();
        let _type = root.getType();
        let runtimeRecord = root.getLinkedRecord('runtime');
        if( runtimeRecord ) {
          let totalCallsRecords = runtimeRecord.getLinkedRecords('totalCalls', {before: 1});
          if( totalCallsRecords ) {
            let totalCalls = totalCallsRecords[0].getValue('value');
            totalCallsRecords[0].setValue( totalCalls + 1, "value");
          }

          if( __status == 'ERROR' ) {
            let errorsRecors = runtimeRecord.getLinkedRecords('errors', {before: 1});
            if( errorsRecors ) {
              let totalErrors = errorsRecors[0].getValue('value');
              errorsRecors[0].setValue( totalErrors + 1, 'value');
            }
          }
        }
      },
      onError: error => {
        console.log(`An error occured:`, error);
      }
    };

    this.subscription = requestSubscription(
      environment,
      subscriptionConfig
    )
  }

  componentWillUnmount() {
    //this.subscription.dispose();
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
                          <List ref={c => { this.vTable = c; }}
                            width={width}
                            height={height}
                            rowHeight={60}
                            rowCount={this.state.esbEvents.length}
                            rowRenderer={this.rowRenderer}>

                          </List>
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
