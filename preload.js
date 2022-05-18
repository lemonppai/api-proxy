const { ipcRenderer, contextBridge } = require('electron')
const remote = require('@electron/remote');
const db = require('./util/db.js');
const rmdir = require('rmdir');

/* function rmdir(dirPath) {
  if (fs.existsSync(dirPath)) {
    let files = fs.readdirSync(dirPath);
    let childPath = null;

    files.forEach(file => {
      childPath = `${dirPath}/${file}`;

      if (fs.statSync(childPath).isDirectory()) {
        rmdir(childPath);
        fs.rmdirSync(childPath);
      }
      else {
        fs.unlinkSync(childPath)
      }
    });

    fs.rmdirSync(dirPath);
  }
  else {
    console.log(`${dirPath} 路徑不存在`);
  }
} */

window.addEventListener('DOMContentLoaded', () => {
})

// 注入全局变量
contextBridge.exposeInMainWorld('toolkit', {
  open(url, id) {
    ipcRenderer.send('open', {
      url: url,
      id: id,
    });
  },

  createServe(port) {
    ipcRenderer.send('serve.create', { port });
  },

  closeServe() {
    ipcRenderer.send('serve.close');
  },

  openDevTools() {
    remote.getCurrentWindow().webContents.openDevTools();
  },

  async print() {
    let webContents = remote.getCurrentWebContents();
    let printers = await webContents.getPrintersAsync();

    // console.log(res)
    printers.forEach((item, n) => {
      console.log(item)
    });

    webContents.print(
      {
        // silent: true,
        silent: false,
        printBackground: true,
        deviceName: '',
      }, (success, errorType) => {
        if (!success) console.log(errorType);
      }
    );
  },
})

// 注入全局变量
contextBridge.exposeInMainWorld('api', {
  project: {
    get(params = {}) {
      return new Promise((resolve) => {
        db.project.find(params, (err, docs) => {
          if (!err) {
            resolve({
              data: {
                status: 'ok',
                data: docs,
              }
            });
          }
        });
      });
    },

    insert(params) {
      return new Promise((resolve) => {
        db.project.insert(params, (err) => {
          if (!err) {
            resolve({
              data: {
                status: 'ok',
                msg: '新增成功',
              }
            });
          }
        });
      });
    },

    update(params) {
      // console.log(params)

      return new Promise((resolve) => {
        db.project.update({ _id: params._id }, params, {}, (err) => {
          if (!err) {
            resolve({
              data: {
                status: 'ok',
                msg: '编辑成功',
              }
            });
          }
        });
      });
    },

    remove(params) {
      return new Promise((resolve) => {
        // console.log(params);
        db.project.find({ _id: params._id }, (err, docs) => {
          if (!err) {
            db.project.remove({ _id: params._id }, (err) => {
              if (!err) {
                resolve({
                  data: {
                    status: 'ok',
                    msg: '删除成功',
                  }
                });
              }
            });

            if (docs[0]) {
              rmdir(`data/api/${docs[0]._id}`);
            }
          }
        });
      });
    },
  },
});
