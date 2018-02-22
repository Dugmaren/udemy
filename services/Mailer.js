const sendgrid = require('sendgrid');
// const { mail } = sendgrid;
// <-- another way to do it ES6
// if you want to give it the same name
const helper = sendgrid.mail;
const keys = require('../config/keys');

// helper.Mail is an object that takes a bunch of
// data, and returns a Mailer. So we're going to add
// a bit more functionality here...
//
// note the destructuring in constructor. When we create
// a new mailer, we're giving it an object that has two
// variables within it called subject & recipients.
class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
      super();

      this.sgApi = sendgrid(keys.sendGridKey);
      this.from_email = new helper.Email('no-reply@emaily.com');
      this.subject = subject;
      this.body = new helper.Content('text/html', content);
      this.recipients = this.formatAddresses(recipients);

      this.addContent(this.body); // weird sendGrid... weird.
      this.addClickTracking();
      this.addRecipients();
  }

  // I'm pretty sure we took a list of emails, changed them in to
  // an array, then into objects, then back into array.
  // because redundancy is amazing .. or something.
  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  // sendGrid terribleness.
  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  // This is async, and we have to propagate that up a bunch..
  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;