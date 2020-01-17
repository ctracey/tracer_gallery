//Modules to control application life and create native browser window

var logger = require("./app/logger")

const {app, BrowserWindow, Menu} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let _eventChannel
let _curator

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    logger.debug('QUITTING')
    _eventChannel.send(_eventChannel.EVENT_PAUSE_EXHIBITION, {})
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) init()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function init() {
  mainWindow = createWindow()
  _eventChannel = initEventChannel(mainWindow)

  createApplicationMenu(_eventChannel)

  _curator = require("./app/curator")(app, _eventChannel)
  _curator.handleEvents()
}

function createWindow () {
  // Create the browser window.
  logger.log('create new window');
  newWindow = new BrowserWindow({
    width: 250,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  newWindow.loadFile('index.html')

  // Open the DevTools.
  // newWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  newWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    newWindow = null
  })

  return newWindow
}

function createApplicationMenu(eventChannel) {
  //Setup menu items
  var menu = require("./app/menu")(app, eventChannel)
  menu.createApplicationMenu()
}

function initEventChannel(_window) {
  var inboundEventChannel = require('electron').ipcMain
  var outboundEventChannel = _window.webContents

  return require("./app/eventChannel")("mainEventChannel", inboundEventChannel, outboundEventChannel)
}

