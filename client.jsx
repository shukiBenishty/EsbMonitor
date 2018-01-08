import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import openSocket from 'socket.io-client';

import reducers from './reducers';
import App from './App.jsx';

let store = createStore(reducers);

const socket = openSocket('http://10.60.10.150:8000');

socket.on('esbEvent', data => {

  store.dispatch({
    type: 'NEW_EVENT',
    data: {
      storyId: data.storyId,
      eventId: data.eventId,
      issued: data.time,
      status: data.status
    }
  })
});
socket.emit('subscribeToEsbEvents', ''); // no filter initially

ReactDOM.render(<Provider store={store}>
                  <App />
                </Provider>  ,
                document.getElementById('root'));
