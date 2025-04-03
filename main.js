#!/usr/bin/node
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const {registerUser, getUsers, getCourses} = require('./database');
const PORT = 8038;
const HOST = 'localhost';

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));


const testPerson = {firstName: "Max", lastName: "Maes", password: "", email: "bla", major: "", age: ""}
console.log(registerUser(testPerson));

app.post('/register', (req, res) => {
  const {firstName, lastName, password, email, major, age} = req.body;
  registerUser({firstName, lastName, password, email, major, age});
})

app.get('/register', (req, res) => {
 getCourses((err, result) => {
   res.render('register', {coursesList: result});
 })
})
app.get('/users', (req, res) => {
  getUsers((err, users) => {
    res.json(users);
  });
});

app.get('/courses', (req, res) => {
  getCourses((err, courses) => {
    res.json(courses);
  });
});
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT );
});