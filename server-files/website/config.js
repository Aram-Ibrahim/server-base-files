const express = require('express');
const mariadb = require('mariadb');
const rateLimit = require('express-rate-limit');
const argon2 = require('argon2');

const port = 4444

//replace info
const pool = mariadb.createPool({
  host: '127.0.0.1', 
  user: 'user',
  password: 'pass',
  database: 'Website'
});

pool.getConnection()
  .then(conn => {
    console.log('Connected to the database.'); 
  })
  .catch(err => {
    console.error('Error: database connection failed!:', err);
  });
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // limit each IP to n req per windowMs
  delayMs: 0 
});


const argon2Config = {
  type: argon2.argon2id,
  memory: 2048,
  parallelism: 2,
  salt: Buffer.from('your_salt', 'utf8') //replace to your salt
};

module.exports = { port,pool,limiter,argon2Config };
