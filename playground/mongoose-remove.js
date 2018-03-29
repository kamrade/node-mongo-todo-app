const { ObjectID } = require('mongodb');
const { mongoose } = require('../db/mongoose');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');

// Todo.remove({}).then(res => {
//   console.log(res);
// });

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()
const id = '5abc55c903b3c147c76b8116';

Todo.findByIdAndRemove('5abc55c903b3c147c76b8116')
  .then(todo => {
    console.log(todo);
  });
