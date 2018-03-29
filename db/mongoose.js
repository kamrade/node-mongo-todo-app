let mongoose = require('mongoose');

const locaUrl = 'mongodb://localhost:27017';
const url     = process.env.MONGODB_URI || 'mongodb://kamrade:kamrade123@ds127589.mlab.com:27589/node-mongo-tutorial-app';
const dbName = 'Todos';

mongoose.Promise = global.Promise;
// mongoose.connect(`${url}/${dbName}`);
mongoose.connect(`${url}`);

module.exports = {
  mongoose
};
