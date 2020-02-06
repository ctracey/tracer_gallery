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
  _eventChannel = appHelper.eventChannel
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
  return {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },

      { type: 'separator' },
      toggleWindowFrameMenuItem(),

      { type: 'separator' },
      { role: 'front' },

      { type: 'separator' },
      { role: 'window' }
    ]
  }
}

function appMenuTemplate() {
  return {
    label: _appHelper.app.getName(),
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

function toggleWindowFrameMenuItem() {
  return {label: 'Toggle Window Frame',
      click(menuItem) {
        logMenuItemEvent(menuItem['label'])
        toggleWindowFrame()
      },
      accelerator: 'F'
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

function toggleWindowFrame() {
  _eventChannel.send(_eventChannel.EVENT_TOGGLE_WINDOW_FRAME, {}, true)
}

function playPauseGallery() {
  _eventChannel.send(_eventChannel.EVENT_PLAYPAUSE_EXHIBITION, {})
}

function logMenuItemEvent(menuItem) {
  logger.logEventReceived(_eventChannel.EVENT_MENU_ITEM_SELECTED, {'menuItem': menuItem})
}

