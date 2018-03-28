let mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbName = 'Todos';

mongoose.Promise = global.Promise;
mongoose.connect(`${url}/${dbName}`);

module.exports = {
  mongoose
};
