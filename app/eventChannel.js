var logger = require("./logger")

const EVENT_INIT_GALLERY =              'init-gallery'
const EVENT_CLOSE_MAIN_WINDOW =         'close-mainwindow'
const EVENT_GALLERY_LOADED =            'gallery-loaded'
const EVENT_SELECT_GALLERY_IMAGES =     'select-gallery-images'
const EVENT_GALLERY_IMAGES_SELECTED =   'gallery-images-selected'

const EVENT_SAVE_PREFERENCES =          'save-preferences'
const EVENT_PREFERENCES_SAVED =         'preferences-saved'
const EVENT_EDIT_PREFERENCES =          'edit-preferences'
const EVENT_PICK_PREFERENCES_FOLDER =   'pick-preferences-folder'
const EVENT_PREFERENCES_FOLDER_PICKED = 'preferences-folder-picked'

const EVENT_MENU_ITEM_SELECTED =        'event-menu-item-selected'
const EVENT_PLAYPAUSE_EXHIBITION =      'playpause-exhibition'
const EVENT_PAUSE_EXHIBITION =          'pause-exhibition'
const EVENT_TOGGLE_WINDOW_FRAME =       'toggle-window-frame'

const EVENT_VIEW_IMAGE =                'view-image'
const EVENT_IMAGEVIEW_LOADED =          'imageview-loaded'
const EVENT_INIT_IMAGEVIEW =            'init-imageview'
const EVENT_CLOSE_IMAGEVIEW =           'close-imageview'

module.exports = {
  class: class EventChannel {

    get EVENT_INIT_GALLERY () { return EVENT_INIT_GALLERY }
    get EVENT_CLOSE_MAIN_WINDOW () { return EVENT_CLOSE_MAIN_WINDOW }
    get EVENT_GALLERY_LOADED () { return EVENT_GALLERY_LOADED }
    get EVENT_SELECT_GALLERY_IMAGES () { return EVENT_SELECT_GALLERY_IMAGES }
    get EVENT_GALLERY_IMAGES_SELECTED () { return EVENT_GALLERY_IMAGES_SELECTED }

    get EVENT_SAVE_PREFERENCES () { return EVENT_SAVE_PREFERENCES }
    get EVENT_PREFERENCES_SAVED () { return EVENT_PREFERENCES_SAVED }
    get EVENT_EDIT_PREFERENCES () { return EVENT_EDIT_PREFERENCES }
    get EVENT_PICK_PREFERENCES_FOLDER () { return EVENT_PICK_PREFERENCES_FOLDER }
    get EVENT_PREFERENCES_FOLDER_PICKED () { return EVENT_PREFERENCES_FOLDER_PICKED }

    get EVENT_MENU_ITEM_SELECTED () { return EVENT_MENU_ITEM_SELECTED }
    get EVENT_PLAYPAUSE_EXHIBITION () { return EVENT_PLAYPAUSE_EXHIBITION }
    get EVENT_PAUSE_EXHIBITION () { return EVENT_PAUSE_EXHIBITION }
    get EVENT_TOGGLE_WINDOW_FRAME () { return EVENT_TOGGLE_WINDOW_FRAME }

    get EVENT_VIEW_IMAGE () { return EVENT_VIEW_IMAGE }
    get EVENT_IMAGEVIEW_LOADED () { return EVENT_IMAGEVIEW_LOADED }
    get EVENT_INIT_IMAGEVIEW () { return EVENT_INIT_IMAGEVIEW }
    get EVENT_CLOSE_IMAGEVIEW () { return EVENT_CLOSE_IMAGEVIEW }

    // PRIVATE PROPERTIES
    _channelName = null
    _inboundChannel = null
    _outboundChannels = {}
    _localListeners = {}

    // CONSTRUCTOR
    constructor(params) {
      if (!params['channelName'])         throw 'Cannot initialise EventChannel - Missing required param: channelName'
      if (!params['inboundChannel'])      throw 'Cannot initialise EventChannel - Missing required param: inboundChannel'
      if (!params['outboundChannelName']) throw 'Cannot initialise EventChannel - Missing required param: outboundChannelName'
      if (!params['outboundChannel'])     throw 'Cannot initialise EventChannel - Missing required param: outboundChannel'

      this._channelName = params['channelName']
      this._inboundChannel = params['inboundChannel']
      this._outboundChannels[params['outboundChannelName']] = params['outboundChannel']

      this.handleCoreEvents()
      logger.log('Successfully Initialised event channel: ' + this.channelName);
    }

    // FUNCTIONS
    send(eventName, eventData, localEvent = false) {
      try {
        if (localEvent) {
          try {
            this._localListeners[eventName].forEach(function(handler) {
              handler(eventName, eventData)
            })
          } catch (err) {
            logger.warning('EventChannel: ' + this._channelName + ' has no local listeners for local event: ' + eventName)
          }
        } else {
          //send event to all outbound channels
          var outboundChannelKeys = Object.keys(this._outboundChannels)
          for (var i=0; i < outboundChannelKeys.length; i++) {
            logger.log('Sending ' + eventName + ' to ' + outboundChannelKeys[i])
            var outboundChannel = this._outboundChannels[outboundChannelKeys[i]]
            outboundChannel.send(eventName, eventData)
          }
        }
        logger.logEventTriggered(eventName, eventData)
      } catch (err) {
        logger.error(err);
      }
    }

    on(eventName, handler, localEvent = false) {
      var eventHandler = function(event, eventData) {
        try {
          logger.logEventReceived(eventName, eventData)
            handler(event, eventData)
        } catch (err) {
          logger.error(err);
        }
      }

      if (localEvent) {
        // register handler for local event
        var listeners = this._localListeners[eventName]
          if (listeners == null) listeners = []
            listeners.push(eventHandler)
              this._localListeners[eventName] = listeners
      } else {
        // register non local event
        this._inboundChannel.on(eventName, eventHandler)
      }
    }

    addOutboundChannel(outboundChannelName, outboundChannel) {
      logger.log('Adding outbound channel: ' + outboundChannelName + ' to channel: ' + this._channelName)
      this._outboundChannels[outboundChannelName] = outboundChannel
    }

    removeOutboundChannel(outboundChannelName) {
      logger.log('Removing outbound channel: ' + outboundChannelName + ' from channel: ' + this._channelName)
      delete this._outboundChannels[outboundChannelName]
    }

    handleCoreEvents() {
      logger.log('Setting up core handlers')
      this.on(EVENT_CLOSE_MAIN_WINDOW, function (event, eventData) {
        logger.log('Closing main window')

        // Remove listeners on this end of the channel
        this.removeAllListeners()

        // Send quit event to listeners on the other end of the channel
        this.send(EVENT_CLOSE_MAIN_WINDOW, {})
      })
    }

    removeAllListeners() {
      logger.log('Disabling listeners for channel: ' + this.channelName)
      this._inboundChannel.removeAllListeners()
    }

    get channelName() {
      return this._channelName
    }
  }
}

