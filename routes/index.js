const express = require('express')
const app = express()

app.use(require('./login'));
app.use(require('./user'));
app.use(require('./hospital'));
app.use(require('./medic'));
app.use(require('./search'));
app.use(require('./upload'));
app.use(require('./imagenes'));



module.exports = app;