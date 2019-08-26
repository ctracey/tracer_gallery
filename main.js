//Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
const fs = require('fs')

const defaultFolder = './test/sample_images'
const refreshPeriod = '60000'
const defaultGallerySetSize = 12

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

ipc.on('select-gallery-images', function (event, eventData) {
  logEventReceived('select-gallery-images', eventData)

  console.log('selecting images');
  var galleryFolder = eventData['galleryFolder'];

  try {
    fs.readdir(galleryFolder, function(err, filenames) {
      console.log('folder images:')
      console.log(filenames);

      //check if enough images are in folder
      var setSize = filenames.length < defaultGallerySetSize ? filenames.length : defaultGallerySetSize;
      //select random images from folder
      var selectedImages = selectRandomImages(filenames, setSize)

      mainWindow.webContents.send('gallery-images-selected', {
        'galleryFolder': galleryFolder,
        'imageFilenames': selectedImages
      });
      logEventTriggered('gallery-images-selected')
    });
  }
  catch (err) {
    console.log(err);
  }
})

ipc.on('gallery-loaded', function (event, eventData) {
  logEventReceived('gallery-loaded', eventData)

  try {
    mainWindow.webContents.send('init-gallery', {
      'defaultFolder': defaultFolder,
      'refreshPeriod': refreshPeriod
    });
    logEventTriggered('init-gallery')
  }
  catch (err) {
    console.log(err);
  }
})

function selectRandomImages(filenames, setSize) {
  var index = 0;
  var selectedImages = []

  var shuffledIndexes = shuffleArray(Array.from(Array(filenames.length).keys()))

  //until required images selected or no more files left to choose from
  while (selectedImages.length < setSize && index < shuffledIndexes.length) {
    //select valid images in shuffled order
    var imageFilename = filenames[shuffledIndexes[index]]
      if (imageFilename.match(/\.(gif|jpg|jpeg|tiff|png)$/) != null) {
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

function logEventReceived(eventName, eventData) {
  console.log('\nEVENT: ' + eventName);
  console.log('eventData: ' + eventData);
}

function logEventTriggered(eventName) {
  console.log('TRIGGERED EVENT: ' + eventName);
}
