const express = require("express");
const router = express.Router();
const login = require("./login");
const register = require("./register");
const { db } = require("./database");

router.use("/authentication/login", login);
router.use("/authentication/register", register);

router.get("/home/:userid", function (req, res) {
  if (req.session.user && req.session.user == req.params.userid) {
    db.get(
      "SELECT firstName, lastName FROM users WHERE email = ?",
      [req.params.userid],
      function (err, result) {
        res.render("user_home", {
          firstname: result.firstName,
          lastname: result.lastName,
          email: req.params.userid,
        });
      }
    );
  } else {
    res.send("Not Found");
  }
});

router.get("/profile/:userid", function (req, res) {
  const profile = req.params.userid;

  if (req.session.user !== profile) {
    db.get(
        `SELECT * FROM friends 
         WHERE (user_email = ? AND friend_email = ?) 
            OR (user_email = ? AND friend_email = ?)`,
        [req.session.user, profile, profile, req.session.user], function (err, result) {
        if (result !== undefined) { 
            view(profile, db, req, res);
        }
        else {
            res.send("Not Found");
        }
    })
    return 
  }

  view(profile, db, req, res);
});

function view(profile, db, req, res){
  db.get(
    "SELECT firstName, lastName, age, email, photo, major, hobbies FROM users WHERE email = ?",
    [profile],
    function (err, user) {
      if (err) {
        console.error("Database error (user):", err);
        return res.status(500).send("Database error");
      }

      if (!user) return res.status(404).send("User not found");

      // Get courses after user is found
      db.all(
        "SELECT course_name FROM user_courses WHERE user_email = ?",
        [profile],
        function (err, courses) {
          if (err) {
            console.error("Database error (courses):", err);
            return res.status(500).send("Database error");
          }

          res.render("user_profile", {
            fname: user.firstName,
            lname: user.lastName,
            age: user.age,
            email: profile,
            photo: user.photo,
            program: user.major,
            hobbies: user.hobbies,
            courses: courses,
            useremail: req.session.user,
          });
        }
      );
    }
  );
}

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

      res.render("user_profile_edit", {
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
        SELECT u.firstName, u.lastName, u.email, u.photo
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
      email: email,
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
        courses: rows, 
      });
    }
  );
});

router.get("/message-box/:useremail", function (req, res) {
  const email = req.params.useremail;

  // Optional: check if logged-in user matches the email
  if (req.session.user !== email) {
    return res.redirect("/");
  }

  db.get(
    "SELECT firstName FROM users WHERE email = ?",
    [email],
    function (err, userResult) {
      if (userResult) {
        const firstName = userResult.firstName;

        db.all(
          `
                SELECT u.firstName, u.lastName, u.email, m.message 
                FROM messages m 
                JOIN users u ON u.email = m.sender 
                WHERE m.recipient = ?`,
          [email],
          function (err, messagesResult) {
            res.render("message-box", {
              name: firstName,
              email: email,
              messages_list: messagesResult || [],
            });
          }
        );
      } else {
        res.send("User not found");
      }
    }
  );
});

router.get("/write-message/:recipient", function (req, res) {
  var recipient = req.params.recipient;
  if (req.session.user) {
    var name;
    db.get(
      "SELECT firstName FROM users WHERE email = ?",
      [req.session.user],
      function (err, result) {
        if (result !== undefined) {
          name = result.name;
          db.all(
            `
                    SELECT u.firstName, u.lastName, f.friend_email FROM users u friends f
                    WHERE f.user_email=? AND f.friend_email=u.email`,
            [req.session.userid],
            function (err, result) {
              if (result !== undefined) {
                res.render("write-message", {
                  name: name,
                  friends_list: result,
                  recipient: recipient,
                  email: req.session.user,
                });
              } else {
                res.render("write-message", {
                  name: name,
                  friends_list: [],
                  recipient: recipient,
                  email: req.session.user,
                });
              }
            }
          );
        } else {
          res.send("Not Found");
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

router.get("/write-message", function (req, res) {
  var recipient = "";
  if (req.session.user) {
    var name;
    db.get(
      "SELECT firstName FROM users WHERE email = ?",
      [req.session.user],
      function (err, result) {
        if (result !== undefined) {
          name = result.name;
          db.all(
            `
                    SELECT u.firstName, u.lastName, f.friend_email FROM users u friends f
                    WHERE f.user_email=? AND f.friend_email=u.email`,
            [req.session.userid],
            function (err, result) {
              if (result !== undefined) {
                res.render("write-message", {
                  name: name,
                  friends_list: result,
                  recipient: recipient,
                  email: req.session.user,
                });
              } else {
                res.render("write-message", {
                  name: name,
                  friends_list: [],
                  recipient: recipient,
                  email: req.session.user,
                });
              }
            }
          );
        } else {
          res.send("Not Found");
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

router.get("/friends/:userid", (req, res) => {
  const user = req.params.userid;

  if (req.session.user !== user) {
      return res.redirect("/");
  }

  // Get confirmed friends (bidirectional)
  const friendsQuery = `
      SELECT u.firstName, u.lastName, u.email, u.photo
      FROM users u
      JOIN friends f 
      ON (f.friend_email = u.email AND f.user_email = ?)
         OR (f.user_email = u.email AND f.friend_email = ?)
  `;

  // Get incoming friend requests
  const requestsQuery = `
      SELECT u.firstName, u.lastName, u.email, u.photo
      FROM users u
      JOIN friend_requests fr ON fr.sender = u.email
      WHERE fr.recipient = ?
  `;

  db.all(friendsQuery, [user, user], (err, friends) => {
      if (err) {
          console.error("Error fetching friends:", err);
          return res.status(500).send("Database error");
      }

      db.all(requestsQuery, [user], (err, requests) => {
          if (err) {
              console.error("Error fetching friend requests:", err);
              return res.status(500).send("Database error");
          }

          res.render("friends", {
              email: user,
              friends: friends,
              requests: requests,
          });
      });
  });
});


router.post("/sendMessage", function (req, res) {
  if (req.session.user) {
    var sender = req.session.userid;
    var recipient = req.body.recipient;
    var message = req.body.message - content;

    db.run(
      "INSERT INTO messages (sender, recipient, message) VALUES (?, ?, ?)",
      [sender, recipient, message]
    );

    res.send("The message was sent successfully !");
  } else {
    res.redirect("/login");
  }
});

router.post("/send-friend-request", (req, res) => {
  const sender = req.session.user;
  const recipient = req.body.recipient;

  if (!sender || !recipient) {
      return res.status(400).send("Missing sender or recipient.");
  }

  // Check if a request already exists (either direction if needed)
  db.get(
      `SELECT * FROM friend_requests 
       WHERE sender = ? AND recipient = ?`,
      [sender, recipient],
      (err, existingRequest) => {
          if (err) {
              console.error("Error checking existing request:", err);
              return res.status(500).send("Database error");
          }

          if (existingRequest) {
              return res.send("Friend request already sent.");
          }

          // Insert new friend request
          db.run(
              "INSERT INTO friend_requests (sender, recipient) VALUES (?, ?)",
              [sender, recipient],
              function (err) {
                  if (err) {
                      console.error("Error inserting friend request:", err);
                      return res.status(500).send("Database error");
                  }

                  res.send("Friend request sent!");
                  // Or redirect: res.redirect("back");
              }
          );
      }
  );
});



module.exports = router;
