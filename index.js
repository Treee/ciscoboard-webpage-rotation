const path = require('path');
const express = require('express');
const fs = require('fs');
var app = express();

const dexterConfigPath = './appdynamics.dexter/DefaultJob.json';
var config = require(dexterConfigPath);

var dir = path.join(__dirname, 'public');

app.use(express.static(dir));

app.listen(3000, () => {
    let timestamp = new Date().toISOString();
    config.Input.TimeRange.From = timestamp;
    config.Input.TimeRange.To = timestamp;
    writeToDexterConfig(dexterConfigPath);
    console.log('config', config);
    console.log('Started Listening on http://localhost:3000', timestamp);
});

writeToDexterConfig = (filename) => {
    fs.writeFileSync(filename, JSON.stringify(config));
};