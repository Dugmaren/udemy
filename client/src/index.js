// Data Layer Control - Redux layer

import materializeCSS from 'materialize-css/dist/css/materialize.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

// TESTING CODE //
import axios from 'axios';
window.axios = axios;
// TESTING CODE //

//const store = createStore(() => [], {}, applyMiddleware()); // place holder
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

// ReactDOM.render() takes 2 components
// 1) root (app.js)
// 2) where you're sending the components (public/index.html  #id of div)
ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.querySelector('#root')
);

// process.env variables are all grabbed automatically by react
// as long as they're prefaced by REACT_APP_, or they're default
// values like NODE_ENV. Otherwise they'll be hidden.
//
//console.log('STRIPE KEY IS: ', process.env.REACT_APP_STRIPE_KEY);
//console.log('Environment IS: ', process.env.NODE_ENV);