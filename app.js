var express = require('express');
var exphbs  = require('express-handlebars');
var mercadopago = require('mercadopago');
var app = express();

require('dotenv').config();

//Mercadopago config
// Agrega credenciales
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_TOKEN,
    integrator_id: process.env.INTEGRATOR_ID
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

//webhooks
app.post('/webhooks', function (req, res) {
    res.status(200).send("CREATED");
    setTimeout(()=>{
        res.redirect(`https://api.mercadopago.com/v1/payments/${res.query.id}?access_token=${process.env.MERCADOPAGO_TOKEN}`);s
    },500)
    
});

//Payments responses routes
app.get('/success', function (req, res) {
    res.render('success', req.query);
});
app.get('/failure', function (req, res) {
    res.render('failure');
});
app.get('/pending', function (req, res) {
    res.render('pending');
});

//Payment route
app.post('/payment', (req, res, next) => {
    let preference = {
        items: [
            {
                id: 1234,
                title: req.query.title,
                unit_price: parseInt(req.query.price),
                quantity: parseInt(req.query.quantity),
                description: 'Dispositivo móvil de Tienda e-commerce',
                picture_url: 'https://http2.mlstatic.com/celular-motorola-moto-e6-plus-special-edition-64gb-4gb-12c-D_NQ_NP_805051-MLA41165860417_032020-F.jpg',
            }
        ],
        external_reference: 'andreagallo264@gmail.com',
        payer: {
            name: 'Lalo',
            surname: 'Landa',
            email: 'test_user_63274575@testuser.com',
            phone: {
                area_code: '11',
                number: 22223333  
            },
            address: {
                street_name: 'False',
                street_number: 123,
                zip_code: '1111'
            }
        },
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: 'amex'
                }
            ],
            excluded_payment_types: [
                {
                    id: 'atm'
                }
            ],
            installments: 6
        },
        back_urls: {
            success: 'https://usagisama-mp-commerce-nodejs.herokuapp.com/success',
            pending: 'https://usagisama-mp-commerce-nodejs.herokuapp.com/failure',
            failure: 'https://usagisama-mp-commerce-nodejs.herokuapp.com/pending'
        },
        auto_return: 'approved',
        notification_url: 'https://usagisama-mp-commerce-nodejs.herokuapp.com/webhooks',
    };
    mercadopago.preferences.create(preference)
        .then(function (response) {
            // Este valor reemplazará el string "$$init_point$$" en tu HTML
            res.redirect(response.body.init_point);
        }).catch(function (err) {
            next(err);
        });
 
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
const port = normalizePort(process.env.PORT || '3000'); 
app.set('port', port);
app.listen(port);

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }