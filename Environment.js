import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws'

async function fetchQuery(operation, variables = {}) {

  return fetch('http://localhost:3001/graphql', {
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
  }).catch( error => {
    return error;
  })

};

const websocketURL = 'ws://localhost:8000'

function setupSubscription(
  config,
  variables,
  cacheConfig,
  observer,
) {
  const query = config.text

  const subscriptionClient = new SubscriptionClient(websocketURL,
                                                    {
                                                      reconnect: true
                                                    });
  const id = subscriptionClient.subscribe({query, variables},
    (error, result) => {
      observer.onNext({data: result})
    })
}

const environment = new Environment({
  network: Network.create(fetchQuery, setupSubscription),
  store: new Store(new RecordSource()),
});

export default environment;
