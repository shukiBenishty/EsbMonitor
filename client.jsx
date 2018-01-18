import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter }  from 'react-router-dom';

import openSocket from 'socket.io-client';

import reducers from './reducers';
import App from './App.jsx';

let store = createStore(reducers,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const socket = openSocket('http://10.0.0.1:8000');

socket.on('esbEvent', data => {

  store.dispatch({
    type: 'NEW_EVENT',
    data: {
      storyId: data.storyId,
      serviceName: data.serviceName,
      message: data.message,
      eventId: data.eventId,
      issued: data.time,
      status: data.status
    }
  })
});
socket.emit('subscribeToEsbEvents', ''); // no filter initially

ReactDOM.render(<Provider store={store}>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </Provider>  ,
                document.getElementById('root'));
