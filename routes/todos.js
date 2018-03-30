const express = require('express');
const { ObjectID } = require('mongodb');
// const _ = require('lodash');
const { pick, isBoolean } = require('lodash');

let todosRouter = express.Router();
const { Todo }     = require('../models/todo');

// create todo
todosRouter.post('/', (req, res) => {

  console.log(':: add todo');

  let todo = new Todo({
    text: req.body.text
  });

  todo.save((err, doc) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(doc);
      }
    });
});

// get all todos
todosRouter.get('/', (req, res) => {

  console.log(':: get all todos');

  Todo.find().then((todos) => {
    res.send({todos, testCode: '123'});
  }, (err) => {
    res.send(400).send(err);
  });
});

// get one todo by id
todosRouter.get('/:id', (req, res) => {

  console.log(':: get todo by id');

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

// delete one todo by id
todosRouter.delete('/:id', (req, res) => {

  console.log(':: remove todo');

  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch(err => {
      res.status(400).send();
    })
});

// edit one todo by id
todosRouter.patch('/:id', (req, res) => {

  console.log(':: edit todo');

  let id   = req.params.id;
  let body = pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  if (isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    })
    .catch(e => {
      res.status(400).send();
    });
});

module.exports = todosRouter;
