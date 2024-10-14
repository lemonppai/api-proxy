// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain, Tray} = require('electron')
const remote = require("@electron/remote/main")
const path = require('path')
const getHttpData = require('./util/getHttpData');
const serve = require('./util/serve');

remote.initialize();

// 隐藏菜单栏
Menu.setApplicationMenu(null);

let mainWindow = null;

const defaultUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'dist/build/index.html';

// const defaultUrl = 'http://localhost:3000/';
// const defaultUrl = 'dist/build/index.html';

function createWindow (url = defaultUrl, preload = path.join(__dirname, 'preload.js'), parent = mainWindow) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    // frame: false,  // 无边框
    // parent: parent,
    // alwaysOnTop: true,
    webPreferences: {
      // webviewTag: true,
      // enableRemoteModule: true,
      // sandbox: true,
      nodeIntegration: true,
      enableRemoteModule: true,   // 使用remote模块
      // contextIsolation: false,
      preload: preload,
    }
  })

  // getHttpData(mainWindow);

  // and load the index.html of the app.
  // mainWindow.loadURL('http://172.16.52.215:9098/')
  if (/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
    mainWindow.loadURL(url)
  }
  else {
    mainWindow.loadFile(url)
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  remote.enable(mainWindow.webContents)

  return mainWindow;
}

ipcMain.on('open', (event, data) => {
  // console.log(event, data);
  const webWindow = createWindow(data.url);
  getHttpData(webWindow, data.id);
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray = null;
app.whenReady().then(() => {
  mainWindow = createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow()
  })

  tray = new Tray('build/icons/logo.ico')
  const contextMenu = Menu.buildFromTemplate([
    {
      role: 'quit',
      label: '退出'
    }
  ]);

  tray.setContextMenu(contextMenu);

  // 托盘图标被双击
  tray.on('double-click', () => {
    // 显示窗口
    mainWindow.show();
  });

  // 窗口最小化
  mainWindow.on('minimize', ev => {
    // 阻止最小化
    ev.preventDefault();
    // 隐藏窗口
    mainWindow.hide();
  });
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
    serve.close();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
