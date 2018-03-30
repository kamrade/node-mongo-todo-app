const express = require('express');
const { ObjectID } = require('mongodb');
const { pick, isBoolean } = require('lodash');

let usersRouter = express.Router();
const { User } = require('../models/user');

// ::test GET /users
usersRouter.get('/', (req, res) => {
  res.status(200).send({test: 'Test'});
});

// POST /users
usersRouter.post('/', (req, res) => {

  let body = pick(req.body, ['email', 'password']);
  let user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch(e => {
    res.status(400).send(e);
  });
})

module.exports = usersRouter;
