const express = require("express");
const router = express.Router();
const login = require('./login');
const register = require('./register');
const {db} = require("./database");

router.use("/authentication/login", login);
router.use("/authentication/register", register);

router.get("/home/:userid", function (req, res) {
    if(req.session.user && req.session.user == req.params.userid) {
        db.get("SELECT firstName, lastName FROM users WHERE email = ?", [req.params.userid], function (err, result) {
            res.send(result);
        })
    }
    else{
        res.send("Not Found");
    }
})



module.exports = router;