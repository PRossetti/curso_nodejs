/* dependencies */
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const User = require('./models/user');
// Guarda las sesiones en memoria por lo tanto cada vez que reiniciamos el servidor esa info se pierde
// const session = require('express-session');
const cookieSession = require('cookie-session');
const router_app = require('./router_app');
const methodOverride = require('method-override');
const session_middleware = require('./middlewares/session');

const app = express();

// Para servir archivos estáticos
app.use(express.static('public'));
app.use(methodOverride('_method')); // para aceptar el método PUT

/*  BUENA PRÁCTICA
    os controladores deben ser delgados y los modelos deben ser gordos.
    La lógica de la aplicaicón debe residir fuertemente en los modelos y no en el controlador. 
    El controlador debe ser un poco más específico de qué es lo que tiene que hacer. Las validaciones no deben ir en el controlador
    porque es muy dificil probar que el sistema esté bien, pq si la validación no hace lo que debería hay muchas cosas
    que pueden estar pasando (parametro mal pasado, url mal ingresada, etc)
    Si lo abstraemos al modelo es mucho más fácil
*/

/* thid party middlewares */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// el único parámetro definido es el secret que nos permite generar identificadores para nuestra sesión únicos,
// tiene que ser único a través de mis aplicaciones de node para que no haya un conflicto entre ellas
/*
app.use(session({
    secret: '123askldjvlaksmei13',
    // define si la sesión tiene que volverse a guardar en caso de que haya alguna modificación
    // 2 usuarios acceden en paralelo a la misma sesión, ambos lo modifican y uno obtiene una sesión ya contaminada
    resave: false,
    // indica si la sesión debe guardarse aun cuando no ha sido inicializada (aquellla que es nueva pero no ha sido modificada)
    // en false reduce el espacio que consume en el store las sesiones
    saveUninitialized: false,
}));
*/


app.use(cookieSession({
    name: 'session',
    keys: ['llave-1','llave-2']
}));

// Para montar la view engine hbs
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/' }));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index', { title: 'Qué onda amigo?', session: req.session.user_id });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Inicio de sesión' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Pantalla de creación de usuario' });
});

app.get('/users', (req, res) => {
    // Leo toda la colección / tabla y me trae todos los documentos/registros
    User.find(((err, doc) => {
        res.render('congrats', { message: `${JSON.stringify(doc)}`, title: 'Usuagrios grabados en la base de datos' });
    }));
});

app.post('/register', (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation
    });

    // Guardo un nuevo documento en la colección
    user.save().then(() => {
        res.render('congrats', { message: 'Felicitaciones, su usuario ha sido creado satisfactoriamente', title: 'Registrado!' });
    }, (err) => {
        // console.log(String(err));
        res.render('error', { message: String(err) });
    });
});

app.post('/session', (req, res) => {

    // find devuelve una colección: un array de documentos que cumplen la condición
    // primer param query, segundo (se puede omitir): fields o campos que queremos que nos devuelva
    // (string con los campos separados por espacio y tercero: callback (2 parametros, err y doc).

    // User.find({ email: req.body.email, password: req.body.password }, (err, docs) => {
    //     if (err) {
    //         res.render('error', { message: 'Ocurrió un error inesperado. Vuelva a intentarlo de nuevo más tarde o levante un ticket.' });
    //     }
    //     console.log(JSON.stringify(docs));
    //     if (docs.length !== 0) {
    //         // al poner return, nunca llega al siguiente render
    //         return res.render('congrats', { message: `Felicitaciones ${docs[0].username} por haber ingresado a tu cuenta`, title: 'Ingresaste!' });
    //     }
    //     res.render('error', { message: 'Datos ingresados erroneos' });
    // });

    // findOne sólo devuelve un documento
    User.findOne({ email: req.body.email, password: req.body.password }, (err, user) => {
        if (err) {
            return res.render('error', { message: 'Ocurrió un error inesperado. Vuelva a intentarlo de nuevo más tarde o levante un ticket.' });
        }
        if (user) {
            // usa un store de la librería  que no se recomienda para prod pq usa mucha memoria y es muy dificil escalarlo
            req.session.user_id = user._id;
            // al poner return, nunca llega al siguiente render
            // return res.render('congrats', { message: `Felicitaciones ${user.username} por haber ingresado a tu cuenta`, title: 'Ingresaste!' });
            return res.redirect('/app');
        }
        res.render('error', { message: 'Datos ingresados erroneos' });
    });

    // findById() se le pasa el _id que genera mongo
});

app.use('/app', session_middleware, router_app);

app.get('*', (req, res) => {
    res.render('error', { message: 'Mandaste fruta' });
    // res.send('Mandaste fruta');
});

app.listen(8080, null, () => console.log('Estoy escuchando en el puerto 8080'));