import React, {Component} from 'react';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';
import { reduxForm } from 'redux-form';

// Options to navigate between SurveyForm && SurveyFormReview
// 1. separate route - problem is if a user navigates directly
//    to the formReview you'd have to auto navigate them back
//    when there's no survey created.
//
// 2. Redux state - could store the state of if a survey is
//    created, then you'd have to deal with an action, reducer
//    and a bunch of other stuff.
//
// 3. Component State - have a boolean that says if you've
//    clicked the next button, then show review, and if you
//    click back, it just toggles the boolean and sends you
//    back.
//
// *. Rule of thumb for redux OR component state
//    if you're going to have any other feature in your
//    application use this thing for state, then use redux
//    but if this is the only use for it, then component
//    state will work fine.
class SurveyNew extends Component {
  // component level state...
  // the constructor is valid, but we're shortcutting below
  /*
  constructor(props) {
    super(props);

    this.state = { new: true };
  }
  */
  state = { showFormReview: false };

  renderContent() {
    if(this.state.showFormReview) {
      return <SurveyFormReview 
              onCancel={() => this.setState({showFormReview: false})}
            />;
    }
    return <SurveyForm 
              onSurveySubmit={() => this.setState({showFormReview: true})}
           />;
  }

  render() {
    return (
      <div>
        { this.renderContent() }
      </div>
    );
  }
}

// Adding this in here makes it so data persists between form &
// formReview, BUT, if you navigate away from either, then the
// data is killed.
//
// So NEXT/BACK go from <--> formReview.
// But cancel, logout, etc, go away from surveyNew (which contains
// form & formReview) and in those cases, we call this code below
// which without the persistData option, removes the data
export default reduxForm({
  form: 'surveyForm'
})(SurveyNew);
