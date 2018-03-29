const express      = require('express');
const bodyParser   = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo }     = require('./models/todo');
const { User }     = require('./models/user');

const _paths = require('./data/paths');
const PORT = 3200;
const app = express();
app.use(bodyParser.json());

// API --------------------------------

// create todo
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

// get all todos
app.get(_paths.getTodos, (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos, testCode: '123'});
  }, (err) => {
    res.send(400).send(err);
  });
});

// get one todo by id
app.get(`${_paths.getTodos}/:id`, (req, res) => {
  let id = req.params.id;
  if (ObjectID.isValid(id)) {

    Todo.findById(id).then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo, testCode: '233'});
    }, err => {
      res.status(404).send(err);
    });

  } else {
    res.status(400).send('Invalid id');
  }
});

// --------------------------------------

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});

module.exports = { app };
