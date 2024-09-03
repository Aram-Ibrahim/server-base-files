const express = require('express');
const { pool,limiter,argon2Config } = require('./config');
const { check, body, validationResult } = require('express-validator');
const argon2 = require('argon2');
const router = express.Router();
const crypto = require('node:crypto');

router.get('/', (req,res) => {
    res.redirect("/account/login")
});

router.get('/login', (req,res) => {
    res.sendFile(__dirname + '/html/login.html');
});

router.get('/register', (req,res) => {
    res.sendFile(__dirname + '/html/register.html');
});

router.post('/register', limiter, [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req, res) => {
  const { username, email, password } = req.body;
  try 
  {
    const hash = await argon2.hash(password, argon2Config);
    const reg_q = `INSERT INTO Users (username, email, passwd) VALUES (?, ?, ?)`;
    const req = await pool.query(reg_q, [username, email, hash]);
    //res.send(`User has been created successfully.`);
    res.redirect("/account/login")
  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).send(`Error: user creation failed!`);
  }
});


router.post('/login', limiter, [
  body('email').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const { email, password } = req.body;
  try 
  {
    const passwd_q = `SELECT passwd FROM Users WHERE email = ?`;
    const passwd = await pool.query(passwd_q, [email]);
    if (!passwd.length) 
    {
      res.status(401).send(`Invalid email or password`);
    } 
    else 
    {
      const storedHash = passwd[0].passwd;
      const match = await argon2.verify(storedHash, password, argon2Config);
      if (!match) {
        res.status(401).send(`Invalid email or password`);
      } 
      else 
      {
        const cookieOptions = {
          sameSite: 'strict',
          httpOnly: true,
          //secure: true, //uncomment if you have SSL certificate for https connection
          maxAge: 7 * 24 * 60  * 60 * 1000  // 1 week
        };
        const session_id = crypto.randomBytes(64).toString('hex');
        res.cookie('sessionId', session_id, cookieOptions);
        
        const user_id_q = `SELECT user_id FROM Users WHERE email = ?`;
        const user_id = await pool.query(user_id_q, [email]);
        const ins_session_id_q = `INSERT INTO Sessions (user_id, session_id) VALUES (?,?)`;
        const ins_session_id = await pool.query(ins_session_id_q, [user_id[0].user_id,session_id]);
        
        res.send(`You have logged in successfully.`);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: logging in falied!`);
  }
});



module.exports = router;
