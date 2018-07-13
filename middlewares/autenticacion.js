const jwt = require('jsonwebtoken')

//===============
// Verificar token
//==============

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error
            })
        }

        req.usuario = decoded.usuario;
        next();


    })

}

//===============
// Verificar admin
//==============

let verificaAdmin = (req, res, next) => {
    let role = req.usuario.rol;
    let id = req.params.id;

    if (role == "ADMIN_ROLE" || id == req.usuario._id) {
        next()
    }else {
        return res.status(401).json({
            ok: false,
            error: {
                message: "Solo un usuario con rol de ADMIN puede ejecutar esta operacion"
            }
        })
    }
}



module.exports = { verificaToken, verificaAdmin };