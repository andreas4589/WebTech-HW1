var express = require("express");
var router = express.Router();
const {db} = require("./database");
const cookieParser = require('cookie-parser');
const session = require("express-session")


router.post("/", function (req, res) {
    db.get("SELECT * FROM users WHERE email = ? AND password == ?", [req.body.email, req.body.password], (err, result) => {
        if (result === undefined) {res.render('index', { error: "Wrong email or password", email: req.body.email});
    }
        else {
            req.session.user = req.body.email;
            res.redirect( "/users/home/" + req.body.email);
        }
    })
})


module.exports = router;