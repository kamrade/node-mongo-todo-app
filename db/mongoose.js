let mongoose = require('mongoose');

const env    = process.env.NODE_ENV || 'dev';
const dbName = env === 'dev' ? 'Todos' : 'node-mongo-tutorial-app';
const url    = env === 'dev' ? 'mongodb://localhost:27017' : 'mongodb://kamrade:kamrade123@ds127589.mlab.com:27589';

mongoose.Promise = global.Promise;
mongoose.connect(`${url}/${dbName}`);

module.exports = {
  mongoose
};
