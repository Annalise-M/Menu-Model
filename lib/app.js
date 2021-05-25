const express = require('express');
const app = express();

app.use(require('cookie-parser')());
app.use(require('cors')({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/auth', require('./controllers/admin'));
app.use('/api/v1/menus', require('./controllers/menu'));
app.use('/api/v1/beers', require('./controllers/beer'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
