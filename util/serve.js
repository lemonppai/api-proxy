/**
 * 服务器mock
 */
const express = require('express');
const Mock = require('mockjs');   // Document: http://mockjs.com
// const chalk = require('chalk');
const fs = require('fs');
const url = require('url');

const app = express();

module.exports = {
  server: null,

  create(port = 8070, delay = 500) {
    // 中间件，延时响应
    app.use((req, res, next) => {
      setTimeout(() => next(), delay);
    });

    app.use((req, res) => {
      const pathname = url.parse(req.url).pathname;
      // console.log(pathname)
      // console.log(req)
      fs.readFile('./data/api' + pathname, (err, data) => {
        if (err) {
          res.send(404);
          return;
        }

        const mockData = Mock.mock(JSON.parse(data));
        res.send(mockData);
      });
    });

    // 监听port端口
    this.server = app.listen(port, '0.0.0.0', (err) => {
      if (err) throw err;
      // console.log(`> Listening at ` + chalk.bold.blue(`http://localhost:${port}`));

      console.log(`> Listening at http://localhost:${port}`);
    });
  },

  close() {
    if (this.server) {
      // console.log('close')
      this.server.close();
      this.server = null;
    }
  }
}
