const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const users = require('./users');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(__dirname, 'mydatabase.db'));

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (firstName TEXT, lastName TEXT, password TEXT, email TEXT, major TEXT, age NUMERIC, photo TEXT, hobbies TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS user_courses (user_email TEXT, course_name TEXT)')
    db.run('CREATE TABLE IF NOT EXISTS friends (user_email TEXT, friend_email TEXT)')
    db.run('CREATE TABLE IF NOT EXISTS messages (sender TEXT, recipient TEXT, message TEXT)')
    db.run('CREATE TABLE IF NOT EXISTS friend_requests (sender TEXT, recipient TEXT)')
});

module.exports = {db}