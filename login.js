/* This file sets up an Express route to handle user login requests. */

var express = require("express");
var router = express.Router();
const {db} = require("./database");
const cookieParser = require('cookie-parser');
const session = require("express-session")


router.post("/", function (req, res) {
    db.get("SELECT * FROM users WHERE email = ? AND password == ?", [req.body.email, req.body.password], (err, result) => {
        //checks the provided email and password against the database.
        if (result === undefined) {
            res.render('index', { error: "Wrong email or password", email: req.body.email}); // render the login page angain and indicates an error
        }
        else {
            //If the connection is successful, the user's email is stored in the session and they are redirected to their home page.
            req.session.user = req.body.email;
            res.redirect( "/users/home/" + req.body.email);
        }
    })
})


module.exports = router;