const express = require('express');
const { ObjectID } = require('mongodb');
const { pick, isBoolean } = require('lodash');

let usersRouter = express.Router();
const { User } = require('../models/user');
const { authenticate } = require('../middleware/authenticate');

// ::test GET /users
usersRouter.get('/', (req, res) => {
  res.status(200).send({test: 'Test'});
});

// POST /users
usersRouter.post('/', (req, res) => {

  let body = pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save()
    .then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch(e => {
      res.status(400).send(e);
    });

});

usersRouter.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

usersRouter.post('/login', (req, res) => {
  let body = pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
});

usersRouter.delete('/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
});

module.exports = usersRouter;
