import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import formFields from './formFields.js';
import * as actions from '../../actions';
import { withRouter } from 'react-router-dom';

// 3. We catch the formValues here, so, now our formReview
//    has values from the surveyform that were in state
const SurveyFormReview = ({onCancel, formValues, submitSurvey, history }) => {
  const reviewFields = _.map(formFields, ({name, label}) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>{formValues[name]}</div>
      </div>
    );
  });

  // Apparently you need to wrap submitSurvey with a function or it will
  // submit automatically??
  return (
    <div>
      <h5>Please confirm</h5>
      {reviewFields}
      <button className="yellow dark-4 white-text btn-flat" 
              onClick={onCancel}>
        BACK
      </button>
      <button className="green white-text btn-flat right" 
              onClick={() => submitSurvey(formValues, history)}>
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

// the state object holds a multilevel nested object that
// has the reducers (auth) and the form you just submit
// etc. etc.  - console.log(state) to see it
//
// 1. the surveyForm data is stored in state, we grab the
//    values from state here and send them as "formValues"
//    to the connect string below
function mapStateToProps(state) {
  return {formValues: state.form.surveyForm.values};
}

// using connect from react-redux to export the SurveyFormReview
// component, connects it back to the store.
// calling it with a function, mapStateToProps, allows you to
// send back some properties with it
//
// 2. we take the form values here and send them to survey
//    formReview using the connect function
//
// withRouter - gives access of the history object back to the action
// that creates it
export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
