const EVENT_INIT_GALLERY = 'init-gallery'
const EVENT_GALLERY_LOADED = 'gallery-loaded'
const EVENT_SAVE_PREFERENCES = 'save-preferences'
const EVENT_EDIT_PREFERENCES = 'edit-preferences'
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
  var galleryPaused = false

  const exhibitButton = document.getElementById('exhibitButton')
  exhibitButton.addEventListener('click', function () {
    savePreferences(ipc, currentPreferences());
    startGallery(ipc, currentPreferences()['numColumns'])
  })

  ipc.on(EVENT_GALLERY_IMAGES_SELECTED, function (event, eventData) {
    logEventReceived(EVENT_GALLERY_IMAGES_SELECTED, eventData)

    var galleryPath = eventData['galleryFolder'];
    log('galleryPath:' + galleryPath);

    hideSettingsControls()
    var galleryId = eventData['containerId']
    displayImages(galleryId, eventData, galleryPath)
    refreshGallery(ipc, galleryId)
  })

  ipc.on(EVENT_INIT_GALLERY, function (event, eventData) {
    logEventReceived(EVENT_INIT_GALLERY, eventData)

    $('#gallery-folder').val(eventData['defaultFolder']);
    $('#refresh-period').val(eventData['refreshPeriod']);
    $('#num-columns').val(eventData['numColumns']);

    startGallery(ipc, eventData['numColumns'])
  })

  ipc.on(EVENT_EDIT_PREFERENCES, function (event, eventData) {
    logEventReceived(EVENT_EDIT_PREFERENCES, eventData)
    showSettingsControls()
  })
})

function startGallery(ipc, numColumns) {
  setupColumns(numColumns);
  loadGalleryImages(ipc)
}

function loadGalleryImages(ipc) {
  var columns = $('.gallery-column')
  for (var i=0; i < columns.length; i++) {
    selectGalleryImages(ipc, columns[i].id, galleryFolder())
  }
}

function savePreferences(ipc, currentPreferences) {
  ipc.send(EVENT_SAVE_PREFERENCES, {
    'currentPreferences': currentPreferences
  })
  logEventTriggered(EVENT_SAVE_PREFERENCES)
}

function setupColumns(numColumns) {
  log('Setting gallery columns to:' + numColumns)

  var galleryWidth = 100 / numColumns
  log('galleryWidth: ' + galleryWidth)

  $('#galleries-container').empty()
  for (var i=0; i < numColumns; i++) {
    log('add gallery container')
    $('#galleries-container').append("<div id='gallery_container_" + i + "' class='gallery-column' style='width:" + galleryWidth + "%;'></div>")
  }
}

function selectGalleryImages(ipc, containerId, galleryFolder) {
  ipc.send(EVENT_SELECT_GALLERY_IMAGES, {
    'containerId': containerId,
    'galleryFolder': galleryFolder
  })
  logEventTriggered(EVENT_SELECT_GALLERY_IMAGES)
}

function displayImages(containerId, eventData, galleryPath) {
  //display new images
  log('display images in ' + containerId)
  $('#' + containerId).empty();
  for (var i=0; i<eventData['imageFilenames'].length; i++) {
    var imageFilename = eventData['imageFilenames'][i];
    imagePath = galleryPath + '/' + imageFilename;
    log('imagePath:' + imagePath);
    $('#' + containerId).append(imageHTML(imagePath));
  }
}

function imageHTML(imagePath) {
  return "<div class='gallery-image'><img style='width:100%' src='" + imagePath + "'/></div>"
}

function hideSettingsControls() {
  log('hiding settings')
  playGallery()
  $('#settings-container').hide()
}

function showSettingsControls() {
  log('hiding settings')
  pauseGallery()
  $('#settings-container').show()
}

function pauseGallery() {
  galleryPaused = true
}

function playGallery() {
  galleryPaused = false
}

function refreshGallery(ipc, galleryId) {
    setTimeout(function(){
      if (!galleryPaused) {
        ipc.send(EVENT_SELECT_GALLERY_IMAGES, {
          'containerId': galleryId,
          'galleryFolder': galleryFolder()
        })
      }
      logEventTriggered(EVENT_SELECT_GALLERY_IMAGES)
    }, refreshPeriod());
}

function currentPreferences() {
  var preferences = {
    'galleryFolder': galleryFolder(),
    'refreshPeriod': refreshPeriod(),
    'numColumns': numColumns()
  }

  return preferences
}

function galleryFolder() {
  return $('#gallery-folder').val();
}

function refreshPeriod() {
  return $('#refresh-period').val();
}

function numColumns() {
  return $('#num-columns').val();
}

function logEventReceived(eventName, eventData) {
  log('<br/>EVENT: ' + eventName);
  log('&#9;eventData: ' + JSON.stringify(eventData))
}

function logEventTriggered(eventName) {
    log('TRIGGERED EVENT: ' + eventName);
}

function log(message) {
  $('#logs').append('<br/>' + message);
}
