import axios from 'axios';
import {FETCH_USER, FETCH_SURVEYS} from './types';

// Because we're returning a function, we don't have to
// immediately return an action #thunk
// Why?  Because we want to wait until the api request
// has completed and returned a user.
/*
export const fetchUser = () => {
  return function(dispatch) {
    axios
      .get('/api/current_user')
      .then(res => dispatch({type: FETCH_USER, payload: res}));
  };
};
*/

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({type: FETCH_USER, payload: res.data});
};

// Async, takes token we just got back from Stripe API
// goal is to update # of credits user has after purchase
export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({type: FETCH_USER, payload: res.data});
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);

  // Redirect is tricky as you need to give back the history
  // object from the form, from the connect call etc.
  history.push('/surveys');

  // This catches the response from surveyRoutes that sends
  // back res.send(user) with the intention of updating the
  // header's view of current credits.
  dispatch({type: FETCH_USER, payload: res.data});
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
}