const express = require('express');
const fileUpload = require('express-fileupload');
const _ = require('underscore');
const app = express();
const Medic = require('../models/medic')
const Hospital = require('../models/hospital')
const User = require('../models/user')
const { verificaToken } = require('../middlewares/autenticacion')
const fs = require("fs");

app.use(fileUpload());

//=======================
//Peticiones PUT
//======================
app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    var tiposValidos = ["hospitales", "medicos", "usuarios"];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: "Tipo invalido, debe ser " + tiposValidos.join(",")
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            error: {
                message: "No se han seleccionado archivos"
            }
        })
    }

    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split(".");
    let extension = nombreCortado[nombreCortado.length - 1];

    var extensionesValidas = ["jpg", "png", "gif", "jpeg","PNG"];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: "Extension no valida"
            }
        });
    }

    //nombre de archivo personalizado
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //mover archivo
    let path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: {
                    err: err,
                    message: "Error al mover archivo"
                }
            });
        }
    });

    subirPorTipo(id, tipo, nombreArchivo, res);




});

function subirPorTipo(id, tipo, nombreArchivo, res) {

    if (tipo == "usuarios") {
        User.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        err: err,
                        message: "No se encontró el usuario a actualizar"
                    }
                });
            }


            let pathViejo = "./uploads/usuarios/" + usuario.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ".";

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioActualizado
                })
            });

        });
    } else if (tipo == "medicos") {
        Medic.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        err: err,
                        message: "No se encontró el medico a actualizar"
                    }
                });
            }

            let pathViejo = "./uploads/medicos/" + medico.img;

            if (fs.existsSync(pathViejo) && medico.img.length > 0) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.json({
                    ok: true,
                    medico: medicoActualizado
                })
            });

        });
    } else if (tipo == "hospitales") {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        err: err,
                        message: "No se encontró el hospital a actualizar"
                    }
                });
            }

            let pathViejo = "./uploads/hospitales/" + hospital.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.json({
                    ok: true,
                    hospital: hospitalActualizado
                })
            });

        });
    }
}

module.exports = app;