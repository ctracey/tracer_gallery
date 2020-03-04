const EventChannel = require("./app/eventChannel").class
var logger = require("./app/logger")

let eventChannel

// Run this function after the page has loaded
$(() => {
  logger.log('Loading imageViewer ...')
  try {
    eventChannel = initEventChannel()

    var imageViewer = require("./app/imageViewer")(eventChannel)
    imageViewer.handleEvents()

    handleActions(imageViewer)

    logger.log('Image View loaded');
    eventChannel.send(eventChannel.EVENT_IMAGEVIEW_LOADED, {})
  } catch (err) {
    logger.error(err)
  }
})

function handleActions(imageViewer) {
  // HANDLE JQUERY ACTIONS
  // TODO: refactor this
  //   handler, events?, class names, icon pointer
  const {shell} = require('electron')
  var folderButton = document.getElementById('folderButton')
  folderButton.addEventListener('click', function (event) {
    var viewerImage = document.getElementById('viewer-image')
    shell.showItemInFolder(viewerImage.src.replace('file://', ''))
  })
}

function initEventChannel() {
  var ipc = require('electron').ipcRenderer;

  return new EventChannel({
    'channelName'         : "imageViewerEventChannel",
    'inboundChannel'      : ipc,
    'outboundChannelName' : "mainProcessChannel",
    'outboundChannel'     : ipc
  })
}

