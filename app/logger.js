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

  logEventTriggered: function (eventName, eventData) {
    logEventTriggered(eventName, eventData)
  },

}
module.exports = logger

function log(message) {
  console.log(message)
}

function debug(message) {
  log("DEBUG: " + message)
}

function logEventTriggered (eventName, eventData) {
    log('TRIGGERED EVENT: ' + eventName);
    log('\t' + JSON.stringify(eventData))
}

function logEventReceived(eventName, eventData) {
  log('\nEVENT: ' + eventName);
  log('\teventData: ' + JSON.stringify(eventData))
}
