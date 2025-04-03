#!/usr/bin/node
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const PORT = 8038;
const HOST = 'localhost';


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/public/style.css");
});



app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT );
});
