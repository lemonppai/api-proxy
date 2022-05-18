const url = require('url');
const fs = require('fs');
const path = require('path');

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
      var mimeType = params.response.mimeType;

      if (mimeType == 'application/json') {
        webWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(function(response) {
          // console.log(JSON.parse(response.body));
          const location = url.parse(params.response.url);
          const pathname = location.pathname;
          saveFile(`data/${id + pathname}`, response.body);
        });
      }
    }
  });

  webWindow.webContents.debugger.sendCommand('Network.enable');
}
