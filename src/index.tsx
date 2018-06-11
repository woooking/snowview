import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { appReducer } from './redux/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import 'typeface-roboto';
import { BrowserRouter } from 'react-router-dom';

require('../node_modules/js-snackbar/dist/snackbar.css');
require('./assets/css/snowgraph.css');

const store = createStore(appReducer, composeWithDevTools(applyMiddleware(thunk)));

const theme = createMuiTheme({
    overrides: {
        MuiCardHeader: {
            root: {
                background: '#3f51b5',
                borderRadius: '2px 2px 0 0',
                padding: '8px 16px',
            },
            title: {
                color: 'white',
            }
        },
        MuiSvgIcon: {
            root: {
                cursor: 'pointer'
            }
        }
    },
});

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <App/>
            </MuiThemeProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
