const express = require("express");
const router = express.Router();
const {db} = require("./database");
const cookieParser = require('cookie-parser');



router.post("/", (req, res) => {
    const {firstName, lastName, password, email, program, age, hobbies, photo} = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (result !== undefined) { res.send("You already have an account pls login"); }
        else {
            db.run('INSERT INTO users (firstName, lastName, password, email, major, age, photo, hobbies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, password, email, program, age, photo, hobbies]);
            req.session.user = req.body.email;
            res.redirect( "/users/home/" + email);
        }
    });
})

router.post("/update", (req, res) => {
    const { firstName, lastName, password, email, program, age, hobbies, photo } = req.body;

    // Optional: Verify session user matches the email
    if (req.session.user !== email) {
        console.log("Unauthorized access attempt by:", req.session.user, email);
        return res.status(403).send("Unauthorized");
    }

    const sql = `
        UPDATE users 
        SET 
            firstName = ?, 
            lastName = ?, 
            password = ?, 
            major = ?, 
            age = ?, 
            photo = ?, 
            hobbies = ?
        WHERE email = ?
    `;

    const values = [firstName, lastName, password, program, age, photo, hobbies, email];

    db.run(sql, values, function(err) {
        if (err) {
            console.error("Update error:", err);
            return res.status(500).send("Database update failed");
        }

        res.redirect("/users/profile/" + email); // or wherever you want to take the user
    });
});


module.exports = router;