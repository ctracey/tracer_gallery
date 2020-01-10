const DEFAULT_FOLDER = 'test/sample_images'
const DEFAULT_REFRESH_INTERVAL = '60'
const DEFAULT_GALLERY_SET_SIZE = 12
const DEFAULT_NUM_COLUMNS = 1

//TODO: non parametised initialiser that doesnt change preferences. Can you create multiple instances of a module? How does that work
module.exports = function(json) {
  init(json)

  var module = {
    // CONSTANTS

    DEFAULT_FOLDER: DEFAULT_FOLDER,
    DEFAULT_REFRESH_INTERVAL: DEFAULT_REFRESH_INTERVAL,
    DEFAULT_GALLERY_SET_SIZE: DEFAULT_GALLERY_SET_SIZE,
    DEFAULT_NUM_COLUMNS: DEFAULT_NUM_COLUMNS,

    // FUNCTIONS

    loadFromJSON: function (_json) {
      return loadFromJSON(_json)
    },

    toJSON: function () {
      return preferencesData
    },

    galleryFolder: function () {
      return preferencesData['galleryFolder'] },

    refreshInterval: function () {
      return preferencesData['refreshInterval']
    },

    numColumns: function () {
      return preferencesData['numColumns']
    },

    gallerySetSize: function () {
      return preferencesData['gallerySetSize']
    },
  }

  return module;
}

let preferencesData

function init(json) {
  preferencesData = defaultPreferences()

  //when json is null use empty object and get defaults
  if (!json) {
    json = {}
  }

  //replace default preferences with params if not null
  if (json['galleryFolder']) preferencesData['galleryFolder'] = json['galleryFolder']
  if (json['refreshInterval']) preferencesData['refreshInterval'] = json['refreshInterval']
  if (json['numColumns']) preferencesData['numColumns'] = json['numColumns']
}

function loadFromJSON(json) {
  init(json)
}

function defaultPreferences() {
  return {
    'galleryFolder':   defaultFolderPath(),
    'refreshInterval': DEFAULT_REFRESH_INTERVAL,
    'numColumns':      DEFAULT_NUM_COLUMNS,
    'gallerySetSize':  DEFAULT_GALLERY_SET_SIZE
  }
}

function defaultFolderPath() {
  return './' + DEFAULT_FOLDER
}

