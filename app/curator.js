const fs = require('fs')
const path = require('path')

var logger = require("./logger")

const APP_PREFERENCES_FILE_PATH = '/preferences/preferences.json'
const DEFAULT_FOLDER = './test/sample_images'
const DEFAULT_REFRESH_INTERVAL = '60'
const DEFAULT_GALLERY_SET_SIZE = 12
const DEFAULT_NUM_COLUMNS = 1

module.exports = function(mainApp, mainEventChannel) {
  init(mainApp, mainEventChannel)

  var module = {

    handleEvents: function (ipc) {
      handleEvents(ipc)
    }

  }

  return module;
}

let app
let eventChannel

function init(mainApp, mainEventChannel) {
  app = mainApp
  eventChannel = mainEventChannel
}

function preferencesFilePath() {
  return app.getAppPath() + APP_PREFERENCES_FILE_PATH
}

function handleEvents(ipc) {
  ipc.on(eventChannel.EVENT_SELECT_GALLERY_IMAGES, function (event, eventData) {
    logger.logEventReceived(eventChannel.EVENT_SELECT_GALLERY_IMAGES, eventData)

    logger.log('selecting images');
    var galleryFolder = eventData['galleryFolder'];

    try {
      fs.readdir(galleryFolder, function(err, filenames) {
        logger.log('folder images:')
        logger.log(filenames);

        //check if enough images are in folder
        var setSize = filenames.length < DEFAULT_GALLERY_SET_SIZE ? filenames.length : DEFAULT_GALLERY_SET_SIZE;
        //select random images from folder
        var selectedImages = selectRandomImages(filenames, setSize)

        eventChannel.send(eventChannel.EVENT_GALLERY_IMAGES_SELECTED, {
          'containerId': eventData['containerId'],
          'galleryFolder': galleryFolder,
          'imageFilenames': selectedImages
        })
      });
    }
    catch (err) {
      logger.log(err);
    }
  })

  ipc.on(eventChannel.EVENT_GALLERY_LOADED, function (event, eventData) {
    logger.logEventReceived(eventChannel.EVENT_GALLERY_LOADED, eventData)

    var initialPreferences = defaultPreferences()
    var recentPreferences = loadRecentPreferences()
    if (recentPreferences != null) {
      logger.log('Preferences loaded: ' + JSON.stringify(recentPreferences))
      initialPreferences['galleryFolder'] = recentPreferences != null ? recentPreferences['galleryFolder'] : DEFAULT_FOLDER
      initialPreferences['refreshInterval'] = recentPreferences != null ? recentPreferences['refreshInterval'] : DEFAULT_REFRESH_INTERVAL
      initialPreferences['numColumns'] = recentPreferences != null ? recentPreferences['numColumns'] : DEFAULT_NUM_COLUMNS
    }

    logger.log('initial prefs: ' + JSON.stringify(initialPreferences))

    try {
      eventChannel.send(eventChannel.EVENT_INIT_GALLERY, {
        'defaultFolder': initialPreferences['galleryFolder'],
        'refreshInterval': initialPreferences['refreshInterval'],
        'numColumns': initialPreferences['numColumns']
      })
    }
    catch (err) {
      logger.log(err);
    }
  })

  ipc.on(eventChannel.EVENT_SAVE_PREFERENCES, function (event, eventData) {
    logger.logEventReceived(eventChannel.EVENT_SAVE_PREFERENCES, eventData)

    var galleryPreferences = eventData['galleryPreferences']
    savePreferences(galleryPreferences)
  })
}

function editPreferences() {
  eventChannel.send(eventChannel.EVENT_EDIT_PREFERENCES, {})
}

function selectRandomImages(filenames, setSize) {
  var index = 0;
  var selectedImages = []

  var shuffledIndexes = shuffleArray(Array.from(Array(filenames.length).keys()))

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
  var currentGalleryFolder = galleryPreferences['galleryFolder']

  var preferences = {}
  preferences['latestPreferencesKey'] = currentGalleryFolder
  preferences[currentGalleryFolder] = galleryPreferences

  try {
    fs.writeFileSync(preferencesFilePath(), JSON.stringify(preferences), 'utf-8');
    logger.log('saved preferences to: ' + app.getAppPath())
  } catch(error) {
    logger.log('Failed to save preferences !' + error);
  }
}

function loadRecentPreferences() {
  var recentPreferences

  try {
    var data = fs.readFileSync(preferencesFilePath());
    if (data != null) {
      logger.log("Synchronous read: " + data.toString());
      var preferences = JSON.parse(data.toString())
      var latestPreferencesKey = preferences['latestPreferencesKey']
      logger.log('LOADED preferences: ' + preferences['latestPreferencesKey'])

      recentPreferences = preferences[latestPreferencesKey]
    }
  } catch(error) {
    logger.log('failed to read preferences from file' + error)
  }

  return recentPreferences
}

function defaultPreferences() {
  return {
    'galleryFolder': DEFAULT_FOLDER,
    'refreshInterval': DEFAULT_REFRESH_INTERVAL
  }
}

