import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { appReducer } from './redux/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'typeface-roboto';
import { BrowserRouter } from 'react-router-dom';

require('../node_modules/js-snackbar/dist/snackbar.css');
require('./assets/css/snowgraph.css');

const store = createStore(appReducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
