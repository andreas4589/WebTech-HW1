var express = require("express");
var router = express.Router();
const {db} = require("./database");


router.post("/", function (req, res) {
    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [req.body.email, req.body.password], (err, result) => {
        if (result === undefined) {res.send("Wrong email or password");}
        else {
            res.send("Correct login");
        }
    })
})


module.exports = router;