const EVENT_INIT_GALLERY = 'init-gallery'
const EVENT_GALLERY_LOADED = 'gallery-loaded'
const EVENT_SAVE_PREFERENCES = 'save-preferences'
const EVENT_SELECT_GALLERY_IMAGES = 'select-gallery-images'
const EVENT_GALLERY_IMAGES_SELECTED = 'gallery-images-selected'

// Run this function after the page has loaded
$(() => {
  log('load gallery')

  let ipc
  try {
    ipc = require('electron').ipcRenderer;
    ipc.send(EVENT_GALLERY_LOADED, null)
    logEventTriggered(EVENT_GALLERY_LOADED)
    log('setup ipc');
  } catch (err) {
    log('ERROR: ' + err);
  }

  log('gallery loaded');

  const updateButton = document.getElementById('updateButton')
  updateButton.addEventListener('click', function () {
    ipc.send(EVENT_SAVE_PREFERENCES, {
      'currentPreferences': currentPreferences()
    })
    logEventTriggered(EVENT_SAVE_PREFERENCES)

    ipc.send(EVENT_SELECT_GALLERY_IMAGES, {
      'galleryFolder': galleryFolder()
    })
    logEventTriggered(EVENT_SELECT_GALLERY_IMAGES)
  })

  ipc.on(EVENT_GALLERY_IMAGES_SELECTED, function (event, eventData) {
    logEventReceived(EVENT_GALLERY_IMAGES_SELECTED, eventData)

    var galleryPath = eventData['galleryFolder'];
    log('galleryPath:' + galleryPath);

    hideSettingsControls()

    //display new images
    $('#gallery_container').empty();
    for (var i=0; i<eventData['imageFilenames'].length; i++) {
      var imageFilename = eventData['imageFilenames'][i];
      imagePath = galleryPath + '/' + imageFilename;
      log('imagePath:' + imagePath);
      $('#gallery_container').append("<img style='width:100%' src='" + imagePath + "'/>");
    }

    refreshGallery(ipc)
  })

  ipc.on(EVENT_INIT_GALLERY, function (event, eventData) {
    logEventReceived(EVENT_INIT_GALLERY, eventData)

    $('#gallery-folder').val(eventData['defaultFolder']);
    $('#refresh-period').val(eventData['refreshPeriod']);
  })
})

function hideSettingsControls() {
  log('hiding settings')
  $('#settings-container').hide()
}

function refreshGallery(ipc) {
    setTimeout(function(){
      ipc.send(EVENT_SELECT_GALLERY_IMAGES, {
        'galleryFolder': galleryFolder()
      })
      logEventTriggered(EVENT_SELECT_GALLERY_IMAGES)
    }, refreshPeriod());
}

function currentPreferences() {
  var preferences = {
    'galleryFolder': galleryFolder(),
    'refreshPeriod': refreshPeriod()
  }

  return preferences
}

function galleryFolder() {
  return $('#gallery-folder').val();
}

function refreshPeriod() {
  return $('#refresh-period').val();
}

function logEventReceived(eventName, eventData) {
  log('<br/>EVENT: ' + eventName);
  log('eventData: ' + eventData);
}

function logEventTriggered(eventName) {
    log('TRIGGERED EVENT: ' + eventName);
}

function log(message) {
  $('#logs').append('<br/>' + message);
}
