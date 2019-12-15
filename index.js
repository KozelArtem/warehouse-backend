const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const routes = require('./routes');

const app = express();

const strategy = require('./lib/passport');
// Add cron worker
require('./lib/cron');

passport.use('jwt', strategy);
app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(routes);

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

app.use((err, req, res, next) => {
  console.log(err);
  
  res.status(500).send({ message: err.message });
});

http.createServer(app).listen(process.env.PORT || 3000, () => {
  console.log(`Server started at ${3000}`);
});
