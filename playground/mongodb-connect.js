const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();
console.log(obj);


const url = 'mongodb://localhost:27017';
const dbName = 'Todos';

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log('Error connecting to database');
  }
  console.log('Connected');

  const db = client.db(dbName);

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });


  // db.collection('Users').insertOne({
  //   name: 'Dennis',
  //   age: 35,
  //   location: 'Vladivostok'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert user', err);
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());
  //
  // });


  client.close();
})
