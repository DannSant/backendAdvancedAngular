//Configuracion
require('./config/config.js');

//Requires - importacion de librerias
const express = require('express')
const colors = require('colors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')


//Inicializacion de variales
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//server index config
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//rutas
app.use(require("./routes/index"));


//servidor
app.listen(3000, () => {
    console.log("Levantando servidor en puerto 3000. Status:", 'online'.green)
});

//BD
var uriDB = "mongodb://localhost/hospitalDB";
mongoose.connection.openUri(uriDB, (err, response) => {
    if (err) {
        console.log(err);
    }
    console.log("Levantando BD. Status:", 'online'.green);
});