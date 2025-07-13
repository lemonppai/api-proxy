const url = require('url');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

function isExist(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stat) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stat.isDirectory());
      }
    })
  })
}

function mkdir(dir) {
  return new Promise((resolve) => {
    fs.mkdir(dir, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  })
}

async function createDir(dir) {
  if (!await isExist(dir)) {
    if (dir) {
      const tempDir = path.parse(dir).dir;

      await createDir(tempDir)

      await mkdir(tempDir);
    }
  }
}

async function saveFile(path, data) {
  await createDir(path);
  fs.writeFileSync(path, data);
}

module.exports = (webWindow, id) => {
  try {
    webWindow.webContents.debugger.attach('1.1');
  } catch (err) {
    console.log('调试器连接失败: ', err)
  }

  webWindow.webContents.debugger.on('detach', (event, reason) => {
    console.log('调试器由于以下原因而分离 : ', reason)
  });

  webWindow.webContents.debugger.on('message', (event, method, params) => {
    if (method === 'Network.responseReceived') {
      const mimeType = params.response.mimeType;
      const resourceUrl = params.response.url;

      // 在这里可以添加对特定 MIME 类型的处理逻辑，html进行保存
      if (mimeType === 'text/html') {
        axios.get(resourceUrl)
          .then(response => response.text())
          .then(html => {
            const location = url.parse(resourceUrl);
            const pathname = location.pathname;
            if (pathname.endsWith('/')) {
              pathname += 'index.html'; // 确保目录有一个默认文件
            }
            // 没.html后缀的路径
            if (!pathname.endsWith('.html')) {
              pathname += '.html';
            }

            saveFile(`resources/${id + pathname}`, html);
          });
      }
      else {
        webWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(function(response) {
          // html没响应
          console.log(mimeType);

          // console.log(JSON.parse(response.body));
          const location = url.parse(resourceUrl);
          const pathname = location.pathname;

          // base64 图片路径存储为文件
          if (location.protocol === 'data:') {
            const ext = location.pathname.split(';')[0].split('/')[1];
            // saveFile(`resources/${id}/${+new Date}.${ext}`, response.body);
          }
          else {
            saveFile(`resources/${id + pathname}`, response.body);
          }
        });
      }
    }
  });

  webWindow.webContents.debugger.sendCommand('Network.enable');
}
