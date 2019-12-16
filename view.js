var logger = require("./app/logger")

// Run this function after the page has loaded

let eventChannel

$(() => {
  logger.log('load gallery')

  try {
    eventChannel = initEventChannel()
    eventChannel.send(eventChannel.EVENT_GALLERY_LOADED, null)
  } catch (err) {
    logger.log('ERROR: ' + err);
  }

  logger.log('gallery loaded');
  var galleryPaused = false

  var gallery = require("./app/gallery")(eventChannel)
  gallery.handleEvents()

  const exhibitButton = document.getElementById('exhibitButton')
  exhibitButton.addEventListener('click', function () {
    gallery.savePreferences();
    gallery.startGallery(gallery.galleryPreferences()['numColumns'])
  })
})

function initEventChannel() {
  var ipc = require('electron').ipcRenderer;

  var inboundEventChannel = ipc
  var outboundEventChannel = ipc

  return require("./app/eventChannel")("viewEventChannel", inboundEventChannel, outboundEventChannel)
}

