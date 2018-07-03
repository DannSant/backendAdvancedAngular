const express = require('express');

const app = express();
const path = require("path");
const fs = require("fs");
const Medic = require('../models/medic')
const Hospital = require('../models/hospital')
const User = require('../models/user')
const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion')

app.get('/img/:tipo/:img', [verificaToken], function(req, res) {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImage);
    }
});

module.exports = app;