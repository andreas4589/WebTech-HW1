#!/usr/bin/node
const path = require('path');
const express = require('express');
const app = express();
const users = require('./users');
const {db} = require("./database");
const PORT = 8038;
const session = require("express-session")
const options = {secret: "Not so very secret"}

app.set('view engine', 'ejs');

app.use(session(options));

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use("/users", users);

app.use(express.static('public'));


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
