let mongoose = require('mongoose');
require('../config/config');

// const env = process.env.NODE_ENV || 'dev';
// let dbName, url, port;

// if (env === 'dev') {
//
//   dbName = 'Todos';
//   url = 'mongodb://localhost:27017';
//   port = 3200;
//
// } else if (env === 'test') {
//
//   dbName = 'TestTodos';
//   url = 'mongodb://localhost:27017';
//   port = 3232
//
// } else if (env === 'production') {
//
//   dbName = 'node-mongo-tutorial-app';
//   url = 'mongodb://kamrade:kamrade123@ds127589.mlab.com:27589';
//   port = process.env.PORT || 3200;
//
// } else {
//
//   dbName = 'Todos';
//   url = 'mongodb://localhost:27017';
//   port = process.env.PORT || 3200;
//
// }

mongoose.Promise = global.Promise;
mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
  .then(() => console.log(':: connected to mongodb'))
  .catch(e => console.log(':: error', e.message));

// mongoose.Promise = global.Promise;
// mongoose.connect(`${url}/${dbName}`)
//   .then(() => console.log(':: connected to mongodb'))
//   .catch(e => console.log(':: error', e.message));

module.exports = {
  mongoose
};
