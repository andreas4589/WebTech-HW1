#!/usr/bin/node
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const users = require('./users');
const sqlite3 = require('sqlite3').verbose();
const {db} = require("./database");
const coursesFile = require('./data/courses.json');
const PORT = 8038;
const HOST = 'localhost';

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use("/users", users);


app.get('/usersDebug', (req, res) => {
  db.all("SELECT * FROM users", function (err, rows) {
    if (!err) {
      res.send(rows);
    }
  })
});

app.get('/coursesDebug', (req, res) => {
  db.all("SELECT name FROM courses", function (err, rows) {
    if (!err) {
      res.send(rows);
    }
  })
});
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT );
});
