const EventChannel = require("./app/eventChannel").class
var logger = require("./app/logger")

let _eventChannel

// Run this function after the page has loaded
$(() => {
  logger.log('Loading gallery ...')
  try {
    var galleryPaused = false
    _eventChannel = initEventChannel()

    var gallery = require("./app/gallery")(_eventChannel)
    gallery.handleEvents()

    handleActions(gallery)

    logger.log('Gallery loaded');
    _eventChannel.send(_eventChannel.EVENT_GALLERY_LOADED, {})
  } catch (err) {
    logger.error(err);
  }
})

function handleActions(gallery) {
  const exhibitButton = document.getElementById('exhibitButton')
  exhibitButton.addEventListener('click', function () {
    gallery.savePreferencesAction();
  })

  const cancelButton = document.getElementById('cancelButton')
  cancelButton.addEventListener('click', function () {
    gallery.cancelPreferencesAction();
  })

  const folderPickerButton = document.getElementById('settings-container__folder-picker')
  folderPickerButton.addEventListener('click', function () {
    gallery.pickPreferencesFolderAction()
  })

  $(document).on('keydown', function(event) {
    if ( (event.key == "Escape") && ($('#settings-container').is(':visible')) ) {
      gallery.cancelPreferencesAction();
    }
  })

  $('#settings-container').on('keydown', function(event) {
    if ( (event.key == "Enter") && ($('#settings-container').is(':visible')) ) {
      gallery.savePreferencesAction();
    }
  })
}

function initEventChannel() {
  var ipc = require('electron').ipcRenderer;

  return new EventChannel({
    'channelName'         : "viewEventChannel",
    'inboundChannel'      : ipc,
    'outboundChannelName' : "mainProcessChannel",
    'outboundChannel'     : ipc
  })
}

