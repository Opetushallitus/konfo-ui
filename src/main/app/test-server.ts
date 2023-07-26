import http from 'http';
import path from 'path';

import express from 'express';

const app = express();

app.use('/konfo', express.static(path.join(__dirname, 'build')));
app.get(['/konfo', '/konfo/*'], (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

http.createServer(app).listen(3005);
