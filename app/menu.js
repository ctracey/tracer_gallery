const {Menu} = require('electron')
var logger = require("./logger")

const ACCELERATOR_PLAYPAUSE = 'Cmd+P'
const ACCELERATOR_CLOSEIMAGEVIEWER = 'Cmd+W'
const ACCELERATOR_TOGGLEWINDOWFRAME = 'Cmd+F'
const ACCELERATOR_PREFERENCES = 'Cmd+,'
const ACCELERATOR_QUIT = 'Cmd+Q'

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

function createApplicationMenu() {
  var menuTemplate = []

  menuTemplate.push(appMenuTemplate())
  menuTemplate.push(fileMenuTemplate())
  menuTemplate.push(editMenuTemplate())
  menuTemplate.push(viewMenuTemplate())
  menuTemplate.push(windowMenuTemplate())
  menuTemplate.push(galleryMenuTemplate())

  var menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

function fileMenuTemplate() {
  return {
    label: 'File',
    submenu: [{
      label: 'Open',
      click() {
        let proj = dialog.showOpenDialog({
          properties: ['openFile', 'openDirectory']
        });
        log(proj);
        // ent.open(proj);
      }
    }]
  }
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
        accelerator: ACCELERATOR_PLAYPAUSE
      },
      {label: 'Close Image Viewer',
        click(menuItem) {
          logMenuItemEvent(menuItem['label'])
          closeImageViewer()
        },
        accelerator: ACCELERATOR_CLOSEIMAGEVIEWER
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
      accelerator: ACCELERATOR_TOGGLEWINDOWFRAME
  }
}
function preferencesMenuItem() {
  return {label: 'Preferences...',
    click(menuItem) {
      logMenuItemEvent(menuItem['label'])
        editPreferences()
    },
    accelerator: ACCELERATOR_PREFERENCES
  }
}

function quitMenuItem() {
  return {label: 'Quit',
    click(menuItem) {
      logMenuItemEvent(menuItem['label'])
      quitApplication()
    },
    accelerator: ACCELERATOR_QUIT
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

function closeImageViewer() {
  _eventChannel.send(_eventChannel.EVENT_CLOSE_IMAGEVIEW, {}, true)
}

function playPauseGallery() {
  _eventChannel.send(_eventChannel.EVENT_PLAYPAUSE_EXHIBITION, {})
}

function logMenuItemEvent(menuItem) {
  logger.logEventReceived(_eventChannel.EVENT_MENU_ITEM_SELECTED, {'menuItem': menuItem})
}

