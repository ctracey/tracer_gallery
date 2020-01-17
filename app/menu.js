var logger = require("./logger")

module.exports = function(appHelper) {
  init(appHelper)

  var module = {

    createApplicationMenu: function () {
      createApplicationMenu()
    }

  }

  return module;
}

let _appHelper
let _eventChannel

function init(appHelper) {
  _appHelper = appHelper
  _eventChannel = appHelper.eventChannel()
}

const {Menu} = require('electron')

function createApplicationMenu() {
  var menuTemplate = []

  menuTemplate.push(appMenuTemplate())
  menuTemplate.push(editMenuTemplate())
  menuTemplate.push(galleryMenuTemplate())
  menuTemplate.push(viewMenuTemplate())
  menuTemplate.push(windowMenuTemplate())

  var menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

function editMenuTemplate() {
  return {role: 'editMenu'}
}

function viewMenuTemplate() {
  return {role: 'viewMenu'}
}

function windowMenuTemplate() {
  return {role: 'windowMenu'}
}

function appMenuTemplate() {
  return {
    label: _appHelper.app().getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},

      preferencesMenuItem(),
      {type: 'separator'},

      {role: 'services'},
      {type: 'separator'},

      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},

      quitMenuItem()
    ]
  }
}

function galleryMenuTemplate() {
  return {
    label: 'Gallery',
    submenu: [
      {label: 'Play/Pause',
        click(menuItem) {
          logMenuItemEvent(menuItem['label'])
          playPauseGallery()
        },
        accelerator: 'P'
      }
    ]
  }
}

function preferencesMenuItem() {
  return {label: 'Preferences...',
    click(menuItem) {
      logMenuItemEvent(menuItem['label'])
        editPreferences()
    },
    accelerator: 'Cmd+,'
  }
}

function quitMenuItem() {
  return {label: 'Quit',
    click(menuItem) {
      logMenuItemEvent(menuItem['label'])
      quitApplication()
    },
    accelerator: 'Cmd+Q'
  }
}

function quitApplication() {
  _appHelper.quit()
}

function editPreferences() {
  _eventChannel.send(_eventChannel.EVENT_EDIT_PREFERENCES, {})
}

function playPauseGallery() {
  _eventChannel.send(_eventChannel.EVENT_PLAYPAUSE_EXHIBITION, {})
}

function logMenuItemEvent(menuItem) {
  logger.logEventReceived(_eventChannel.EVENT_MENU_ITEM_SELECTED, {'menuItem': menuItem})
}

