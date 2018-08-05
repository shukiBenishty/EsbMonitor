// @flow
import {
  Environment,
  Network,
  RecordSource,
  Store,
  QueryResponseCache
} from 'relay-runtime';

// import {
//   RelayNetworkLayer,
//   urlMiddleware,
//   batchMiddleware,
//   loggerMiddleware,
//   errorMiddleware,
//   perfMiddleware,
//   retryMiddleware,
//   authMiddleware,
//   cacheMiddleware,
// } from 'react-relay-network-modern';

import { SubscriptionClient } from 'subscriptions-transport-ws'

// const network = new RelayNetworkLayer([
//   cacheMiddleware({
//     size: 100, // max 100 requests
//     ttl: 900000, // 15 minutes
//   }),
//   urlMiddleware({
//   url: (req) => Promise.resolve('/graphql'),
// }));

const cache = new QueryResponseCache({size: 100, ttl: 100000});

async function fetchQuery(operation, variables = {}, cacheConfig) {

  const queryId = operation.name;
  const cachedData = cache.get(queryId, variables);
  const isMutation = operation.operationKind === 'mutation';
  const isQuery = operation.operationKind === 'query';

  const forceFetch = cacheConfig && cacheConfig.force;

  if( isQuery && cachedData != null && !forceFetch ) {
    return cachedData;
  }

  return fetch('http://biztest01:3001/graphql', {
    method: 'POST',
    headers: {
       'Accept':'application/json',
       'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    })
  }).then( response => {
    return response.json()
  }).then( json => {

    if( isQuery && json ) {
      cache.set(queryId, variables, json);
    }

    if( isMutation ) {
      cache.clear();
    }

    return json;

  }).catch( error => {
    return error;
  })

};

const websocketURL = 'ws://biztest01:3001/subscriptions';

function setupSubscription(
  config,
  variables,
  cacheConfig,
  observer,
) {
  const query = config.text;

  const subscriptionClient = new SubscriptionClient(websocketURL,
                                                    {
                                                      reconnect: true
                                                    });
  subscriptionClient.subscribe({query, variables},
    (error, result) => {
      observer.onNext({data: result})
    })

  return {
    dispose: subscriptionClient.unsubscribe
  };
}

const environment = new Environment({
  network: Network.create(fetchQuery, setupSubscription),
  store: new Store(new RecordSource()),
});

export default environment;
