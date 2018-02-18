// note we've given a default value to state of an empty object
import { FETCH_USER } from '../actions/types';

export default function(state = {}, action) {
    console.log(action);
    switch(action.type) {
        case FETCH_USER:
            return action.payload || false;
        default:
            return state;
    }
}