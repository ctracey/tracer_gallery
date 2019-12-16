var logger = {

  log: function (message) {
    log(message)
  },

  debug: function (message) {
    debug(message)
  },

  logEventReceived: function (eventName, eventData) {
    logEventReceived(eventName, eventData)
  },

  logEventTriggered: function (eventName) {
    logEventTriggered(eventName)
  },

}
module.exports = logger

function log(message) {
  console.log(message)
}

function debug(message) {
  log("DEBUG: " + message)
}

function logEventTriggered (eventName) {
    log('TRIGGERED EVENT: ' + eventName);
}

function logEventReceived(eventName, eventData) {
  log('\nEVENT: ' + eventName);
  log('\teventData: ' + JSON.stringify(eventData))
}
