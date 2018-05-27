const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const img_schema = new Schema({
    title: { type: String, require: true }
});

const Imagen = mongoose.model('Image', img_schema);

module.exports = Imagen;