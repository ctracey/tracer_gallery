module.exports = {
    class: class Preferences {

      // CONSTANTS
      get DEFAULT_FOLDER()           { return 'test/sample_images' }
      get DEFAULT_REFRESH_INTERVAL() { return '60' }
      get DEFAULT_GALLERY_SET_SIZE() { return 12 }
      get DEFAULT_NUM_COLUMNS()      { return 1 }

      // PRIVATE PROPERTIES
      _preferencesData = {}

      // CONSTRUCTOR
      constructor(json) {
        this._preferencesData = this.defaultPreferences()

        //when json is null use empty object and get defaults
        if (!json) {
          json = {}
        }

        //replace default preferences with params if not null
        if (json['galleryFolder']) this._preferencesData['galleryFolder'] = json['galleryFolder']
        if (json['refreshInterval']) this._preferencesData['refreshInterval'] = json['refreshInterval']
        if (json['numColumns']) this._preferencesData['numColumns'] = json['numColumns']
      }

      toJSON() {
        return this._preferencesData
      }

      get galleryFolder() {
        return this._preferencesData['galleryFolder']
      }

      get refreshInterval() {
        return this._preferencesData['refreshInterval']
      }

      get numColumns() {
        return this._preferencesData['numColumns']
      }

      get gallerySetSize() {
        return this._preferencesData['gallerySetSize']
      }

      defaultFolderPath() {
        return './' + this.DEFAULT_FOLDER
      }

      defaultPreferences() {
        return {
          'galleryFolder':   this.defaultFolderPath(),
          'refreshInterval': this.DEFAULT_REFRESH_INTERVAL,
          'numColumns':      this.DEFAULT_NUM_COLUMNS,
          'gallerySetSize':  this.DEFAULT_GALLERY_SET_SIZE
        }
      }

    }
}

