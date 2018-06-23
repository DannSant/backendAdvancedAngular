const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

let rolesValidos = {
    values: ["USER_ROLE", "ADMIN_ROLE"],
    message: "{VALUE} no es un rol valido"
};

var userSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es necesario"] },
    email: { type: String, unique: true, required: [true, "El email es necesario"] },
    password: { type: String, required: [true, "El password es necesario"] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: "USER_ROLE", enum: rolesValidos },
    status: { type: Boolean, default: true }
});

userSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });

module.exports = mongoose.model("User", userSchema);