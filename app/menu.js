var logger = require("./logger")
var EVENTS = require("./events")

module.exports = function(mainApp, mainEventChannel) {
  init(mainApp, mainEventChannel)

  var module = {

    setupApplicationMenu: function () {
      setupApplicationMenu()
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

const {Menu} = require('electron')

function setupApplicationMenu() {
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
  //TODO: refactor quit application
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

function quitApplication(app) {
  app.quit()
}

function logMenuItemEvent(menuItem) {
  logger.logEventReceived(EVENTS.EVENT_MENU_ITEM_SELECTED, {'menuItem': menuItem})
}
