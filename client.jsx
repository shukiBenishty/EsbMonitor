import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter }  from 'react-router-dom';
import { installRelayDevTools } from 'relay-devtools';

//import openSocket from 'socket.io-client';

import reducers from './src/reducers';
import App from './src/App.jsx';

// Useful for debugging, but remember to remove for a production deploy.
installRelayDevTools();

let store = createStore(reducers,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// const socket = openSocket('http://localhost:8000');
//
// socket.on('esbEvent', data => {
//
//   store.dispatch({
//     type: 'NEW_EVENT',
//     data: {
//       storyId: data.storyId,
//       serviceName: data.serviceName,
//       message: data.message,
//       eventId: data.eventId,
//       issued: data.time,
//       status: data.status
//     }
//   })
// });
// socket.emit('subscribeToEsbEvents', ''); // no filter initially

ReactDOM.render(<Provider store={store}>
                  <HashRouter>
                    <App />
                  </HashRouter>
                </Provider>  ,
                document.getElementById('root'));
