const express = require('express');
const router = express.Router();
const Image = require('./models/images');

router.get('/', (req, res) => {
    res.render('app/home', { username: 'pepon', userId: req.session.user_id });
});

/* REST */
router.get('/images/new', (req, res) => {
    res.render('app/images/new', { title: 'Subir imange' });
});

router.get('/images/:id/edit', (req, res) => {
    // res.render('app/images/new', { title: 'Subir imange' });

});

//recurso: imagen individual
router.route('/images/:id')
    .get((req, res) => {
        Image.findById(req.params.id).then((image) => {

            res.render('app/images/show', { image });
        }, (err) => {
            console.error(`Ocurrió un error: ${String(err)}`);
            res.render('error', { message: 'Ocurrió un error inesperado al intentar traer la imagen' });
        });
    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    });

// recurso: colección de imágenes
router.route('/images')
    .get((req, res) => {
        Image.find({}).then((images) => {
            res.render('app/images/index', { images });
        });
    }, (err) => {
        console.error(`Error al intentar traer las imágenes: ${String(err)}`);
        res.render('error', {message: 'Error inesperado al intentar traer las imágenes'});
    })
    .post((req, res) => {
        const image = new Image({
            title: req.body.title
        });

        image.save().then(() => {
            res.redirect(`/app/images/${image._id}`);
        }, (err) => {
            res.render('error', { message: 'Ocurrió un error al intentar grabar la imagen' });
        });
    });

module.exports = router;