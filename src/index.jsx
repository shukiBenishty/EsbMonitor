import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter as Router}  from 'react-router-dom';
import { installRelayDevTools } from 'relay-devtools';

import reducers from './reducers';
import App from './App.jsx';

// Useful for debugging, but remember to remove for a production deploy.
installRelayDevTools();

let store = createStore(reducers,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


ReactDOM.render(<Provider store={store}>
                  <Router>
                    <App />
                  </Router>
                </Provider>  ,
                document.getElementById('root'));
