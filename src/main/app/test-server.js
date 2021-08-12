const http = require('http');
const path = require('path');

const express = require('express');

const app = express();
app.use('/konfo', express.static(path.join(__dirname, 'build')));

app.get(['/konfo', '/konfo/*'], function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

http.createServer(app).listen(3005);
