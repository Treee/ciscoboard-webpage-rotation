const path = require('path');
const express = require('express');
var app = express();

var dir = path.join(__dirname, 'public');

app.use(express.static(dir));

app.listen(3000, () => {
    console.log(new Date().toISOString());
    console.log('Started Listening on http://localhost:3000');
});