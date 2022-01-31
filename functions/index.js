const functions = require("firebase-functions"); 
var express = require('express');
var app = express();

var expressLayouts = require('express-ejs-layouts');
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(express.static('public'));
app.set('layout', 'layouts/layout');

// index page
app.get('/', function(req, res) {
res.render('index');
});
app.get('/dashboard', function(req, res) {
    res.render('index');
});
app.get('/users', function(req, res) {
    res.render('users');
}); 
app.get('/towns', function(req, res) {
    res.render('towns');
}); 
app.get('/category', function(req, res) {
    res.render('category');
}); 
app.get('/subcategory', function(req, res) {
    res.render('subcategory');
}); 
app.get('/product', function(req, res) {
    res.render('product');
});
app.get('/orders', function(req, res) {
    res.render('orders');
});
app.get('/price_setting', function(req, res) {
    res.render('price_setting');
});
app.get('/terms_and_conditions', function(req, res) {
    res.render('terms_and_conditions');
});
app.get('/about_app', function(req, res) {
    res.render('about_app');
});
app.get('/faqs', function(req, res) {
    res.render('faqs');
});
app.get('/myprofile', function(req, res) {
    res.render('myprofile');
});  
app.get('/login', function(req, res) {
    res.render('auth-login', { layout: false });
});
app.get('/forgot-password', function(req, res) {
    res.render('forgot-password', { layout: false });
});

exports.app = functions.https.onRequest(app);
