const express = require("express");
const router = express.Router();
const {db} = require("./database");



router.post("/", (req, res) => {
    const {firstName, lastName, password, email, major, age} = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (result !== undefined) { res.send("You already have an account pls login"); }
        else {
            db.run('INSERT INTO users (firstName, lastName, password, email, major, age) VALUES (?, ?, ?, ?, ?, ?)', [firstName, lastName, password, email, major, age]);
            res.send( "inserted person with name: " + firstName);
        }
    });
})

module.exports = router;