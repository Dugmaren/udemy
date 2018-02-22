const _ = require('lodash'); // by convention we assign to _
const Path = require('path-parser');
const {URL} = require('url'); // default integrated module in node
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    // This could be an enormous response if the # of recipients
    // in the surveys is large. Mongoose allows you to select
    // specific fields, or not specific fields, so we'll remove
    // the recipients from our display.
    const surveys = await Survey
      .find({ _user: req.user.id })
      .select({ recipients: false });

    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  // Catch response from sendGrid when someone choose a yes/no
  // response from our email survey.
  //
  // When the response comes in it will be a combination of all
  // the selections in the last period (30seconds?), so not
  // necessarily 1 click only.
  //
  // Also note - if someone clicks on their response twice, we could
  // get duplicate information here in the 30sec block, so check
  // for that too.
  //
  // req.body is sent back from sendgrid, with the list of events
  // that happened (we have it set up to send back click events)
  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice'); // kinda like a regex

    // when using _.chain (which is awesome), it is assume that you're
    // using the original variable from the last step so you don't add
    // it in.
    //
    // Note this big chain function IS asynchronous, but we don't need to
    // put all the async / await code in, because we don't really care
    // about when it finishes. We're not going to do anything after as
    // a result, ie not going to talk to sendGrid
    _.chain(req.body)
      .map(({email, url}) => {
        // Note if we don't extract a surveyId & a choice, p is undefined
        const match = p.test(new URL(url).pathname);
        if (match) {
          return {email, surveyId: match.surveyId, choice: match.choice};
        }
      })
      .compact() // removes nulls
      .uniqBy('email', 'surveyId') // remove duplicates
      .each(({ surveyId, email, choice }) => {
        // Note using choice as such, and having [choice] below does NOT make
        // an array.
        //
        // somehow the $ in recipients.$ pulls out $elemMatch, ie the one
        // that we want to use
        //
        // The trick here is that the entire process happens in the Mongo DB.
        // This means we don't have to pull down a survey, edit it, and then
        // send it back. So... that's good.
        //
        // note Mongo uses _id    not     id
        //
        // need to use {}.exec() to actually send the query
        choice = 'yes' || 'no';

        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: {email: email, responded: false},
            },
          },
          {
            $inc: {[choice]: 1},
            $set: {'recipients.$.responded': true},
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();

    res.send({}); // Respond to sendGrid to that it know it successfully hit the server.
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const {title, subject, body, recipients} = req.body;

    // ES6 syntax ... title: title can be condensed to title because
    // it has the same name.
    //
    // When we create a new recipient, we only need to specify the email
    // because the responded variable defaults to false, don't need to set.
    //
    // recipients: recipients.split(',').map(email => { return { email: email }})
    // recipients: recipients.split(',').map(email => { email }) JS can get
    // confused with this one as the { email } could be indicating the body of
    // the function email, OR, an object. So we put () around it to define it
    // as an object
    //
    // Date.now() returns a date object, but MongoDB handles that ok

    // 1 - create instance of survey
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({email: email.trim()})),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // 2 - create email (template) /w Yes/No response options and
    //     potentially styling
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      // 3 - send email (mailer / provider)
      await mailer.send();

      // 4 - save survey
      await survey.save();

      req.user.credits -= 1;
      const user = await req.user.save(); // because after we change req.user we consider
      // it to be stale, and use the new one.
      res.send(user); // to show credits updated
    } catch (err) {
      res.status(422).send(err); // unprocessable entity (assuming something wrong w survey)
    }
  });
};
