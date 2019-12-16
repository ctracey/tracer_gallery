var logger = require("./logger")

module.exports = function(mainApp, _eventChannel) {
  init(mainApp, _eventChannel)

  var module = {

    createApplicationMenu: function () {
      createApplicationMenu()
    }

  }

  return module;
}

let app
let eventChannel

function init(_app, _eventChannel) {
  app = _app
  eventChannel = _eventChannel
}

const {Menu} = require('electron')

function createApplicationMenu() {
  var menuTemplate = []

  menuTemplate.push(appMenuTemplate())
  menuTemplate.push(editMenuTemplate())
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
    label: app.getName(),
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

      quitMenuItem(app)
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

function quitMenuItem(app) {
  return {label: 'Quit',
    click(menuItem) {
      logMenuItemEvent(menuItem['label'])
      app.quit()
    },
    accelerator: 'Cmd+Q'
  }
}

function editPreferences() {
  eventChannel.send(eventChannel.EVENT_EDIT_PREFERENCES, {})
}

function logMenuItemEvent(menuItem) {
  logger.logEventReceived(eventChannel.EVENT_MENU_ITEM_SELECTED, {'menuItem': menuItem})
}
