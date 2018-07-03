const express = require('express');

const _ = require('underscore');
const app = express();
const Medic = require('../models/medic')
const Hospital = require('../models/hospital')
const User = require('../models/user')
const { verificaToken } = require('../middlewares/autenticacion')

//=======================
//Peticiones GET
//======================
app.get('/search/all/:busqueda', verificaToken, (req, res) => {

    let busqueda = req.params.busqueda;
    let regExp = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(regExp),
            buscarMedicos(regExp),
            buscarUsuarios(regExp)
        ])
        .then(respuestas => {
            res.json({
                ok: true,
                data: {
                    hospitales: respuestas[0],
                    medicos: respuestas[1],
                    usuarios: respuestas[2]
                }
            })
        });


});

app.get('/search/collection/:catalogo/:busqueda', verificaToken, (req, res) => {

    let busqueda = req.params.busqueda;
    let regExp = new RegExp(busqueda, 'i');

    let catalogo = req.params.catalogo;

    if (catalogo == "hospital") {
        buscarHospitales(regExp).then((hospitales) => {
            res.json({
                ok: true,
                data: {
                    hospitales: hospitales
                }
            })
        });
    } else if (catalogo == "medico") {
        buscarMedicos(regExp).then((medicos) => {
            res.json({
                ok: true,
                data: {
                    medicos: medicos
                }
            })
        });
    } else if (catalogo == "usuario") {
        buscarUsuarios(regExp).then((usuarios) => {
            res.json({
                ok: true,
                data: {
                    usuarios: usuarios
                }
            })
        });
    } else {
        return res.status(400).json({
            ok: false,
            error: {
                message: "Catalogo invalido."
            }
        })
    }

    Promise.all([
            buscarHospitales(regExp),
            buscarMedicos(regExp),
            buscarUsuarios(regExp)
        ])
        .then(respuestas => {
            res.json({
                ok: true,
                data: {
                    hospitales: respuestas[0],
                    medicos: respuestas[1],
                    usuarios: respuestas[2]
                }
            })
        });


});


//=======================
//Funciones de busqueda
//======================

function buscarHospitales(regExp) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regExp }, (err, hospitales) => {
            if (err) {
                reject("Error al cargar hospitales", err);
            } else {
                resolve(hospitales);
            }

        })
    });

}

function buscarMedicos(regExp) {

    return new Promise((resolve, reject) => {
        Medic.find({ nombre: regExp }, (err, medics) => {
            if (err) {
                reject("Error al cargar medicos", err);
            } else {
                resolve(medics);
            }

        })
    });

}

function buscarUsuarios(regExp) {

    return new Promise((resolve, reject) => {
        User.find({}, 'nombre email')
            .or([{ nombre: regExp }, { email: regExp }])
            .exec((err, usuarios) => {
                if (err) {
                    reject("Error al cargar usuarios", err)
                } else {
                    resolve(usuarios);
                }
            });
    });

}

module.exports = app;