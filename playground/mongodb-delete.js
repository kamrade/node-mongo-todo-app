const {
  MongoClient,
  ObjectID
} = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Todos';

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log(':: Error connecting to database');
  }
  console.log(':: Connected');

  const db = client.db(dbName);

  // deleteMany
  // deleteOne
  // findOneAndDelete

  db.collection('Todos').findOneAndDelete({ text: 'Test'})
    .then(res => {
      console.log(res);
    });

  // client.close();
})
