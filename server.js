const express      = require('express');
const bodyParser   = require('body-parser');

const { mongoose, port } = require('./db/mongoose');
const _paths       = require('./data/paths');
const PORT         = port;

const app          = express();
const usersRouter  = require('./routes/users');
const todosRouter  = require('./routes/todos');

// MIDDLEWARE -------------------------

app.use(bodyParser.json());

// TEST -------------------------------

console.log('current environment: ', process.env.NODE_ENV);

app.get('/', (req, res) => {
  res.status(200).send(`mode: ${process.env.NODE_ENV}`);
});

// API --------------------------------

app.use(_paths.users, usersRouter);
app.use(_paths.todos, todosRouter);

// --------------------------------------

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});

module.exports = { app };
