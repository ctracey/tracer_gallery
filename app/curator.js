const fs = require('fs')
const path = require('path')

const Preferences = require("./preferences").class
const MainWindow = require("./mainWindow").class
const logger = require("./logger")

const APP_PREFERENCES_FILE_PATH = '/preferences/preferences.json'

module.exports = function(mainApp, eventChannel) {
  init(mainApp, eventChannel)

  var module = {

    handleEvents: function () {
      handleEvents()
    }

  }

  return module;
}

let _eventChannel
let _appHelper

function init(appHelper) {
  _appHelper = appHelper
  _eventChannel = appHelper.eventChannel
}

function handleEvents() {
  _eventChannel.on(_eventChannel.EVENT_GALLERY_LOADED, function(event, eventData) {
    handleGalleryLoadedEvent(event, eventData)
  })

  _eventChannel.on(_eventChannel.EVENT_SELECT_GALLERY_IMAGES, function(event, eventData) {
    handleSelectGalleryImagesEvent(event, eventData)
  })

  _eventChannel.on(_eventChannel.EVENT_SAVE_PREFERENCES, function(event, eventData) {
    handleSavePreferenceEvent(event, eventData)
  })

  _eventChannel.on(_eventChannel.EVENT_TOGGLE_WINDOW_FRAME, function (event, eventData) {
    handleToggleWindowFrameEvent(event, eventData)
  }, true)
}

function handleToggleWindowFrameEvent(event, eventData) {
  //TODO: investigate maintaining current window size & position
  //TODO: hover show/hide drag handle
  disableOldMainWindow()
  setupNewMainWindow(!_appHelper.mainWindow.framed)
}

function handleGalleryLoadedEvent(event, eventData) {
  var recentPreferences = new Preferences(loadRecentPreferences())
  var initialPreferences

  var galleryFolder = recentPreferences.galleryFolder
  if (recentPreferences.usingDefaults()) {
    logger.log('Using localised default preferences')
    galleryFolder = localisedDefaultFolderPath()
  } else {
    logger.log('Using saved preferences')
  }

  initialPreferences = newPreferences(
    galleryFolder,
    recentPreferences.refreshInterval,
    recentPreferences.numColumns
  )

  logger.log('Initial preferences: ' + JSON.stringify(initialPreferences.toJSON()))

  try {
    _eventChannel.send(_eventChannel.EVENT_INIT_GALLERY, {
      'preferences': initialPreferences.toJSON()
    })
  }
  catch (err) {
    logger.log(err);
  }
}

function handleSelectGalleryImagesEvent(event, eventData) {
  logger.log('selecting images');
  var preferences = new Preferences(eventData['preferences'])
  var containerId = eventData['containerId']

  try {
    fs.readdir(preferences.galleryFolder, function(err, filenames) {
      logger.log('folder images:')
      logger.log(filenames);

      //check if enough images are in folder
      var setSize = filenames.length < preferences.DEFAULT_GALLERY_SET_SIZE ? filenames.length : preferences.DEFAULT_GALLERY_SET_SIZE;
      //select random images from folder
      var selectedImages = selectRandomImages(filenames, setSize)

      _eventChannel.send(_eventChannel.EVENT_GALLERY_IMAGES_SELECTED, {
        'containerId': containerId,
        'imageFilenames': selectedImages,
        'preferences': preferences.toJSON()
      })
    });
  }
  catch (err) {
    logger.log(err);
  }
}

function handleSavePreferenceEvent(event, eventData) {
  var galleryPreferences = new Preferences(eventData['preferences'])
  savePreferences(galleryPreferences)
}

function disableOldMainWindow() {
  _eventChannel.send(_eventChannel.EVENT_CLOSE_MAIN_WINDOW, {})
  _appHelper.mainWindow.close()
}

function setupNewMainWindow(framed) {
  newWindow = new MainWindow({
    'windowFile': 'index.html',
    'framed'    : framed
  })
  _appHelper.mainWindow = newWindow
}

function selectRandomImages(filenames, setSize) {
  var index = 0;
  var selectedImages = []

  var shuffledIndexes = shuffleArray(numberSequence(filenames.length))

  //until required images selected or no more files left to choose from
  while (selectedImages.length < setSize && index < shuffledIndexes.length) {
    //select valid images in shuffled order
    var imageFilename = filenames[shuffledIndexes[index]]
      if (imageFilename.match(/\.(gif|jpg|jpeg|tiff|png|GIF|JPG|JPEG|TIFF|PNG)$/) != null) {
        selectedImages.push(filenames[shuffledIndexes[index]]);
      }
    index++;
  }

  logger.log('selected images:')
  logger.log(selectedImages)

  return selectedImages
}

function numberSequence(length) {
  return Array.from(Array(length).keys())
}

function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array
}

function savePreferences(galleryPreferences) {
  try {
    validatePreferences(galleryPreferences)

    var currentGalleryFolder = galleryPreferences.galleryFolder

    var preferences = {}
    preferences['latestPreferencesKey'] = currentGalleryFolder
    preferences[currentGalleryFolder] = galleryPreferences.toJSON()

    fs.writeFileSync(preferencesFilePath(), JSON.stringify(preferences), 'utf-8');
    logger.log('saved preferences to: ' + _appHelper.app.getAppPath())


    _eventChannel.send(_eventChannel.EVENT_PREFERENCES_SAVED, {
      'preferencesSaved': true,
      'preferences': galleryPreferences.toJSON()
    })
  } catch(error) {
    // Handle validation errors
    logger.log('ERROR: Failed to save preferences: ' + error);
    _eventChannel.send(_eventChannel.EVENT_PREFERENCES_SAVED, {
      'preferencesSaved': false,
      'errorMessage': error,
      'preferences': galleryPreferences.toJSON()
    })
  }
}

function validatePreferences(preferences) {
  if (!folderExists(preferences.galleryFolder)) throw 'Folder does not exist: "' + preferences.galleryFolder + '"'
}

function loadRecentPreferences() {
  var recentPreferences = {}

  try {
    var data = fs.readFileSync(preferencesFilePath());
    if (data != null) {
      logger.log("Synchronous read: " + data.toString());
      var preferences = JSON.parse(data.toString())
      var latestPreferencesKey = preferences['latestPreferencesKey']
      logger.log('LOADED preferences for: ' + preferences['latestPreferencesKey'])

      recentPreferences = preferences[latestPreferencesKey]
      logger.log('Preferences loaded: ' + JSON.stringify(recentPreferences))
    }
  } catch(error) {
    logger.log('failed to read preferences from file' + error)
  }

  return recentPreferences
}

function newPreferences(galleryFolder, refreshInterval, numColumns) {
  return new Preferences({
    'galleryFolder': galleryFolder,
    'refreshInterval': refreshInterval,
    'numColumns': numColumns
  })
}

function preferencesFilePath() {
  //TODO move this to appHelper
  return _appHelper.app.getAppPath() + APP_PREFERENCES_FILE_PATH
}

function localisedDefaultFolderPath() {
  //TODO move this to appHelper
  return _appHelper.app.getAppPath() + '/' + new Preferences({}).DEFAULT_FOLDER
}

function folderExists(path) {
  return fs.existsSync(path)
}

