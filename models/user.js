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

const user_schema = new Schema({
    name: String,
    username: String,
    password: String,
    age: Number,
    email: String,
    date_of_bith: Date

});

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

