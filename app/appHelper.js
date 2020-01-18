var logger = require("./logger")

module.exports = function(app, eventChannel) {
  init(app, eventChannel)

  var module = {
    app: function() {
      return _app
    },

    eventChannel: function() {
      return _eventChannel
    },

    quit: function() {
      quit()
    },
  }

  return module;
}

let _app
let _eventChannel

function init(app, eventChannel) {
  _app = app
  _eventChannel = eventChannel
}

function quit() {
  logger.log('QUITTING')
  _eventChannel.send(_eventChannel.EVENT_PAUSE_EXHIBITION, {})
  _eventChannel.send(_eventChannel.EVENT_QUIT_APPLICATION, {})
  _app.quit()
}

