const express = require('express');
const path = require('path');

// __dirname は test/ を指してしまうので、一階層上を取得
const projectRoot = path.join(__dirname, '..');

const hostname = 'localhost';
const port = 8000;
const repository = "kyoto-kaira.github.io";

const app = express();

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/${repository}/`);
});

// HTML や JS をすべて提供
app.use(`/${repository}`, express.static(projectRoot));

// 404 ページ
app.use((req, res) => {
  res.status(404).sendFile(path.join(projectRoot, '404.html'));
});
