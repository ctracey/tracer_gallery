var logger = require("./app/viewLogger")
const EVENTS = require("./app/events")

// Run this function after the page has loaded
// TODO: refactor with view.js and eventChannel

let ipc

$(() => {
  logger.log('load gallery')

  try {
    ipc = require('electron').ipcRenderer;
    eventChannel().send(EVENTS.EVENT_GALLERY_LOADED, null)
    logger.log('setup ipc');
  } catch (err) {
    logger.log('ERROR: ' + err);
  }

  logger.log('gallery loaded');
  var galleryPaused = false

  var gallery = require("./app/gallery")(eventChannel())
  gallery.handleEvents(ipc)

  const exhibitButton = document.getElementById('exhibitButton')
  exhibitButton.addEventListener('click', function () {
    gallery.savePreferences(ipc, currentPreferences());
    gallery.startGallery(ipc, currentPreferences()['numColumns'])
  })

})

function currentPreferences() {
  var preferences = {
    'galleryFolder': galleryFolder(),
    'refreshInterval': refreshInterval(),
    'numColumns': numColumns()
  }

  return preferences
}

function galleryFolder() {
  return $('#gallery-folder').val();
}

function refreshInterval() {
  return $('#refresh-interval').val()
}

function numColumns() {
  return $('#num-columns').val();
}

function eventChannel() {
  return require("./app/eventChannel")(ipc)
}

