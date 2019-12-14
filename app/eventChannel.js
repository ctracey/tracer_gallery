var logger = require("./logger")

const EVENT_INIT_GALLERY = 'init-gallery'
const EVENT_GALLERY_LOADED = 'gallery-loaded'
const EVENT_SAVE_PREFERENCES = 'save-preferences'
const EVENT_EDIT_PREFERENCES = 'edit-preferences'
const EVENT_SELECT_GALLERY_IMAGES = 'select-gallery-images'
const EVENT_GALLERY_IMAGES_SELECTED = 'gallery-images-selected'
const EVENT_QUIT_APPLICATION = 'quit-application'

module.exports = function(mainEventChannel) {
  init(mainEventChannel)

  var module = {

    EVENT_INIT_GALLERY:            EVENT_INIT_GALLERY,
    EVENT_GALLERY_LOADED:          EVENT_GALLERY_LOADED,
    EVENT_SAVE_PREFERENCES:        EVENT_SAVE_PREFERENCES,
    EVENT_EDIT_PREFERENCES:        EVENT_EDIT_PREFERENCES,
    EVENT_SELECT_GALLERY_IMAGES:   EVENT_SELECT_GALLERY_IMAGES,
    EVENT_GALLERY_IMAGES_SELECTED: EVENT_GALLERY_IMAGES_SELECTED,
    EVENT_QUIT_APPLICATION:        EVENT_QUIT_APPLICATION,

    send: function(eventName, eventData) {
      sendEvent(eventName, eventData)
    }

    //TODO: #on listener object - ipc?
  }

  return module;
}

let eventChannel

function init(mainEventChannel) {
  eventChannel = mainEventChannel
}

function sendEvent(eventName, eventData) {
  eventChannel.send(eventName, eventData)
  logger.logEventTriggered(eventName)
}
