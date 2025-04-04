const express = require("express");
const router = express.Router();
const login = require('./login');
const register = require('./register');

router.use("/authentication/login", login);
router.use("/authentication/register", register);

router.get("/", function (req, res) {
    res.send("Hello World!");
})



module.exports = router;