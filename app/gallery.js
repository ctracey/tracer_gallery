var logger = require("./logger")

module.exports = function(mainEventChannel) {
  init(mainEventChannel)

    var module = {

      handleEvents: function(mainIpc) {
        handleEvents(mainIpc)
      },

      startGallery: function(ipc, numColumns) {
        startGallery(ipc, numColumns)
      },

      savePreferences: function(ipc, galleryPreferences) {
        savePreferences(ipc, galleryPreferences)
      },

    }

  return module;
}

let eventChannel

function init(mainEventChannel) {
  eventChannel = mainEventChannel
}

function handleEvents(ipc) {
  ipc.on(EVENTS.EVENT_GALLERY_IMAGES_SELECTED, function (event, eventData) {
    logger.logEventReceived(EVENTS.EVENT_GALLERY_IMAGES_SELECTED, eventData)

    var galleryPath = eventData['galleryFolder'];
    logger.log('galleryPath:' + galleryPath);

    hideSettingsControls()
    var galleryId = eventData['containerId']
    displayImages(galleryId, eventData, galleryPath)
    refreshGallery(ipc, galleryId)
  })

  ipc.on(EVENTS.EVENT_INIT_GALLERY, function (event, eventData) {
    logger.logEventReceived(EVENTS.EVENT_INIT_GALLERY, eventData)

    $('#gallery-folder').val(eventData['defaultFolder']);
    $('#refresh-interval').val(eventData['refreshInterval']);
    $('#num-columns').val(eventData['numColumns']);

    startGallery(ipc, eventData['numColumns'])
  })

  ipc.on(EVENTS.EVENT_EDIT_PREFERENCES, function (event, eventData) {
    logger.logEventReceived(EVENTS.EVENT_EDIT_PREFERENCES, eventData)
    showSettingsControls()
  })
}

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

function savePreferences(ipc, galleryPreferences) {
  eventChannel.send(EVENTS.EVENT_SAVE_PREFERENCES, {
    'galleryPreferences': galleryPreferences
  })
}

function setupColumns(numColumns) {
  logger.log('Setting gallery columns to:' + numColumns)

  var galleryWidth = 100 / numColumns
  logger.log('galleryWidth: ' + galleryWidth)

  $('#galleries-container').empty()
  for (var i=0; i < numColumns; i++) {
    logger.log('add gallery container')
    $('#galleries-container').append("<div id='gallery_container_" + i + "' class='gallery-column' style='width:" + galleryWidth + "%;'></div>")
  }
}

function selectGalleryImages(ipc, containerId, galleryFolder) {
  eventChannel.send(EVENTS.EVENT_SELECT_GALLERY_IMAGES, {
    'containerId': containerId,
    'galleryFolder': galleryFolder
  })
}

function displayImages(containerId, eventData, galleryPath) {
  //display new images
  logger.log('display images in ' + containerId)
  $('#' + containerId).empty();
  for (var i=0; i<eventData['imageFilenames'].length; i++) {
    var imageFilename = eventData['imageFilenames'][i];
    imagePath = galleryPath + '/' + imageFilename;
    logger.log('imagePath:' + imagePath);
    $('#' + containerId).append(imageHTML(imagePath));
  }
}

function imageHTML(imagePath) {
  return "<div class='gallery-image'><img style='width:100%' src='" + imagePath + "'/></div>"
}

function hideSettingsControls() {
  logger.log('hiding settings')
  playGallery()
  $('#settings-container').hide()
}

function showSettingsControls() {
  logger.log('hiding settings')
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
        eventChannel.send(EVENTS.EVENT_SELECT_GALLERY_IMAGES, {
          'containerId': galleryId,
          'galleryFolder': galleryFolder()
        })
      }
      logger.logEventTriggered(EVENTS.EVENT_SELECT_GALLERY_IMAGES)
    }, refreshInterval() * 1000) //convert galleryPreferences as seconds to milliseconds
}

