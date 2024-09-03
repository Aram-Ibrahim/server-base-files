const express = require('express');

const argon2 = require('argon2');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { port,pool,limiter,argon2Config } = require('./config');
const routes = require('./userAuth');
const authController = require('./authController');
const app = express();

app.use(express.json()); 
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authController)

app.use('/account', routes);

app.get('/', (req,res) => {
    res.redirect("/account")
});

app.get("/:universalURL", (req, res) => {
   res.send("ERROR 404 URL NOT FOUND");
});

app.listen(port, () => {
  console.log(`Listening on port `+ port);
  console.log('127.0.0.1:'+port)
});

