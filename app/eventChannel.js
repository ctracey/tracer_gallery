var logger = require("./logger")

const EVENT_INIT_GALLERY =            'init-gallery'
const EVENT_QUIT_APPLICATION =        'quit-application'
const EVENT_GALLERY_LOADED =          'gallery-loaded'
const EVENT_SAVE_PREFERENCES =        'save-preferences'
const EVENT_PREFERENCES_SAVED =       'preferences-saved'
const EVENT_EDIT_PREFERENCES =        'edit-preferences'
const EVENT_SELECT_GALLERY_IMAGES =   'select-gallery-images'
const EVENT_GALLERY_IMAGES_SELECTED = 'gallery-images-selected'
const EVENT_MENU_ITEM_SELECTED =      'event-menu-item-selected'
const EVENT_PLAYPAUSE_EXHIBITION =    'playpause-exhibition'
const EVENT_PAUSE_EXHIBITION =        'pause-exhibition'

module.exports = function(channelName, inboundChannel, outboundChannel) {
  init(channelName, inboundChannel, outboundChannel)

  var module = {

    // CONSTANTS
    EVENT_INIT_GALLERY:            EVENT_INIT_GALLERY,
    EVENT_QUIT_APPLICATION:        EVENT_QUIT_APPLICATION,
    EVENT_GALLERY_LOADED:          EVENT_GALLERY_LOADED,
    EVENT_SAVE_PREFERENCES:        EVENT_SAVE_PREFERENCES,
    EVENT_PREFERENCES_SAVED:       EVENT_PREFERENCES_SAVED,
    EVENT_EDIT_PREFERENCES:        EVENT_EDIT_PREFERENCES,
    EVENT_SELECT_GALLERY_IMAGES:   EVENT_SELECT_GALLERY_IMAGES,
    EVENT_GALLERY_IMAGES_SELECTED: EVENT_GALLERY_IMAGES_SELECTED,
    EVENT_MENU_ITEM_SELECTED:      EVENT_MENU_ITEM_SELECTED,
    EVENT_PLAYPAUSE_EXHIBITION:    EVENT_PLAYPAUSE_EXHIBITION,
    EVENT_PAUSE_EXHIBITION:        EVENT_PAUSE_EXHIBITION,

    // FUNCTIONS
    channelName: function() {
      return _channelName
    },

    send: function(eventName, eventData) {
      send(eventName, eventData)
    },

    on: function(eventName, handler) {
      on(eventName, handler)
    }

  }

  return module;
}

let _channelName
let _inboundChannel
let _outboundChannel

function init(channelName, inboundChannel, outboundChannel) {
  _channelName = channelName
  _inboundChannel = inboundChannel
  _outboundChannel = outboundChannel

  handleCoreEvents()

  logger.log('Successfully Initialised event channel: ' + _channelName);
}

function send(eventName, eventData) {
  _outboundChannel.send(eventName, eventData)
  logger.logEventTriggered(eventName, eventData)
}

function on(eventName, handler) {
  _inboundChannel.on(eventName, function (event, eventData) {
    try {
      logger.logEventReceived(eventName, eventData)
        handler(event, eventData)
    } catch (err) {
      logger.error(err);
    }
  })
}

function handleCoreEvents() {
  logger.log('Setting up core handlers')

  on(EVENT_QUIT_APPLICATION, function (event, eventData) {
    // Remove listeners on this end of the channel
    removeAllListeners()

    // Send quit event to listeners on the other end of the channel
    send(EVENT_QUIT_APPLICATION, {})
  })
}

function removeAllListeners() {
  logger.log('Disabling listeners for channel: ' + _channelName)
  _inboundChannel.removeAllListeners()
}

