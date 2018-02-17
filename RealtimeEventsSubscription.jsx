// @flow
import { graphql, requestSubscription } from 'react-relay';
import environment from './Environment';

const realtimeEventsSubscription = graphql`
  subscription RealtimeEventsSubscription_Subscription {
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

export default (serviceId) => {


    const subscriptionConfig = {
      subscription: realtimeEventsSubscription,
      variables: {},
      onNext: payload => {
        console.log(payload);
      },
      updater: proxyStore => {
        const createTraceField = proxyStore.getRootField('traceAdded');
        const newTrace = createTraceField.getLinkedRecord('node');
        // const updatedLink = newVote.getLinkedRecord('link')
        // const linkId = updatedLink.getValue('id')
        // const newVotes = updatedLink.getLinkedRecord('_votesMeta')
        // const newVoteCount = newVotes.getValue('count')
        //
        // const link = proxyStore.get(linkId)
        // link.getLinkedRecord('votes').setValue(newVoteCount, 'count')
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
