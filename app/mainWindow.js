const {BrowserWindow} = require('electron')
var logger = require("./logger")

module.exports = {
    class: class MainWindow {

      // PRIVATE PROPERTIES
      _mainWindow = null
      _eventChannel = null
      _framed = true

      // CONSTRUCTOR
      constructor(json) {
        var windowFile = json['windowFile']
        this._framed = json['framed']
        this._mainWindow = this.createWindow(windowFile)

        this._eventChannel = this.initEventChannel(this._mainWindow)
      }

      createWindow(windowFile) {
        // Create the browser window.
        logger.log('create new window');
        var newWindow = new BrowserWindow({
          width: 250,
          height: 800,
          frame: this._framed,
          webPreferences: {
            nodeIntegration: true
          }
        })

        // and load the index.html of the app.
        newWindow.loadFile(windowFile)

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

      initEventChannel(window) {
        // Event Channel between browser window and main process
        var inboundEventChannel = require('electron').ipcMain
        var outboundEventChannel = window.webContents

        return require("./eventChannel")("mainEventChannel", inboundEventChannel, outboundEventChannel)
      }

      close() {
        this.window.close()
      }

      get eventChannel() {
        return this._eventChannel
      }

      get window() {
        return this._mainWindow
      }

      get framed() {
        return this._framed
      }
    }
}

