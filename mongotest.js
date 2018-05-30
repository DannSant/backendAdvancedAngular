var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://Dann:mmadlajca1@cluster0-shard-00-00-zey8j.mongodb.net:27017,cluster0-shard-00-01-zey8j.mongodb.net:27017,cluster0-shard-00-02-zey8j.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
MongoClient.connect(uri, function(err, client) {
  //console.log(db)
  const collection = client.db("hospitalDB").collection("hospitalDB");
  console.log(collection);
   client.close();
});
