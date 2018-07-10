const express = require('express');

const _ = require('underscore');
const app = express();
const Medic = require('../models/medic')
const { verificaToken } = require('../middlewares/autenticacion')

//=======================
//Peticiones GET
//======================
app.get('/medic', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 99;
    limite = Number(limite);

    Medic.find()
        .populate('user', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(limite)
        .exec((error, medics) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            Medic.count({}, (e, conteo) => {
                res.json({
                    ok: true,
                    records: conteo,
                    data: medics
                })
            })




        })
});

app.get('/medic/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Medic.findById(id)
        .populate('user', 'nombre email img')
        .populate('hospital')
        .exec((error, medicDB) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            if (!medicDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        msg: "No se encontró medico"
                    }
                })
            }

            res.json({
                ok: true,
                data: medicDB
            })



        })
});

//=======================
//Peticiones POST
//======================
app.post('/medic', [verificaToken], (req, res) => {
    let body = req.body;

    let medic = new Medic({
        nombre: body.nombre,
        img: body.img,
        user: req.usuario._id,
        hospital: body.hospital
    });

    medic.save((error, medicDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            data: medicDB
        })

    });
})

//=======================
//Peticiones PUT
//======================

app.put('/medic/:id', [verificaToken], function(req, res) {
    let code = req.params.id;
    let body = _.pick(req.body, ['nombre', 'img', 'hospital']);
    body.user = req.usuario._id
        //console.log(body);

    Medic.findByIdAndUpdate(code, body, { new: true, runValidators: true }, (error, medicDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        if (!medicDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró al medic a actualizar"
                }
            })
        }

        res.json({
            ok: true,
            data: medicDB
        });

    });
});

//=======================
//Peticiones DELETE
//======================
app.delete('/medic/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    Medic.findByIdAndRemove(id, (error, medicDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        if (!medicDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se encontró al medico a borrar"
                }
            })
        }

        res.json({
            ok: true,
            data: medicDB
        });

    });
});



module.exports = app;