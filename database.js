const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const fs = require('fs');
const coursesFile = require('./data/courses.json');

db.serialize(() => {
    db.run('CREATE TABLE users (firstName TEXT, lastName TEXT, password TEXT, email TEXT, major TEXT, age NUMERIC)');
    db.run('CREATE TABLE courses (name TEXT)')
    db.run('CREATE TABLE user_courses (user_email TEXT, course_name TEXT)')
    db.run('CREATE TABLE friends (user_email TEXT, friend_email TEXT)')

});

fs.readFile('./data/courses.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Courses read failed:", err)
        return
    }
    const courses = JSON.parse(jsonString).courses;
    for(let i = 0; i < courses.length; i++) {
        db.run('INSERT INTO courses (name) VALUES (?)', [courses[i].name]);
    }
})

function registerUser(person){
    db.get("SELECT * FROM users WHERE email = ?", [person.email], (err, result) => {
        if (result === null) { return err.message; }
        else {
            db.run('INSERT INTO users (firstName, lastName, password, email, major, age) VALUES (?, ?, ?, ?, ?, ?)', [person.firstName, person.lastName, person.password, person.email, person.major, person.age]);
            return "inserted person with name: " + person.firstName;
        }
    });
}

function getUsers(callback) {
    db.all('SELECT * FROM users', callback);
}

function getCourses(callback) {
    db.all('SELECT * FROM courses', (err, rows) => {
        if (err) {
            return callback(err);
        }
        else {
            const data = rows.map(obj => obj.name);
            callback(err, data);
        }
    });
}

module.exports = {registerUser, getUsers, getCourses};

