// You can just call     debugger;
// to run the debugger

import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

// StripeCheckout defaults to using US $$, in cents.
// so request amount $5.00 US = amount={500}
// token={} takes a callback function that is called
// when Stripe returns a result (so it's Stripe's fn)
// ** FYI, usually a callBack from someone else is prefaced
// with on... onToken() etc.
// apparently the token that's returned is an object with
// several values like client_ip, email, id, created etc.
//
// Can use StripeCheckout as a self-closing tag to get the
// default Stripe button, OR the className="btn" gets you the
// current one.
class Payments extends Component {
  render() {
    return (
      <StripeCheckout 
        name="Emaily"
        description="Purchase $5 moar creditz"
        amount={500}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <button className="btn">
          Add Credits
        </button>
      </StripeCheckout>
    );
  }
}

//export default Payments;
export default connect(null, actions)(Payments);