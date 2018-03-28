const {
  MongoClient,
  ObjectID
} = require('mongodb');

// let obj = new ObjectID();
// console.log( obj );
// console.log( obj.getTimestamp() );

const url = 'mongodb://localhost:27017';
const dbName = 'Todos';

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log(':: Error connecting to database');
  }
  console.log(':: Connected');

  const db = client.db(dbName);

  db.collection('Users').find({
    name: 'Dennis'
  }).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, err => {
    console.log('Unable to fetch todos');
  });

  db.collection('Users').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, err => {
    console.log('Unable to fetch todos');
  });

  // client.close();
})
