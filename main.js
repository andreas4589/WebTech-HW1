#!/usr/bin/node


// main server file for the application, setting up an Express server with a few routes and middlewares.
// A session middleware is used to manage user sessions with custom configuration, including session expiration and cookie handling.


// necessary modules
const path = require('path');
const express = require('express');
const session = require("express-session")
const app = express();
const users = require('./users');   //users router
const {db} = require("./database");
const PORT = 8038;
const sessionOptions = {
  secret: 'your-secret-key',     
  resave: false,                 // Don't save session if unmodified
  saveUninitialized: false,      // Don't create session until something is stored
  cookie: {
    maxAge: 1000 * 60 * 60 * 24  // Optional: Session expires in 1 day
  }
};

// middleware for enabling sesssion managment
app.use(session(sessionOptions));

// setup EJS view engine to render dynamic content
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// for static files like register.html, styles.css, pictures, and js files
app.use(express.static(path.join(__dirname, 'public')));

// middleware for parsing incoming request bodies (used for post)
app.use(express.urlencoded({ extended: true }));

//middleware to mount the users route on the /users path
app.use("/users", users);

//main route for the login page. This is where all begin
app.get('/', (req, res) => {
  res.render("index", { error: null });   //error: var used when the authentication failed to display an error message
});

// debug routes
app.get('/usersDebug', (req, res) => {
  db.all("SELECT * FROM users", function (err, rows) {
    if (!err) {
      res.send(rows);
    }
  })
});

// debug routes
app.get('/coursesDebug', (req, res) => {
  db.all("SELECT name FROM courses", function (err, rows) {
    if (!err) {
      res.send(rows);
    }
  })
});

// we listen on port 8038
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT );
});
