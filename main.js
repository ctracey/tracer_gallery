//Modules to control application life and create native browser window

var logger = require("./app/logger")
var Window = require("./app/window").class
var AppHelper = require("./app/appHelper")

const {app} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let _mainWindow
let _appHelper

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    _appHelper.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (_mainWindow === null) init()
})

process.on('uncaughtException', function (error) {
  logger.error(error)
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function init() {
  _mainWindow = createMainWindow()
  _appHelper = initAppHelper()

  createApplicationMenu(_appHelper)
  setupGalleryCurator()
}

function createMainWindow() {
  var newWindow = new Window({
    'name'      : AppHelper.MAIN_WINDOW_NAME,
    'windowFile': 'index.html',
    'framed'    : true
  })
  newWindow.onClose(newWindow.name, function () {
    newWindow = null
  })

  return newWindow
}

function setupGalleryCurator() {
  _curator = require("./app/curator")(_appHelper)
  _curator.handleEvents()
}

function initAppHelper() {
  //TODO: use class and constants for other classes
  return new AppHelper.class(app, _mainWindow)
}

function createApplicationMenu(appHelper) {
  //Setup menu items
  var menu = require("./app/menu")(appHelper)
  menu.createApplicationMenu()
}

