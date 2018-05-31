const express = require('express');
const { ObjectID } = require('mongodb');
// const _ = require('lodash');
const { pick, isBoolean } = require('lodash');

let todosRouter = express.Router();

const { Todo }     = require('../models/todo');
const { authenticate } = require('../middleware/authenticate');

// create todo
todosRouter.post('/', authenticate, (req, res) => {

  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
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
todosRouter.get('/', authenticate, (req, res) => {

  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos, testCode: '123'});
  }, (err) => {
    res.send(400).send(err);
  });
});

// get one todo by id
todosRouter.get('/:id', authenticate, (req, res) => {

  let id = req.params.id;
  if (ObjectID.isValid(id)) {

    Todo.findOne({
      _id: id,
      _creator: req.user._id
    }).then(todo => {
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
todosRouter.delete('/:id', authenticate, (req, res) => {

  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch(err => {
      res.status(400).send();
    })
});

// edit one todo by id
todosRouter.patch('/:id', authenticate, (req, res) => {

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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true})
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
