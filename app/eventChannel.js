var logger = require("./logger")

const EVENT_INIT_GALLERY =            'init-gallery'
const EVENT_GALLERY_LOADED =          'gallery-loaded'
const EVENT_SAVE_PREFERENCES =        'save-preferences'
const EVENT_PREFERENCES_SAVED =       'preferences-saved'
const EVENT_EDIT_PREFERENCES =        'edit-preferences'
const EVENT_SELECT_GALLERY_IMAGES =   'select-gallery-images'
const EVENT_GALLERY_IMAGES_SELECTED = 'gallery-images-selected'
const EVENT_QUIT_APPLICATION =        'quit-application'
const EVENT_MENU_ITEM_SELECTED =      'event-menu-item-selected'
const EVENT_PLAYPAUSE_EXHIBITION =    'playpause-exhibition'
const EVENT_PAUSE_EXHIBITION =        'pause-exhibition'

module.exports = function(channelName, inboundChannel, outboundChannel) {
  init(channelName, inboundChannel, outboundChannel)

  var module = {

    // CONSTANTS
    EVENT_INIT_GALLERY:            EVENT_INIT_GALLERY,
    EVENT_GALLERY_LOADED:          EVENT_GALLERY_LOADED,
    EVENT_SAVE_PREFERENCES:        EVENT_SAVE_PREFERENCES,
    EVENT_PREFERENCES_SAVED:       EVENT_PREFERENCES_SAVED,
    EVENT_EDIT_PREFERENCES:        EVENT_EDIT_PREFERENCES,
    EVENT_SELECT_GALLERY_IMAGES:   EVENT_SELECT_GALLERY_IMAGES,
    EVENT_GALLERY_IMAGES_SELECTED: EVENT_GALLERY_IMAGES_SELECTED,
    EVENT_QUIT_APPLICATION:        EVENT_QUIT_APPLICATION,
    EVENT_MENU_ITEM_SELECTED:      EVENT_MENU_ITEM_SELECTED,
    EVENT_PLAYPAUSE_EXHIBITION:    EVENT_PLAYPAUSE_EXHIBITION,
    EVENT_PAUSE_EXHIBITION:        EVENT_PAUSE_EXHIBITION,

    // FUNCTIONS
    channelName: function() {
      return channelName
    },

    send: function(eventName, eventData) {
      sendEvent(eventName, eventData)
    },

    on: function(eventName, handler) {
      on(eventName, handler)
    }

  }

  return module;
}

let channelName
let inboundChannel
let outboundChannel

function init(_channelName, _inboundChannel, _outboundChannel) {
  channelName = _channelName
  inboundChannel = _inboundChannel
  outboundChannel = _outboundChannel

  logger.log('Successfully Initialised event channel: ' + channelName);
}

function sendEvent(eventName, eventData) {
  outboundChannel.send(eventName, eventData)
  logger.logEventTriggered(eventName, eventData)
}

function on(eventName, handler) {
  inboundChannel.on(eventName, handler)
}

