const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const routes = require('./routes');

const strategy = require('./lib/passport');
const telegram = require('./lib/telegram');

const { sanitizeMarkdown } = require('./helpers/str');

require('./lib/cron');

const app = express();

passport.use('jwt', strategy);
app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  exposedHeaders: 'X-TOTAL-COUNT',
};

app.use(cors(corsOptions));
app.use(routes);

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

app.use((err, req, res, next) => {
  if (![403, 401].includes(err.status)) {
    const url = sanitizeMarkdown(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    const requestData = sanitizeMarkdown(`${req.method} ${url}`);
    const data = sanitizeMarkdown(`*Body:* ${JSON.stringify(req.body)}`);
    const msg = `Unhandled error, *${requestData}*\n\n${data}\n\n*Message:* ${err.message}`;
  
    telegram.sendMessage(msg);
  } 

  res.status(err.status || 500).send({ message: err.message });
});

const port = process.env.PORT || 3000;

http.createServer(app).listen(port, () => {
  console.log(`Server started at ${port}`);
});
