const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/codigo-facilito');
// Colección => Tabla
// Documento => Fila

/*
    Todos los esquemas corresonde a una colección en la base de Mongodb (?)
    Los documentos son instancias de una colección.
    Los virtuals son propiedades de un documento que no se guardan en la base de datos pero que si se mantienen en el objeto 
    que extrae mongoose, nos sirven para establecer atributos del objeto que pueden servironos para ciertas cosas
    Ejemplo: Password Confirmation
*/

/*
    Las VALIDACIONES de mongoose se hacen a nivel del Schema
    Los errores vienen en la función callback en un objeto de tipo ValidationError

    Las validaciones no se aplican a tipos de datos undefined. Solo se les aplica "required"
    A required le puedo pasar true, false o incluso un mensaje
*/
const sexEnum = ['M', 'F'];
const emailMatch = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'El email ingresado no es válido'];


const pswd_validation = {
    // validator tiene que retornar un booleano. this dentro de la función hace referencia al documento y la variable
    // que recibe la función, en este caso p, es el campo que estamos validando
    validator: function(p) {
        return this.password_confirmation === p;
    },
    message: 'Las contraseñas no son iguales'
}

const user_schema = new Schema({
    name: String,
    last_name: String,
    username: { type: String, required: 'El username es requerido', maxlength: 50 },
    password: {
        type: String,
        minlength: [8, 'El password es muy corto'],
        validate: pswd_validation
    },
    age: { type: Number, min: [5, 'La edad no puede ser menor que 5'], max: 120 },
    email: { type: String, required: true, match: emailMatch },
    date_of_bith: Date,
    sex: { type: String, enum: { values: sexEnum, message: 'Valor no admitido' } }
});

// virtuals
user_schema.virtual('password_confirmation')
    .get((() => {
        return this.p_c;
    }))
    .set(((password) => {
        this.p_c = password;
    }))

const User = mongoose.model('User', user_schema);

// Toda la comunicacion con la base de datos se hace a traves de modelos (con su respectiva colección)

//Primero tenemos que tener definido el Schema y después el modelo

/* Tipos de datos que pueda guardar en mongo
    String
    Number
    Date
    Boolean
    Array
    Mixed
    Buffer
    ObjectId
*/

module.exports = { User };

