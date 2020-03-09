const EventChannel = require("./app/eventChannel").class
const {shell} = require('electron')
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

  var openImageInFolderAction = document.getElementById('openImageInFolderAction')
  openImageInFolderAction.addEventListener('click', function (event) {
    handleOpenInFolderAction(event)
  })
}

function handleOpenInFolderAction(event) {
  var viewerImage = document.getElementById('viewer-image')
  shell.showItemInFolder(viewerImage.src.replace('file://', ''))
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

