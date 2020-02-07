const logger = require("./logger")

module.exports = function(eventChannel) {
  init(eventChannel)

    var module = {
      handleEvents: function() {
        handleEvents()
      },
    }

  return module;
}

let _eventChannel

function init(eventChannel) {
  _eventChannel = eventChannel
}

function handleEvents() {
  _eventChannel.on(_eventChannel.EVENT_INIT_IMAGEVIEW, function (event, eventData) {
    handleInitImageView(event, eventData)
  })
}

function handleInitImageView(event, eventData) {
  viewerImage().on('load', function() {
    var imgWidth = viewerImage().width()
    var imgHeight = viewerImage().height()
    if (imgWidth > imgHeight) {
      viewerImage().addClass('viewerImg-landscape')
      $('.imgContainer').addClass('imgContainer-landscape')
    } else {
      viewerImage().addClass('viewerImg-portrait')
    }
  })
  viewerImage().attr('src', eventData['imagePath'])

}

function viewerImage() {
  return $('#viewer-image')
}

