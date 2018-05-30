//Requires - importacion de librerias
const express = require('express')
const colors = require('colors')
const mongoose = require('mongoose');

//Inicializacion de variales
const app = express();

//rutas
app.get("/",(request,response,next)=>{
  response.status(200).json({
    ok:true,
    msg:'Todo correcto'
  })
})

//servidor
app.listen(3000,()=>{
  console.log("Levantando servidor en puerto 3000. Status:",'online'.green)
});

//BD
var uriDB = "mongodb://Dann:mmadlajca1@cluster0-shard-00-00-zey8j.mongodb.net:27017,cluster0-shard-00-01-zey8j.mongodb.net:27017,cluster0-shard-00-02-zey8j.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
mongoose.connection.openUri(uriDB,(err,response)=>{
  if(err){
    console.log(err);
  }
  console.log("Levantando BD. Status:",'online'.green);
});
