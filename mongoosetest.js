const mongoose = require('mongoose');
const colors = require('colors')

var uri = "mongodb://Dann:mmadlajca1@cluster0-shard-00-00-zey8j.mongodb.net:27017,cluster0-shard-00-01-zey8j.mongodb.net:27017,cluster0-shard-00-02-zey8j.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

mongoose.connection.openUri(uri,(err,response)=>{
  if(err){
    console.log(err);
  }

  //console.log(response);
    console.log("Levantando BD. Status:",'online'.green)

})
