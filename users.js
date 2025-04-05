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







/*
added by Taha 
I assumed here that in the table message, the row sender and recipient
corespond to the email adresses
*/
router.get("/message-box/:userid", function (req, res) {
    if(req.session.user){
        var name;
        db.get("SELECT firstName FROM users WHERE email = ?", [req.session.user], function (err, result) {
            if (result !== undefined) {
                name=result.name;
                db.all(`
                    SELECT u.firstName, u.lastName, u.email, m.message FROM messages m, users u
                    WHERE m.recipient = ? AND u.email=m.recipient`, [name],
                    function (err, result) {
                        if (result !== undefined) {
                            res.render("message-box", {name: name, messages_list: result});
                        }
                        else{
                            res.render("message-box", {name: name, messages_list: []});
                        }                        
                });
            }
            else {res.send("Not Found");}
        });
    }
    else{res.redirect("/");}
})


router.get("/write-message/:recipient", function (req, res) {
    var recipient = req.params.recipient;
    if(req.session.user){
        var name;
        db.get("SELECT firstName FROM users WHERE email = ?", [req.session.user], function (err, result) {
            if (result !== undefined) {
                name=result.name;
                db.all(`
                    SELECT u.firstName, u.lastName, f.friend_email FROM users u friends f
                    WHERE f.user_email=? AND f.friend_email=u.email`, [req.session.userid],
                    function (err, result) {
                        if (result !== undefined) {
                            res.render("write-message", {name: name, friends_list: result, recipient: recipient});
                        }
                        else{
                            res.render("write-message", {name: name, friends_list: [], recipient: recipient});
                        }  
                });
            }
            else {res.send("Not Found");}
        });
    }
    else{res.redirect("/");}
})

router.get("/write-message", function (req, res) {
    var recipient = "";
    if(req.session.user){
        var name;
        db.get("SELECT firstName FROM users WHERE email = ?", [req.session.user], function (err, result) {
            if (result !== undefined) {
                name=result.name;
                db.all(`
                    SELECT u.firstName, u.lastName, f.friend_email FROM users u friends f
                    WHERE f.user_email=? AND f.friend_email=u.email`, [req.session.userid],
                    function (err, result) {
                        if (result !== undefined) {
                            res.render("write-message", {name: name, friends_list: result, recipient: recipient});
                        }
                        else{
                            res.render("write-message", {name: name, friends_list: [], recipient: recipient});
                        }  
                });
            }
            else {res.send("Not Found");}
        });
    }
    else{res.redirect("/");}
})

router.post("/sendMessage", function (req, res) {
    if(req.session.user){
        var sender = req.session.userid;
        var recipient = req.body.recipient;
        var message = req.body.message-content;

        db.run('INSERT INTO messages (sender, recipient, message) VALUES (?, ?, ?)', [sender, recipient, message]);

        res.send("The message was sent successfully !");
    }
    else{
        res.redirect("/login");
    }
})




module.exports = router;