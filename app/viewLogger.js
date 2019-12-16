var logger = require("./logger")

logger.log = function (message) {
  $('#logs').append('<br/>' + message);
}

var viewLogger = {

  log: function (message) {
    logger.log(message)
  },

  debug: function (message) {
    logger.debug(message)
  },

  logEventReceived: function (eventName, eventData) {
    logger.logEventReceived(eventName, eventData)
  },

  logEventTriggered: function (eventName) {
    logger.logEventTriggered(eventName)
  },

}
module.exports = viewLogger
