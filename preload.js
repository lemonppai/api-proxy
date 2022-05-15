const { ipcRenderer, contextBridge } = require('electron')
const remote = require('@electron/remote');

window.addEventListener('DOMContentLoaded', () => {
})

// 注入全局变量
contextBridge.exposeInMainWorld('toolkit', {
  open(url) {
    ipcRenderer.send('open', {
      url: url
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
