import React from 'react';
import { withRouter } from 'react-router-dom'
import { graphql, requestSubscription } from 'react-relay';
import { connect } from 'react-redux';
import environment from '../Environment';
import NavigationRenderer from './NavigationRenderer';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

const realtimeEventsSubscription = graphql`
  subscription App_Subscription {
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

class AppLayout extends React.Component {

  publishEsbEvent = (payload) => {

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
        const __serviceId = rootField.getValue('serviceId');

        // Reading Values off the Relay Store
        let root = proxyStore.getRoot();
        let _type = root.getType();
        let runtimeRecord = root.getLinkedRecord('runtime');
        if( runtimeRecord ) {

          let daysBefore = 7;

          let distributionRecord =
            runtimeRecord.getOrCreateLinkedRecord('distribution', 'Series',
                                                  {daysBefore: daysBefore, servicesIds: [1,3]});

          if( distributionRecord ) {
              let seriesRecords = distributionRecord.getLinkedRecords('series');
              if( seriesRecords ) {
                  for(let i = 0; i < seriesRecords.length; i++) {
                      let serviceId = seriesRecords[i].getValue('serviceId');
                      if( serviceId == __serviceId ) {
                         let data = seriesRecords[i].getValue('data');
                         let _data =   _.map(data, _.clone); // clone data in order to be able to change it
                         if( !_data[0] ) { // in case the 'distrubution' record was just created
                            _data[0] = 1; // consider today ([0])
                            for(let j = 1; j < daysBefore; j++) { // fill the rest
                              _data[j] = 0;
                            }
                         } else {
                           _data[0] = data[0] + 1;
                         }
                         seriesRecords[i].setValue(_data, 'data');
                      }
                  }
              }
          }

          let totalCallsRecords = runtimeRecord.getLinkedRecords('totalCalls', {before: 1});
          if( totalCallsRecords && totalCallsRecords.length > 0
              && totalCallsRecords[0] ) {
            let totalCalls = totalCallsRecords[0].getValue('value');
            totalCallsRecords[0].setValue( ++totalCalls, "value");
          }

          if( __status == 'ERROR' ) {
            let errorsRecors = runtimeRecord.getLinkedRecords('errors', {before: 1});
            if( errorsRecors && errorsRecors.length > 0
                && errorsRecors[0]) {
              let totalErrors = errorsRecors[0].getValue('value');
              errorsRecors[0].setValue( ++totalErrors, 'value');
            }

          }
        }
      },
      onError: error => {
        console.log(`An error occured:`, error);
      }
    };

    requestSubscription(
      environment,
      subscriptionConfig
    )

  }

  render() {
    return (<div className="maxHeight">
              <NavigationRenderer />
              <Header userName='Oleg Kleiman'/>
              <MainContent />
            </div>);
  }

};

export default withRouter(connect()(AppLayout))
