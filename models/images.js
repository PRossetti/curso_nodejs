const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const img_schema = new Schema({
    title: { type: String, require: true },
    // sería como una FK de las SQL
    creator : { type: Schema.Types.ObjectId, ref: 'User' }
});

const Imagen = mongoose.model('Image', img_schema);

module.exports = Imagen;