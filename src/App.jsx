import * as React from 'react';
import { withRouter } from 'react-router-dom'
import { graphql, requestSubscription } from 'react-relay';
import { connect } from 'react-redux';
import environment from './Environment';
import NavigationRenderer from './NavigationRenderer';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

const realtimeEventsSubscription = graphql`
  subscription App_Subscription {
    traceAdded {
      id
      storyId
      received
      serviceName
      serviceId
      status
    }
  }
`;

type Props = {
  activeTracing: Boolean
}

class AppLayout extends React.Component<Props> {

  static defaultProps = {
    activeTracing: true
  };

  publishEsbEvent = (payload) => {

    this.props.dispatch({
      type: 'NEW_EVENT',
      data: {
        storyId: payload.storyId,
        serviceName: payload.serviceName,
        message: payload.message,
        issued: payload.received,
        status: payload.status
      }
    })

  }

  subscriptionConfig = {
    subscription: realtimeEventsSubscription,
    variables: {},
    onNext: payload => {

      // TBD: Temporay solution: change this to use Relay fragment!
      this.publishEsbEvent(payload.traceAdded);

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

        let distributionRecord =
          runtimeRecord.getOrCreateLinkedRecord('distribution', 'Series',
                                                {daysBefore: 0, servicesIds: [1,3]});

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

        let totalCallsRecords = runtimeRecord.getLinkedRecords('totalCalls', {before: 0});
        if( totalCallsRecords && totalCallsRecords.length > 0
            && totalCallsRecords[0] ) {
          let totalCalls = totalCallsRecords[0].getValue('value');
          totalCallsRecords[0].setValue( ++totalCalls, "value");
        }

        if( __status == 'ERROR' ) {
          let errorsRecors = runtimeRecord.getLinkedRecords('errors', {before: 0});
          if( errorsRecors && errorsRecors.length > 0
              && errorsRecors[0]) {
            let totalErrors = errorsRecors[0].getValue('value');
            errorsRecors[0].setValue( ++totalErrors, 'value');
          }

        }
      }
    },
    onError: error => {
      console.log(`An error occured: ${error}`);
    }
  }

  componentDidMount() {

    this.subscription = requestSubscription(
      environment,
      this.subscriptionConfig
    )

  }

  componentDidUpdate(prevProps) {
    // The only property of interest here is activeTracking
    if( prevProps.activeTracing != this.props.activeTracing ){

      if( !this.props.activeTracing  ) {

        this.subscription.dispose();
        this.subscription = null;

      } else {

        this.subscription = requestSubscription(
          environment,
          this.subscriptionConfig
        )

      }
    }
  }

  render() {
    return (<div className="maxHeight">
              <NavigationRenderer />
              <Header userName='User name'/>
              <MainContent />
            </div>);
  }


};

const mapStateToProps = state => {
  return {
    activeTracing: state.activeTracing,
  }
}

export default withRouter(connect(mapStateToProps)(AppLayout))
