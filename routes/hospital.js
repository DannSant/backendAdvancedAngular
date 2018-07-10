const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Hospital = require('../models/hospital')
const { verificaToken } = require('../middlewares/autenticacion')


//=======================
//Peticiones GET
//======================
app.get('/hospital', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 99;
    limite = Number(limite);

    Hospital.find()
        .populate('user', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((error, hospitals) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            Hospital.count({}, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: hospitals
                })
            })




        })
})

// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/hospital/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + 'no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        })
})

//=======================
//Peticiones POST
//======================
app.post('/hospital', [verificaToken], (req, res) => {
    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        user: req.usuario._id
    });

    hospital.save((error, hospital) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            data: hospital
        })

    });
})

//=======================
//Peticiones PUT
//======================

app.put('/hospital/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['nombre']);
    body.user = req.usuario._id
        //console.log(body);

    Hospital.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, hospitalDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró al hospital a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: hospitalDB
        });

    });
})

//=======================
//Peticiones DELETE
//======================
app.delete('/hospital/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (error, hospitalDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró al hospital a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: hospitalDB
        });

    });
});

module.exports = app;