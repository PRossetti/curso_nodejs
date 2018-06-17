const User = require('../models/user');

module.exports = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    User.findById(req.session.user_id, (err, user) => {
        console.log(`Fui a buscar el usuario con id ${req.session.user_id}`);
        if (err) {
            console.log('[SESSION] Ocurrió un error inesperado');
            return res.render('error', { message: 'Ocurrió un error inesperado en el middleware de session' });
        }
        // Lo que se guarda en locals se puedea acceder directamente desde las vistas
        // El contenido de locals se mergea, los valores sólo se pisan si se guarda algo con la misma clave
        res.locals = { user };
        next();
    });
}