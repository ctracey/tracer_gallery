const EventChannel = require('./eventChannel').class
const Preferences = require('./preferences').class
var logger = require('./logger')

const APP_PREFERENCES_FILE_PATH = '/preferences/preferences.json'
const MAIN_WINDOW_CHANNEL_NAME = 'mainWindowChannel'
const MAIN_WINDOW_NAME = 'mainWindow'
const IMAGE_VIEWER_WINDOW_CHANNEL_NAME = 'imageViewerWindowChannel'
const IMAGE_VIEWER_WINDOW_NAME = 'imageViewerWindow'

module.exports = {
    // CONSTANTS
    APP_PREFERENCES_FILE_PATH        : APP_PREFERENCES_FILE_PATH,
    MAIN_WINDOW_CHANNEL_NAME         : MAIN_WINDOW_CHANNEL_NAME,
    MAIN_WINDOW_NAME                 : MAIN_WINDOW_NAME,
    IMAGE_VIEWER_WINDOW_CHANNEL_NAME : IMAGE_VIEWER_WINDOW_CHANNEL_NAME,
    IMAGE_VIEWER_WINDOW_NAME         : IMAGE_VIEWER_WINDOW_NAME,

    class: class AppHelper {

      // PRIVATE PROPERTIES
      _app = null
      _eventChannel = null
      _mainWindow = null

      // CONSTRUCTOR
      constructor(app, mainWindow) {
        this._app = app
        this._mainWindow = mainWindow
        this.initEventChannel()
      }

      initEventChannel() {
        // Event Channel between browser window and main process
        this._eventChannel = new EventChannel({
          'channelName'         : "mainEventChannel",
          'inboundChannel'      : require('electron').ipcMain,
          'outboundChannelName' : MAIN_WINDOW_CHANNEL_NAME,
          'outboundChannel'     : this._mainWindow.inboundEventChannel
        })
      }

      quit() {
        logger.log('QUITTING')
        this._eventChannel.send(this._eventChannel.EVENT_PAUSE_EXHIBITION, {})
        this._eventChannel.send(this._eventChannel.EVENT_CLOSE_MAIN_WINDOW, {})
        this._app.quit()
      }

      preferencesFilePath() {
        return this.app.getAppPath() + APP_PREFERENCES_FILE_PATH
      }

      localisedDefaultFolderPath() {
        return this.app.getAppPath() + '/' + new Preferences({}).DEFAULT_FOLDER
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

