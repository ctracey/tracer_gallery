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

      savePreferencesAction: function() {
        savePreferencesAction()
      },

    }

  return module;
}

let eventChannel
let galleryPreferences
let galleryPaused

function init(_eventChannel) {
  eventChannel = _eventChannel
  galleryPaused = false
}

function handleEvents() {
  eventChannel.on(eventChannel.EVENT_INIT_GALLERY, function (event, eventData) {
    logger.logEventReceived(eventChannel.EVENT_INIT_GALLERY, eventData)
    handleInitGallery(event, eventData)
  })

  eventChannel.on(eventChannel.EVENT_GALLERY_IMAGES_SELECTED, function (event, eventData) {
    logger.logEventReceived(eventChannel.EVENT_GALLERY_IMAGES_SELECTED, eventData)
    handleGalleryImagesSelected(event, eventData)
  })

  eventChannel.on(eventChannel.EVENT_EDIT_PREFERENCES, function (event, eventData) {
    logger.logEventReceived(eventChannel.EVENT_EDIT_PREFERENCES, eventData)
    handleEditPreferencesEvent(event, eventData)
  })
}

function handleInitGallery(event, eventData) {
  galleryPreferences = loadPreferencesFromJSON(eventData['preferences'])
  startGallery(galleryPreferences.numColumns())
}

function handleGalleryImagesSelected(event, eventData) {
  var eventPreferences = loadPreferencesFromJSON(eventData['preferences'])
  logger.log('galleryPath:' + eventPreferences.galleryFolder());

  var galleryId = eventData['containerId']
  displayImages(galleryId, eventData['imageFilenames'], eventPreferences.galleryFolder())

  refreshGallery(galleryId)
}

function handleEditPreferencesEvent(event, eventData) {
  showSettingsControls()
}

function savePreferencesAction() {
  // NOTE: After this action a new gallery will be initialised through form submition
  logger.log('ACTION: gallery#savePreferencesAction')
  savePreferences()
}

function startGallery(numColumns) {
  setupColumns(numColumns);
  loadGalleryImages()
}

function loadGalleryImages() {
  var columns = $('.gallery-column')
  for (var i=0; i < columns.length; i++) {
    selectGalleryImages(columns[i].id)
  }
}

function savePreferences() {
  galleryPreferences = require("./preferences")({
    'galleryFolder': galleryFolder(),
    'refreshInterval': refreshInterval(),
    'numColumns': numColumns()
  })
  eventChannel.send(eventChannel.EVENT_SAVE_PREFERENCES, {
    'preferences': galleryPreferences.toJSON()
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

function selectGalleryImages(containerId) {
  eventChannel.send(eventChannel.EVENT_SELECT_GALLERY_IMAGES, {
    'containerId': containerId,
    'preferences': galleryPreferences.toJSON()
  })
}

function displayImages(containerId, imageFilenames, galleryPath) {
  //display new images
  logger.log('display images in ' + containerId)
  $('#' + containerId).empty();
  for (var i=0; i<imageFilenames.length; i++) {
    var imageFilename = imageFilenames[i];
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
  logger.log('show settings')
  //pauseGallery()

  $('#gallery-folder').val(galleryPreferences.galleryFolder());
  $('#refresh-interval').val(galleryPreferences.refreshInterval());
  $('#num-columns').val(galleryPreferences.numColumns());

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
    logger.log('Refreshing gallery: ' + galleryId + ' [galleryPaused: ' + galleryPaused + ']')
    if (!galleryPaused) {
      selectGalleryImages(galleryId)
    }
  }, galleryPreferences.refreshInterval() * 1000) //convert preference as seconds to milliseconds
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

function loadPreferencesFromJSON(jsonPreferences) {
  return require("./preferences")(jsonPreferences)
}
