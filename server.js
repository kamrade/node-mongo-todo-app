const express      = require('express');
const bodyParser   = require('body-parser');
const { mongoose } = require('./db/mongoose');
const { Todo }     = require('./models/todo');
const { User }     = require('./models/user');

const PORT = 3200;
const app = express();
app.use(bodyParser.json());



// API --------------------------------

app.post('/v1/todos', (req, res) => {
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
