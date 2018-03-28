const express      = require('express');
const bodyParser   = require('body-parser');
const { mongoose } = require('./db/mongoose');
const { Todo }     = require('./models/todo');
const { User }     = require('./models/user');

const _paths = require('./data/paths');
const PORT = 3200;
const app = express();
app.use(bodyParser.json());

console.log(_paths);

// API --------------------------------

app.post(_paths.addTodo, (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save((err, doc) => {
      if (err) {
        // is better to handling errors here
        res.status(400).send(err);
      } else {
        res.send(doc);
      }
    });

});

// --------------------------------------



app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});

module.exports = { app };
