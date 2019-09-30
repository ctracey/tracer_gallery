//Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
const fs = require('fs')

const PREFERENCES_FILE_PATH = app.getAppPath() + '/preferences/preferences.json'
const DEFAULT_FOLDER = './test/sample_images'
const DEFAULT_REFRESH_INTERVAL = '60'
const DEFAULT_GALLERY_SET_SIZE = 12
const DEFAULT_NUM_COLUMNS = 1

const EVENT_INIT_GALLERY = 'init-gallery'
const EVENT_GALLERY_LOADED = 'gallery-loaded'
const EVENT_SAVE_PREFERENCES = 'save-preferences'
const EVENT_EDIT_PREFERENCES = 'edit-preferences'
const EVENT_SELECT_GALLERY_IMAGES = 'select-gallery-images'
const EVENT_GALLERY_IMAGES_SELECTED = 'gallery-images-selected'
const EVENT_QUIT_APPLICATION = 'quit-application'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  console.log('create main window');
  mainWindow = new BrowserWindow({
    width: 250,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  //Setup menu items
  setupApplicationMenu()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipc.on(EVENT_SELECT_GALLERY_IMAGES, function (event, eventData) {
  logEventReceived(EVENT_SELECT_GALLERY_IMAGES, eventData)

  console.log('selecting images');
  var galleryFolder = eventData['galleryFolder'];

  try {
    fs.readdir(galleryFolder, function(err, filenames) {
      console.log('folder images:')
      console.log(filenames);

      //check if enough images are in folder
      var setSize = filenames.length < DEFAULT_GALLERY_SET_SIZE ? filenames.length : DEFAULT_GALLERY_SET_SIZE;
      //select random images from folder
      var selectedImages = selectRandomImages(filenames, setSize)

      mainWindow.webContents.send(EVENT_GALLERY_IMAGES_SELECTED, {
        'containerId': eventData['containerId'],
        'galleryFolder': galleryFolder,
        'imageFilenames': selectedImages
      });
      logEventTriggered(EVENT_GALLERY_IMAGES_SELECTED)
    });
  }
  catch (err) {
    console.log(err);
  }
})

ipc.on(EVENT_GALLERY_LOADED, function (event, eventData) {
  logEventReceived(EVENT_GALLERY_LOADED, eventData)

  var initialPreferences = defaultPreferences()
  var recentPreferences = loadRecentPreferences()
  if (recentPreferences != null) {
    console.log('Preferences loaded: ' + JSON.stringify(recentPreferences))
    initialPreferences['galleryFolder'] = recentPreferences != null ? recentPreferences['galleryFolder'] : DEFAULT_FOLDER
    initialPreferences['refreshInterval'] = recentPreferences != null ? recentPreferences['refreshInterval'] : DEFAULT_REFRESH_INTERVAL
    initialPreferences['numColumns'] = recentPreferences != null ? recentPreferences['numColumns'] : DEFAULT_NUM_COLUMNS
  }

  console.log('initial prefs: ' + JSON.stringify(initialPreferences))

  try {
    mainWindow.webContents.send(EVENT_INIT_GALLERY, {
      'defaultFolder': initialPreferences['galleryFolder'],
      'refreshInterval': initialPreferences['refreshInterval'],
      'numColumns': initialPreferences['numColumns']
    });
    logEventTriggered(EVENT_INIT_GALLERY)
  }
  catch (err) {
    console.log(err);
  }
})

ipc.on(EVENT_SAVE_PREFERENCES, function (event, eventData) {
  logEventReceived(EVENT_SAVE_PREFERENCES, eventData)

  var currentPreferences = eventData['currentPreferences']
  savePreferences(currentPreferences)
})

function setupApplicationMenu() {
  var menuTemplate = []

  menuTemplate.push(appMenuTemplate())
  menuTemplate.push(editMenuTemplate())
  menuTemplate.push(viewMenuTemplate())
  menuTemplate.push(windowMenuTemplate())

  var menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
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

      quitMenuItem()
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

function editMenuTemplate() {
  return {role: 'editMenu'}
}

function viewMenuTemplate() {
  return {role: 'viewMenu'}
}

function windowMenuTemplate() {
  return {role: 'windowMenu'}
}

function editPreferences() {
  mainWindow.webContents.send(EVENT_EDIT_PREFERENCES, {})
}

function quitApplication() {
  app.quit()
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

  console.log('selected images:')
  console.log(selectedImages)

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

function savePreferences(currentPreferences) {
  var currentGalleryFolder = currentPreferences['galleryFolder']

  var preferences = {}
  preferences['latestPreferencesKey'] = currentGalleryFolder
  preferences[currentGalleryFolder] = currentPreferences

  try {
    fs.writeFileSync(PREFERENCES_FILE_PATH, JSON.stringify(preferences), 'utf-8');
    console.log('saved preferences to: ' + app.getAppPath())
  } catch(error) {
    console.log('Failed to save preferences !' + error);
  }
}

function loadRecentPreferences() {
  var recentPreferences

  try {
    var data = fs.readFileSync(PREFERENCES_FILE_PATH);
    if (data != null) {
      console.log("Synchronous read: " + data.toString());
      var preferences = JSON.parse(data.toString())
      var latestPreferencesKey = preferences['latestPreferencesKey']
      console.log('LOADED preferences: ' + preferences['latestPreferencesKey'])

      recentPreferences = preferences[latestPreferencesKey]
    }
  } catch(error) {
    console.log('failed to read preferences from file' + error)
  }

  return recentPreferences
}

function defaultPreferences() {
  return {
    'galleryFolder': DEFAULT_FOLDER,
    'refreshInterval': DEFAULT_REFRESH_INTERVAL
  }
}

function logEventReceived(eventName, eventData) {
  console.log('\nEVENT: ' + eventName);
  console.log('\teventData: ' + JSON.stringify(eventData))
}

function logMenuItemEvent(menuItem) {
  logEventReceived('menu item selected', {'menuItem': menuItem})
}

function logEventTriggered(eventName) {
  console.log('TRIGGERED EVENT: ' + eventName);
}
