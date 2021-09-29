const express = require('express');
// const bodyParser = express.json
const app = express();
const port = process.env.PORT || 3000;

const routes = require('./api/routes');

app.use(express.json({strict: true, type: 'application/json'}));
app.use('/api/v1', routes);

app.listen(port, function () {
    console.log(`Points service listenig on port ${port}...`);
});
