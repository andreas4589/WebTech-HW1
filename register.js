const express = require("express");
const router = express.Router();
const {db} = require("./database");
const cookieParser = require('cookie-parser');

router.post("/", (req, res) => {
    const {firstName, lastName, password, email, program, age, hobbies, photo, courses} = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (result !== undefined) { res.send("You already have an account pls login"); }
        else {
            db.run('INSERT INTO users (firstName, lastName, password, email, major, age, photo, hobbies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, password, email, program, age, photo, hobbies]);
            courses.forEach(course => {
                db.run(
                    'INSERT INTO user_courses (user_email, course_name) VALUES (?, ?)',
                    [email, course],
                    (err) => {
                        if (err) {
                            console.error("Failed to insert course:", course, err);
                        }
                    }
                );
            });
            
            req.session.user = req.body.email;
            res.redirect( "/users/home/" + email);
        }
    });
})

router.post("/update", (req, res) => {
    const { firstName, lastName, password, email, program, age, hobbies, photo, courses } = req.body;
  
    if (req.session.user !== email) {
      return res.status(403).send("Unauthorized");
    }
  
    const updateUserSQL = `
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
  
    const userValues = [firstName, lastName, password, program, age, photo, hobbies, email];
  
    db.run(updateUserSQL, userValues, function (err) {
      if (err) {
        console.error("User update error:", err);
        return res.status(500).send("User update failed");
      }
  
      // Step 2: Update courses
      db.run("DELETE FROM user_courses WHERE user_email = ?", [email], function (err) {
        if (err) {
          console.error("Course delete error:", err);
          return res.status(500).send("Course reset failed");
        }
  
        // Insert the new course selections (assuming 'courses' is an array)
        if (Array.isArray(courses) && courses.length > 0) {
          const insertCourseSQL = "INSERT INTO user_courses (user_email, course_name) VALUES (?, ?)";
          const stmt = db.prepare(insertCourseSQL);
  
          courses.forEach(course => {
            stmt.run(email, course);
          });
  
          stmt.finalize();
        }
  
        res.redirect("/users/profile/" + email);
      });
    });
  });
  

module.exports = router;