const { ObjectID } = require('mongodb');
const { mongoose } = require('../db/mongoose');
const { Todo } = require('../models/todo');

let id = '5abb44c907da40687f9e37ee11';

if (ObjectID.isValid(id)) {

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return console.log('ID not found');
    }
    console.log('Todo By Id', todo);
  }).catch(e => {
    console.log('Error');
  });

} else {
  console.log('ID not valid');
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });
