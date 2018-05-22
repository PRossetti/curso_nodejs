/* dependencies */
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const User = require('./models/user').User;

const app = express();

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

// Para montar la view engine hbs
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/' }));
app.set('view engine', 'hbs');


// Para servir archivos estáticos
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Qué onda amigo?' });
});

app.get('/login', (req, res) => {
    // Leo toda la colección / tabla y me trae todos los documentos/registros
    User.find(((err, doc) => {
        console.log(doc);
        res.render('login', { title: 'Pantalla de login' });
    }));
});

app.get('*', (req, res) => {
    res.render('error', { message: 'Mandaste fruta' });
});

app.post('/login', (req, res) => {
    console.log(JSON.stringify(req.body));
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation
    });

    console.log('password_confirmation: ', user.password_confirmation);

    // Guardo un nuevo documento en la colección
    user.save(()=>{
        res.render('congrats', { title: 'Registrado!' });
    });
    // res.send('Mandaste fruta');
});

app.listen(8080, null, () => console.log('Estoy escuchando en el puerto 8080'));