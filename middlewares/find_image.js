const Image = require('../models/images');
const OwnerCheck = require('./image_permission');

module.exports = (req, res, next) => {

    Image.findById(req.params.id)
        .populate('creator')
        .exec()
        .then((image) => {
            console.log('EL MDL FUNCIONA, ENCONTRE LA IMAGEN', image.title);

            if (image && OwnerCheck(image, req, res)) {
                res.locals.image = image;
                next();
            } else {
                res.redirect('/app');
            }
        }, (err) => {
            console.error(`[MDL] Ocurrió un error: ${String(err)}`);
            res.render('error', { message: 'Ocurrió un error inesperado al intentar traer la imagen' });
        });

}