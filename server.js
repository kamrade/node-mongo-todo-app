const express      = require('express');
const bodyParser   = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo }     = require('./models/todo');
const { User }     = require('./models/user');

const _paths = require('./data/paths');
const PORT = process.env.PORT || 3200;
const app = express();
app.use(bodyParser.json());

// TEST -------------------------------

console.log('current environment: ', process.env.NODE_ENV);

app.get('/', (req,res) => {
  res.status(200).send(`mode: ${process.env.NODE_ENV}`)
});

// API --------------------------------

// create todo
app.post(_paths.addTodo, (req, res) => {

  console.log(':: add todo');

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

app.delete(`${_paths.removeTodos}/:id`, (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send(todo);
    }).catch(err => {
      res.status(400).send();
    })

  // validate the id

});

// --------------------------------------

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});

module.exports = { app };
