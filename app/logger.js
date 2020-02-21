const LEVEL_DEBUG = 'DEBUG'
const LEVEL_WARNING = 'WARNING'
const LEVEL_ERROR = 'ERROR'

var logger = {

  log: function (message) {
    log(message)
  },

  debug: function (message) {
    debug(message)
  },

  error: function (message) {
    error(message)
  },

  warning: function (message) {
    warning(message)
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
  logLevel(LEVEL_DEBUG, message)
}

function error(message) {
  logLevel(LEVEL_ERROR, message)
}

//TODO: find other warning level log messages
function warning(message) {
  logLevel(LEVEL_WARNING, message)
}

function logLevel(level, message) {
  log(level + ": " + message)
}

function logEventTriggered (eventName, eventData) {
    log('TRIGGERED EVENT: ' + eventName);
    log('\t' + JSON.stringify(eventData))
}

function logEventReceived(eventName, eventData) {
  log('\nEVENT: ' + eventName);
  log('\teventData: ' + JSON.stringify(eventData))
}
