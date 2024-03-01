const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3500;

const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'userdata',  
    password:'root',
    port:5433,
});  

app.get('/data', (req, res) => {
    pool.query('SELECT * FROM users', (error, result) => {
      if (error) {
        console.error('Error executing query', error);
      } else {
        console.log( res.json(result.rows) );
      }
    });
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });