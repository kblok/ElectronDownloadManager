const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let testDownload

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  loadFiles();
   
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

var fileList = [];

function loadFiles() {
    // In the main process.
    // In the main process.
    const {BrowserWindow} = require('electron')
    let win = new BrowserWindow()
    win.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    testDownload = item
    item.setSavePath('/tmp/save.pdf')

    item.on('updated', (event, state) => {
        if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
        } else if (state === 'progressing') {
            if (item.isPaused()) {
                console.log('Download is paused')
            } else {
                console.log(`Received bytes: ${item.getReceivedBytes()}`)
            }
           senderWindow.send("progress", testDownload.getReceivedBytes() / testDownload.getTotalBytes() * 100);
        }
    });
    item.once('done', (event, state) => {
        if (state === 'completed') {
        console.log('Download successfully')
        } else {
        console.log(`Download failed: ${state}`)
        }
    });
    })
    
}

electron.ipcMain.on("addFile", function (sender, fileInfo) {
    mainWindow.webContents.downloadURL(fileInfo.url);
})

electron.ipcMain.on("pauseTestFile", function () {
    testDownload.pause();
})

electron.ipcMain.on("playTestFile", function() {
    testDownload.resume();
})
electron.ipcMain.on("getProgress", function(event) {
    if (testDownload && !testDownload.isDestroyed()){
        event.sender.send("progress", testDownload.getReceivedBytes() / testDownload.getTotalBytes() * 100);
    } else {
        console.log("finished!");
    }
})

var senderWindow;
electron.ipcMain.on("registerWindow", function(event) {
    senderWindow = event.sender;
})
