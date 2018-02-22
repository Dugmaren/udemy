// CONVENTION
// if you call this file index.js, we can import the entire
// reducers diretory which by convention will give you any
// included file called index.js

import { combineReducers } from 'redux';
// must be imported as "reducer" so we use "as" to call it something else.
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';

// Whatever keys we pass in, will represent the keys in
// the state object.
export default combineReducers({
    auth: authReducer,
    form: reduxForm,
    surveys: surveysReducer
});