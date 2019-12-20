var logger = require("./app/logger")

let eventChannel

// Run this function after the page has loaded
$(() => {
  logger.log('Loading gallery ...')
  try {
    var galleryPaused = false
    eventChannel = initEventChannel()

    var gallery = require("./app/gallery")(eventChannel)
    gallery.handleEvents()

    handleActions(gallery)
  
    logger.log('Gallery loaded');
    eventChannel.send(eventChannel.EVENT_GALLERY_LOADED, {})
  } catch (err) {
    logger.log('ERROR: ' + err);
  }
})

function handleActions(gallery) {
  const exhibitButton = document.getElementById('exhibitButton')
  exhibitButton.addEventListener('click', function () {
    gallery.savePreferencesAction();
  })
}

function initEventChannel() {
  var ipc = require('electron').ipcRenderer;

  var inboundEventChannel = ipc
  var outboundEventChannel = ipc

  return require("./app/eventChannel")("viewEventChannel", inboundEventChannel, outboundEventChannel)
}

