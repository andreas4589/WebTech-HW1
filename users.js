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
                email: req.params.userid,
            });
        })
    }
    else{
        res.send("Not Found");
    }
})
/*
router.get("/profile/:userid", function (req, res) {
    if(req.session.user){
        db.get("SELECT * FROM friends WHERE user_email == ?, friend_email == ?", [req.session.user, req.params.userid], function (err, result) {
            if (result !== undefined) { 
                res.send("You are friends and therefore allowed to view this page"); }
            else {res.send("Not Found");}
        })
    }
})
*/
router.get("/profile/:useremail", function (req, res) {
    const email = req.params.useremail;

    if (req.session.user !== email) {
        return res.redirect("/");
    }

    db.get(
        "SELECT firstName, lastName, age, email, photo, major, hobbies FROM users WHERE email = ?",
        [email],
        function (err, user) {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send("Database error");
            }

            if (!user) return res.status(404).send("User not found");

            res.render("user_profile", {
                fname: user.firstName,
                lname: user.lastName,
                age: user.age,
                email: user.email,
                photo: user.photo,
                program: user.major, 
                hobbies: user.hobbies,
            });
        }
    );
});

router.get("/profile/edit/:useremail", function (req, res) {
    const email = req.params.useremail;

    if (req.session.user !== email) {
        return res.redirect("/");
    }

    db.get(
        "SELECT firstName, lastName, age, email, photo, major, hobbies FROM users WHERE email = ?",
        [email],
        function (err, user) {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send("Database error");
            }

            if (!user) return res.status(404).send("User not found");

            res.render("user_profile", {
                fname: user.firstName,
                lname: user.lastName,
                age: user.age,
                email: user.email,
                photo: user.photo,
                program: user.major, 
                hobbies: user.hobbies,
            });
        }
    );
});

router.get("/courses/course/:coursename", (req, res) => {
    const courseName = req.params.coursename;
    const email = req.session.user;

    if (req.session.user !== email) {
        return res.redirect("/");
    }

    const query = `
        SELECT u.firstName, u.lastName, u.photo 
        FROM users u
        INNER JOIN user_courses uc ON u.email = uc.user_email
        WHERE uc.course_name = ? AND u.email != ?
    `;

    db.all(query, [courseName, email], (err, students) => {
        if (err) {
            console.error("Error fetching classmates:", err);
            return res.status(500).send("Database error");
        }

        res.render("course_classmates", {
            course: courseName,
            students: students,
            email: email
        });
    });
});

router.get("/courses/:useremail", (req, res) => {
    const email = req.params.useremail;

    if (req.session.user !== email) {
        return res.redirect("/");
    }

    db.all(
        "SELECT course_name FROM user_courses WHERE user_email = ?",
        [email],
        (err, rows) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send("Database error");
            }
        
            res.render("user_courses", {
                email: email,
                firstname: req.session.firstName,
                lastname: req.session.lastName,
                courses: rows, // Array of course objects
            });
        }
    );
});




/*
added by Taha 
I assumed here that in the table message, the row sender and recipient
corespond to the email adresses
*/
router.get("/message-box/:useremail", function (req, res) {
    const email = req.params.useremail;

    // Optional: check if logged-in user matches the email
    if (req.session.user !== email) {
        return res.redirect("/");
    }

    db.get("SELECT firstName FROM users WHERE email = ?", [email], function (err, userResult) {
        if (userResult) {
            const firstName = userResult.firstName;

            db.all(`
                SELECT u.firstName, u.lastName, u.email, m.message 
                FROM messages m 
                JOIN users u ON u.email = m.sender 
                WHERE m.recipient = ?`, [email],
                function (err, messagesResult) {
                    res.render("message-box", {
                        name: firstName,
                        email: email,
                        messages_list: messagesResult || []
                    });
                }
            );
        } else {
            res.send("User not found");
        }
    });
});



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
                            res.render("write-message", {name: name, friends_list: result, recipient: recipient,  email: req.session.user});
                        }
                        else{
                            res.render("write-message", {name: name, friends_list: [], recipient: recipient,  email: req.session.user});
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
                            res.render("write-message", {name: name, friends_list: result, recipient: recipient,  email: req.session.user});
                        }
                        else{
                            res.render("write-message", {name: name, friends_list: [], recipient: recipient,  email: req.session.user});
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