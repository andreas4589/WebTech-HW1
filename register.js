// This file defines routes for user registration and profile updates


const express = require("express");
const router = express.Router();
const {db} = require("./database");

//route to handle users registration
router.post("/", (req, res) => {
    // get all the info sent by the user and put them into a variables
    const {firstName, lastName, password, email, program, age, hobbies, photo, courses} = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        // check if a user already have an account
        if (result !== undefined) { res.send("You already have an account please login"); }
        else {
            // if the user doesn't exist, we add him in the user table...
            db.run('INSERT INTO users (firstName, lastName, password, email, major, age, photo, hobbies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, password, email, program, age, photo, hobbies]);
            courses.forEach(course => {
                // ... and his courses in the user_courses table
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
            
            req.session.user = req.body.email;        //store user's email in the session for subsequent requests
            res.redirect( "/users/home/" + email);        // redirect the user to the home page
        }
    });
})


//route to handle updating user information (POST request to /update)
// for user_edit_profile
router.post("/update", (req, res) => {
    // get all the info sent by the user and put them into a variables
    const { firstName, lastName, password, email, program, age, hobbies, photo, courses } = req.body;
  
    // Check if the user logged in is the same as the user whose profile is being modified
    if (req.session.user !== email) {
      return res.status(403).send("Unauthorized");
    }
  
    // SQL queries to update the tables

    // Step1: update the users
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