const express = require('express');
const app = express();  // this is the part that talks to Node, takes a request
                        // and sends the request to the appropriate handler.

app.get('/', (req, res) => {    // this is the route handler for address '/'
    res.send({it: 'things to be done' });   // req & res are JS objects
});

const PORT = process.env.PORT || 5000;  // Heroku should define the port at runtime
app.listen(PORT);