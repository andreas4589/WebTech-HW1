const express = require("express");
const router = express.Router();
const {db} = require("./database");
const cookieParser = require('cookie-parser');



router.post("/", (req, res) => {
    const {firstName, lastName, password, email, major, age} = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (result !== undefined) { res.send("You already have an account pls login"); }
        else {
            db.run('INSERT INTO users (firstName, lastName, password, email, major, age) VALUES (?, ?, ?, ?, ?, ?)', [firstName, lastName, password, email, major, age]);
            req.session.user = req.body.email;
            res.redirect( "/users/home/" + email);
            //res.send( "inserted person with name: " + firstName);
            res.redirect('/home.html');;
        }
    });
})

module.exports = router;