var express = require('express');
var exphbs  = require('express-handlebars');
var mercadopago = require('mercadopago');
var app = express();
var PaymentController = require('./controller/payment');

require('dotenv').config();

//Mercadopago config
// Agrega credenciales
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_TOKEN
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get('/payment', PaymentController.payment);

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