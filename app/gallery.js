const logger = require("./logger")
const Preferences = require("./preferences").class

const GALLERY_TITLE = 'tracer gallery'

module.exports = function(eventChannel) {
  init(eventChannel)

    var module = {

      handleEvents: function() {
        handleEvents()
      },

      savePreferencesAction: function() {
        savePreferencesAction()
      },

      cancelPreferencesAction: function() {
        cancelPreferencesAction()
      },

      pickPreferencesFolderAction: function() {
        pickPreferencesFolderAction()
      },

    }

  return module;
}

let _eventChannel
let _galleryPreferences
let _galleryPaused

function init(eventChannel) {
  _eventChannel = eventChannel
  _galleryPaused = false
}

function handleEvents() {
  _eventChannel.on(_eventChannel.EVENT_INIT_GALLERY, function (event, eventData) {
    handleInitGallery(event, eventData)
  })

  _eventChannel.on(_eventChannel.EVENT_GALLERY_IMAGES_SELECTED, function (event, eventData) {
    handleGalleryImagesSelected(event, eventData)
  })

  _eventChannel.on(_eventChannel.EVENT_EDIT_PREFERENCES, function (event, eventData) {
    handleEditPreferencesEvent(event, eventData)
  })

  _eventChannel.on(_eventChannel.EVENT_PREFERENCES_FOLDER_PICKED, function (event, eventData) {
    handlePreferencesFolderPickedEvent(event, eventData)
  })

  _eventChannel.on(_eventChannel.EVENT_PREFERENCES_SAVED, function (event, eventData) {
    handlePreferencesSavedEvent(event, eventData)
  })

  _eventChannel.on(_eventChannel.EVENT_PLAYPAUSE_EXHIBITION, function (event, eventData) {
    handlePlayPauseEvent(event, eventData)
  })

  _eventChannel.on(_eventChannel.EVENT_PAUSE_EXHIBITION, function (event, eventData) {
    pauseGallery()
  })
}

function handleInitGallery(event, eventData) {
  galleryTitle(GALLERY_TITLE)

  _galleryPreferences = new Preferences(eventData['preferences'])
  startGallery()
}

function handleGalleryImagesSelected(event, eventData) {
  var eventPreferences = new Preferences(eventData['preferences'])
  logger.log('galleryPath:' + eventPreferences.galleryFolder);

  var galleryId = eventData['containerId']
  displayImages(galleryId, eventData['imageFilenames'], eventPreferences.galleryFolder)

  refreshGallery(galleryId)
}

function handleEditPreferencesEvent(event, eventData) {
  showSettingsControls()
}

function handlePreferencesFolderPickedEvent(event, eventData) {
  var folderPath = eventData['folderPath']
  logger.debug('folder picked: ' + folderPath)
  updateGalleryFolder(folderPath)
}

function handlePreferencesSavedEvent(event, eventData) {
  var preferencesValid = eventData['preferencesSaved']
  if (preferencesValid) {
    _galleryPreferences = new Preferences(eventData['preferences'])
    hideSettingsControls()
    startGallery()
  } else {
    alert('ERROR: Invalid preferences\n\n' + eventData['errorMessage'])
  }
}

function handlePlayPauseEvent(event, eventData) {
  _galleryPaused ?  startGallery() : pauseGallery()
}

function savePreferencesAction() {
  logger.log('ACTION: gallery#savePreferencesAction')
  savePreferences()
}

function cancelPreferencesAction() {
  logger.log('ACTION: gallery#cancelPreferencesAction')
  hideSettingsControls()
  startGallery()
}

function pickPreferencesFolderAction() {
  _eventChannel.send(_eventChannel.EVENT_PICK_PREFERENCES_FOLDER, {})
  logger.debug('PICKING dir')
}

function startGallery() {
  logger.log('Start gallery')
  playGallery()
  setupColumns(_galleryPreferences.numColumns);
  loadGalleryImages()
}

function loadGalleryImages() {
  var columns = $('.gallery-column')
  for (var i=0; i < columns.length; i++) {
    selectGalleryImages(columns[i].id)
  }
}

function setupColumns(numColumns) {
  logger.log('Setting gallery columns to:' + numColumns)

  var galleryWidth = 100 / numColumns
  logger.log('galleryWidth: ' + galleryWidth)

  $('#galleries-container').empty()

  var timestamp = Date.now()
  for (var i=0; i < numColumns; i++) {
    logger.log('add gallery container')
    $('#galleries-container').append("<div id='" + galleryContainerId(timestamp, i) + "' class='gallery-column' style='width:" + galleryWidth + "%;'></div>")
  }
}

function selectGalleryImages(containerId) {
  _eventChannel.send(_eventChannel.EVENT_SELECT_GALLERY_IMAGES, {
    'containerId': containerId,
    'preferences': _galleryPreferences.toJSON()
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
    var imageId = 'img-' + containerId + '-' + i
    $('#' + containerId).append(imageHTML(imageId, imagePath));

    var galleryImage = document.getElementById(imageId)
    galleryImage.addEventListener('click', function (event) {
      var imagePath = event.target.src
      logger.log('clicked image:' + event.target.id)
      viewImage(imagePath)
    })
  }
}

function refreshGallery(galleryId) {
  if (galleryExists(galleryId)) {
    setTimeout(function(){
      logger.log('Refreshing gallery: ' + galleryId + ' [galleryPaused: ' + _galleryPaused + ']')
      if (!_galleryPaused) {
        selectGalleryImages(galleryId)
      }
    }, _galleryPreferences.refreshInterval * 1000) //convert preference as seconds to milliseconds
  }
}

function savePreferences() {
  var newPreferences = new Preferences({
    'galleryFolder': galleryFolder(),
    'refreshInterval': refreshInterval(),
    'numColumns': numColumns()
  })

  _eventChannel.send(_eventChannel.EVENT_SAVE_PREFERENCES, {
    'preferences': newPreferences.toJSON()
  })
}

function showSettingsControls() {
  logger.log('show settings')
  pauseGallery()

  $('#preferences__gallery-folder').val(_galleryPreferences.galleryFolder);
  $('#refresh-interval').val(_galleryPreferences.refreshInterval);
  $('#num-columns').val(_galleryPreferences.numColumns);

  $('#settings-container').show()
}

function viewImage(imagePath) {
  _eventChannel.send(_eventChannel.EVENT_VIEW_IMAGE, {
    'imagePath': imagePath
  })
}

function hideSettingsControls() {
  logger.log('hiding settings')
  playGallery()
  $('#settings-container').hide()
}

function pauseGallery() {
  _galleryPaused = true
  galleryTitle(GALLERY_TITLE + ' (paused)')
}

function playGallery() {
  _galleryPaused = false
  galleryTitle(GALLERY_TITLE)
}

function galleryContainerId(timestamp, identifier) {
  return 'gallery_container_' + timestamp + '-' + identifier
}

function galleryExists(galleryId) {
  return $('#' + galleryId).length
}

function imageHTML(id, imagePath) {
  return "<div class='gallery-image'><img id='" + id + "' src='" + imagePath + "'/></div>"
}

function galleryFolder() {
  return $('#preferences__gallery-folder').val();
}

function updateGalleryFolder(path) {
  $('#preferences__gallery-folder').val(path);
}

function refreshInterval() {
  return $('#refresh-interval').val()
}

function numColumns() {
  return $('#num-columns').val();
}

function galleryTitle(title) {
  $('#gallery-title').html(title)
}

