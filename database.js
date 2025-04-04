
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const users = require('./users');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');



db.serialize(() => {
    db.run('CREATE TABLE users (firstName TEXT, lastName TEXT, password TEXT, email TEXT, major TEXT, age NUMERIC)');
    db.run('CREATE TABLE courses (name TEXT)')
    db.run('CREATE TABLE user_courses (user_email TEXT, course_name TEXT)')
    db.run('CREATE TABLE friends (user_email TEXT, friend_email TEXT)')

});

fs.readFile("./data/courses.json", 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Courses read failed:", err)
        return
    }
    const courses = JSON.parse(jsonString).courses;
    for(let i = 0; i < courses.length; i++) {
        db.run('INSERT INTO courses (name) VALUES (?)', [courses[i].name]);
    }
})

module.exports = {db}