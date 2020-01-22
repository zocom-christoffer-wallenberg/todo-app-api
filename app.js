const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


const pool = new Pool({
    user: 'chris',
    host: 'localhost',
    database: 'todo',
    port: 5432
});

pool.connect();
  
pool.on('connect', () => {
    console.log('connected to the db');
});

app.get('/tasks', (req, res) => {
    let query = 'SELECT * FROM tasks ORDER BY id ASC';

    pool.query(query, (error, result) => {
        if (error) {
            res.send(error);
        } else {
            res.send(result.rows);
        }
      });
});

app.post('/tasks', (req, res) => {
    const task = req.body.task;
    const query = 'INSERT INTO tasks(name) VALUES($1) RETURNING *';

    pool.query(query, [task], (error, result) => {
        if (error) {
            res.send(error);
        } else {
            res.send(result.rows);
        }
    });
});

app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM tasks WHERE id IN ($1) RETURNING *';

    pool.query(query, [id], (error, result) => {
        if (error) {
            res.send(error);
        } else {
            res.send(result.rows);
        }
    });
});


app.listen(port);

//Hello

console.log('todo API server started on: ' + port);