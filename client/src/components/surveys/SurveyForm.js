import _ from 'lodash';
import React, {Component} from 'react';
import SurveyField from './SurveyField';
import {Link} from 'react-router-dom';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields.js';

// This takes care of calling action creators and communicating
// with the redux store.
// Note this syntax means we're pulling 2 things out of the redux-form
// module, the reduxForm, and Field
import {reduxForm, Field} from 'redux-form';

class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, ({label, name}) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  // Note we're not calling onSurveySubmit by adding (), we're just passing
  // it in.
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

// Empty object errors return = valid (no errors)
// Note - redux form automatically matches up any error values
// like "title" etc. that appear on the form and puts the
// errors there.
function validate(values) {
  const errors = {};

  // Return a list of all invalid emails..
  errors.emails = validateEmails(values.recipients || '');

  // Need values for each field...
  // if (!values.title) {errors.title = 'You must provide a title';}
  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value.';
    }
  });

  return errors;
}

// Initializes & Configures the form
// destroyOnUmmont (default true), dumps the values in the
// form when yo submit it. If you set it to false, then it
// stores the data
export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm);
