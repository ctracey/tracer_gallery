const {BrowserWindow} = require('electron')
var logger = require("./logger")

module.exports = {
    class: class Window {

      // PRIVATE PROPERTIES
      _browserWindow = null
      _framed = true
      _height = 800
      _width = 250

      // CONSTRUCTOR
      constructor(json) {
        var windowFile = json['windowFile']
        this._framed = json['framed']
        if (json['width']) this._width = json['width']
        if (json['height']) this._height = json['height']

        this._browserWindow = this.createWindow(windowFile)
      }

      createWindow(windowFile) {
        // Create the browser window.
        logger.log('create new window');
        var newWindow = new BrowserWindow({
          width: this._width,
          height: this._height,
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

          //TODO: handle imageViewer closed manually (main window vs imageViewer)
          //  consider named/typed/constants for reference when creating Window instances
          //  at the moment manually closing main window does nothing
          newWindow = null
        })

        return newWindow
      }

      get inboundEventChannel() {
        return this._browserWindow.webContents
      }

      show() {
        this._browserWindow.show()
      }

      close() {
        logger.log('closing window')
        this.inboundEventChannel.removeAllListeners()
        this._browserWindow.close()
      }

      get framed() {
        return this._framed
      }
    }
}

