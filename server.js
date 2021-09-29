const express = require('express'); // the server package
const app = express(); // the very base of a server
// uses a specified port, or defaults to 3000
const port = process.env.PORT || 3000;

// imports the routes defined in /api/routes.js
const routes = require('./api/routes');

// sets up express to use read JSON data in req.body
app.use(express.json({strict: true, type: 'application/json'}));
/* mounts the routes and appends any therin defined paths under
    the path `/api/v1` */
app.use('/api/v1', routes);

// tells server to listen on `port` and run this callback
app.listen(port, function () {
    console.log(`Points service listenig on port ${port}...`);
});
