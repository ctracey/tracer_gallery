var logger = require("./logger")

module.exports = {
    class: class AppHelper {

      // PRIVATE PROPERTIES
      _app = null
      _eventChannel = null
      _mainWindow = null

      // CONSTRUCTOR
      constructor(app, eventChannel, mainWindow) {
        //TODO: both directional event channels? IE ability to send local messages
        this._app = app
        this._eventChannel = eventChannel
        this._mainWindow = mainWindow
      }

      quit() {
        logger.log('QUITTING')
        this._eventChannel.send(this._eventChannel.EVENT_PAUSE_EXHIBITION, {})
        this._eventChannel.send(this._eventChannel.EVENT_CLOSE_MAIN_WINDOW, {})
        this._app.quit()
      }

      get app() {
        return this._app
      }

      get eventChannel() {
        return this._eventChannel
      }

      get mainWindow() {
        return this._mainWindow
      }

      set mainWindow(mainWindow) {
        this._mainWindow = mainWindow
      }
    }
}

