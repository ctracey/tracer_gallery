const {BrowserWindow} = require('electron')
var logger = require("./logger")

module.exports = {
    class: class Window {

      // PRIVATE PROPERTIES
      _name = null
      _browserWindow = null
      _height = 800
      _width = 250
      _framed = true

      // CONSTRUCTOR
      constructor(json) {
        var windowFile = json['windowFile']
        if (!json['name']) throw 'Cannot initialise Window - Missing required param: name'
        if (json['width']) this._width = json['width']
        if (json['height']) this._height = json['height']
        this._framed = json['framed']

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

        return newWindow
      }

      onClose(windowName, handler) {
        // Emitted when the window is closed.
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.

        //  consider named/typed/constants for reference when creating Window instances
        //  at the moment manually closing main window does nothing
        this._browserWindow.on('closed', function () {
          logger.log('Handling window closed: ' + windowName)
          handler()
        })
      }

      get name() {
        return this._name
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

