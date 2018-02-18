import axios from 'axios';
import {FETCH_USER} from './types';

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
