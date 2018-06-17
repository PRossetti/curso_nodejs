const express = require('express');
const router = express.Router();
const Image = require('./models/images');
const FindImage = require('./middlewares/find_image');

router.get('/', (req, res) => {
    res.render('app/home', { username: 'pepon', userId: req.session.user_id });
});

/* REST */
router.get('/images/new', (req, res) => {
    res.render('app/images/new', { title: 'Subir imange' });
});


router.all('/images/:id*', FindImage);

router.get('/images/:id/edit', (req, res) => {
    console.log('[GET] Entro al get /images/:id/edit');

    res.render('app/images/edit');
});

//recurso: imagen individual
router.route('/images/:id')
    .get((req, res) => {
        console.log('[GET] Entró al get /images/:id', JSON.stringify(res.locals.image));

        res.render('app/images/show');
    })
    .put((req, res) => {
        console.log('[PUT] Entró al put');

        res.locals.image.title = req.body.title;
        res.locals.image.save().then(() => {
            res.render('app/images/show');
        }, (err) => {
            console.error('[PUT] Ocurrió un error al intentar actualizar la imagen');
            res.redirect(`/app/images/${res.locals.image._id}/edit`);
        });
    })
    .delete((req, res) => {
        console.log('[DELETE] Se va a eliminar la imagen');
        Image.findByIdAndRemove(req.params.id).then(() => {
            res.redirect('/app/images/');
        }, (err) => {
            console.error('[DELETE] Ocurrió un error al intentar eliminar la imagen');
            res.render('error', { message: 'Error inesperado al intentar ELIMINAR imagen' });
        });
    });

// recurso: colección de imágenes
router.route('/images')
    .get((req, res) => {
        console.log('[GET] Entró al get de /images');
        Image.find({ creator: res.locals.user._id }).then((images) => {
            res.render('app/images/index', { images });
        });
    }, (err) => {
        console.error(`Error al intentar traer las imágenes: ${String(err)}`);
        res.render('error', { message: 'Error inesperado al intentar traer las imágenes' });
    })
    .post((req, res) => {
        console.log('[POST] Entro al post');
        const image = new Image({
            title: req.body.title,
            creator: res.locals.user._id,
        });

        image.save().then(() => {
            console.log(`Se guardó la imagen con titulo ${image.title} y creador: ${image.creator}`);
            res.redirect(`/app/images/${image._id}`);
        }, (err) => {
            res.render('error', { message: 'Ocurrió un error al intentar grabar la imagen' });
        });
    });

module.exports = router;