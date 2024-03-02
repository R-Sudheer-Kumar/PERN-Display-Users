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
    pool.query("SELECT sno,name,age,phone,location,TO_CHAR(created_at, 'DD/MM/YYYY') AS date,TO_CHAR(created_at, 'HH12:MI:SS AM') AS time FROM users ORDER BY sno;" , (error, result) => {
      if (error) {
        console.error('Error executing query', error);
      } else {
        res.json(result.rows) ;
      }
    });
  });
  
app.get('/search',(req , res) => { 
  const term = req.query.term;
  pool.query(`SELECT sno,name,age,phone,location,TO_CHAR(created_at, 'DD/MM/YYYY') AS date,TO_CHAR(created_at, 'HH12:MI:SS AM') AS time FROM users WHERE name ILIKE '%${term}%' OR location ILIKE '%${term}%' order by sno;` , (error , result) => {
    if(error)
    {
      console.log("Error",error);
    }
    else
    {
      res.json(result.rows);
    }
  })
});

app.get('/sort' , (req,res) => {
  const column = req.query.column;
  const order = req.query.order;
  pool.query(`SELECT sno,name,age,phone,location,TO_CHAR(created_at, 'DD/MM/YYYY') AS date,TO_CHAR(created_at, 'HH12:MI:SS AM') AS time FROM users ORDER BY CAST(created_at AS ${column.toUpperCase()}) ${order};` , (error,result) => {
    if(error)
    {
      console.log("Error" , error);
    }
    else
    {
      res.json(result.rows);
    }
  });
})
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });