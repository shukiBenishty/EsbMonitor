import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import openSocket from 'socket.io-client';

import reducers from './reducers';
import App from './App.jsx';

let store = createStore(reducers);

const socket = openSocket('http://localhost:8000');

socket.on('esbevents', data => {
  let payload = JSON.parse(data);
  console.log('EsbEvent');
  store.dispatch({
    type: 'NEW_EVENT',
    data: {
      eventId: payload.event_id,
      issued: payload.event_time
    }
  });
});

socket.emit('subscribeToEsbevents', '');

ReactDOM.render(<Provider store={store}>
                  <App />
                </Provider>,
                document.getElementById('root'));
