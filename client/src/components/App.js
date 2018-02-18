// Rendering layer control - React layer
// deciding which components to load - React Router

// ALL OF OUR ROUTING LOGIC IS HERE!

// CONVENTIONS
// If a file is exporting a class / react component (function or class based)
// then label it with a capital letter.
// If it's just a function, then lower case

// We are now using import because we have babel
// back end is node.js which doesn't have fancy new modules, so
// we use require instead

import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

// Dummy Components
import Header from './Header';
import Landing from './Landing';
const Dashboard = () => <h2>Dashboard</h2>;
const SurveyNew = () => <h2>SurveyNew</h2>;

// BrowserRouter expects ONLY one child
// Route path="/" never specify domain name in here.. just the
//  route portion of the URL. ie - whenever a user goes to the
//  root url, show the landing component.
// * if you want / to show ONLY for /, and not everything, than
//  user the exact = {true}  OR  exact (which assumes you meant true)
class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />

            <Route exact path="/" component={Landing} />
            <Route exact path="/surveys" component={Dashboard} />
            <Route path="/surveys/new" component={SurveyNew} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

// Passing all the actions to App as props
export default connect(null, actions)(App);
