const functions = require("firebase-functions"); 
const admin = require("firebase-admin"); 
admin.initializeApp();
var express = require('express');
const db = admin.firestore();
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
app.get('/block_unblock_user', async function(req, res) {
    try{
        var header = req.get('authorization');
        var adminHeader = header.split(" ");
        if(adminHeader.length <= 1){
            res.status(401).send("unauthenticated");
        }
        else {
            var adminId = adminHeader[1];
            await admin.auth().getUser(adminId).then(async(userRecord) => {
                var email = userRecord.email;
                console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
                await db.collection("admin").doc(email).get()
                .then(function(docSnapshot){
                    if(docSnapshot.exists){
    
                    }
                    else{
                        res.status(401).send("unauthenticated");
                    }
                })
                .catch((error) => {
                    res.status(401).send("unauthenticated");
                  });
              })
              .catch((error) => {
                res.status(401).send("unauthenticated");
              });
        }
        var userId = req.query.userId;
        var status = req.query.status;
        console.log(status);
        var s = status == 0?true:false;
        return admin.auth().updateUser(userId, {disabled: s})
        .then(function(){
            console.log("updated");
            res.status(200).send("updated");
        })
        .catch(function(error){
            console.log("error",error);
            res.status(401).send(error.message);
        });
    }
    catch(ex){
        res.status(401).send("unauthenticated");
    }
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
    res.render('products');
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
app.get('/orders', function(req, res) {
    res.render('orders');
});
app.get('/payments', function(req, res) {
    res.render('payments');
});
app.get('/discount_setting', function(req, res) {
    res.render('discount_setting');
});
app.get('/payments', function(req, res) {
    res.render('payments');
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
