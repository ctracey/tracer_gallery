var logger = require("./logger")

module.exports = function(_eventChannel) {
  init(_eventChannel)

    var module = {

      handleEvents: function() {
        handleEvents()
      },

      startGallery: function(numColumns) {
        startGallery(numColumns)
      },

      savePreferences: function() {
        savePreferences()
      },

    }

  return module;
}

let eventChannel

function init(_eventChannel) {
  eventChannel = _eventChannel
}

function handleEvents() {
  eventChannel.on(eventChannel.EVENT_INIT_GALLERY, function (event, eventData) {
    handleInitGallery(event, eventData)
  })

  eventChannel.on(eventChannel.EVENT_GALLERY_IMAGES_SELECTED, function (event, eventData) {
    handleGalleryImagesSelected(event, eventData)
  })

  eventChannel.on(eventChannel.EVENT_EDIT_PREFERENCES, function (event, eventData) {
    handleEditPreferencesEvent(event, eventData)
  })
}

function handleInitGallery(event, eventData) {
  logger.logEventReceived(eventChannel.EVENT_INIT_GALLERY, eventData)

  $('#gallery-folder').val(eventData['defaultFolder']);
  $('#refresh-interval').val(eventData['refreshInterval']);
  $('#num-columns').val(eventData['numColumns']);

  startGallery(eventData['numColumns'])
}

function handleGalleryImagesSelected(event, eventData) {
  logger.logEventReceived(eventChannel.EVENT_GALLERY_IMAGES_SELECTED, eventData)

  var galleryPath = eventData['galleryFolder'];
  logger.log('galleryPath:' + galleryPath);

  hideSettingsControls()
  var galleryId = eventData['containerId']
  displayImages(galleryId, eventData, galleryPath)
  refreshGallery(galleryId)
}

function handleEditPreferencesEvent(event, eventData) {
  logger.logEventReceived(eventChannel.EVENT_EDIT_PREFERENCES, eventData)
  showSettingsControls()
}

function startGallery(numColumns) {
  setupColumns(numColumns);
  loadGalleryImages()
}

function loadGalleryImages() {
  var columns = $('.gallery-column')
  for (var i=0; i < columns.length; i++) {
    selectGalleryImages(columns[i].id, galleryFolder())
  }
}

function savePreferences() {
  eventChannel.send(eventChannel.EVENT_SAVE_PREFERENCES, {
    'galleryPreferences': galleryPreferences()
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

function selectGalleryImages(containerId, galleryFolder) {
  eventChannel.send(eventChannel.EVENT_SELECT_GALLERY_IMAGES, {
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

function refreshGallery(galleryId) {
  setTimeout(function(){
    if (!galleryPaused) {
      eventChannel.send(eventChannel.EVENT_SELECT_GALLERY_IMAGES, {
        'containerId': galleryId,
        'galleryFolder': galleryFolder()
      })
    }
    logger.logEventTriggered(eventChannel.EVENT_SELECT_GALLERY_IMAGES)
  }, refreshInterval() * 1000) //convert galleryPreferences as seconds to milliseconds
}

function galleryPreferences() {
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
