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
            res.render("user_home", {
                firstname: result.firstName,
                lastname: result.lastName,
            });
        })
    }
    else{
        res.send("Not Found");
    }
})

router.get("/profile/:userid", function (req, res) {
    if(req.session.user){
        db.get("SELECT * FROM friends WHERE user_email == ?, friend_email == ?", [req.session.user, req.params.userid], function (err, result) {
            if (result !== undefined) { res.send("You are friends and therefore allowed to view this page"); }
            else {res.send("Not Found");}
        })
    }
})



module.exports = router;