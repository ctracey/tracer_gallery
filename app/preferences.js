const DEFAULT_FOLDER = './test/sample_images'
const DEFAULT_REFRESH_INTERVAL = '60'
const DEFAULT_GALLERY_SET_SIZE = 12
const DEFAULT_NUM_COLUMNS = 1

module.exports = function(json) {
  init(json)

  var module = {

    loadFromJSON: function (_json) {
      return loadFromJSON(_json)
    },

    toJSON: function() {
      return preferences
    },

    galleryFolder: function () {
      return preferences['galleryFolder'] },

    refreshInterval: function () {
      return preferences['refreshInterval']
    },

    numColumns: function () {
      return preferences['numColumns']
    },

    gallerySetSize: function () {
      return preferences['gallerySetSize']
    },
  }

  return module;
}

let preferences

function init(json) {
  preferences = defaultPreferences()

  //when json is null use empty object and get defaults
  if (!json) {
    json = {}
  }

  //replace default preferences with params if not null
  preferences['galleryFolder'] = json['galleryFolder'] ? json['galleryFolder'] : DEFAULT_FOLDER
  preferences['refreshInterval'] = json['refreshInterval'] ? json['refreshInterval'] : DEFAULT_REFRESH_INTERVAL
  preferences['numColumns'] = json['numColumns'] ? json['numColumns'] : DEFAULT_NUM_COLUMNS
}

function loadFromJSON(json) {
  init(json)
}

function defaultPreferences() {
  return {
    'galleryFolder':   DEFAULT_FOLDER,
    'refreshInterval': DEFAULT_REFRESH_INTERVAL,
    'numColumns':      DEFAULT_NUM_COLUMNS,
    'gallerySetSize':  DEFAULT_GALLERY_SET_SIZE
  }
}

