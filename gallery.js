// Run this function after the page has loaded
$(() => {
  log('gallery start')

  let ipc
  try {
    ipc = require('electron').ipcRenderer;
    ipc.send('gallery-loaded', null)
    logEventTriggered('gallery-loaded')
    log('setup ipc');
  } catch (err) {
    log('ERROR: ' + err);
  }

  log('gallery loaded');

  const updateButton = document.getElementById('updateButton')
  updateButton.addEventListener('click', function () {
    log('button clicked');

    var galleryFolder = $('#gallery-folder').val();
    log('dir: ' + galleryFolder);

    ipc.send('select-gallery-images', {
      'galleryFolder': galleryFolder
    })
    logEventTriggered('select-gallery-images')
  })

  ipc.on('gallery-images-selected', function (event, eventData) {
    logEventReceived('gallery-images-selected', eventData)

    var galleryPath = eventData['galleryFolder'];
    log('galleryPath:' + galleryPath);

    //display new images
    $('#gallery_container').empty();
    for (var i=0; i<eventData['imageFilenames'].length; i++) {
      var imageFilename = eventData['imageFilenames'][i];
      imagePath = galleryPath + '/' + imageFilename;
      log('imagePath:' + imagePath);
      $('#gallery_container').append("<img style='width:100%' src='" + imagePath + "'/>");
    }
  })

  ipc.on('init-gallery', function (event, eventData) {
    logEventReceived('init-gallery received', eventData)

    var galleryDefaultFolder = eventData['defaultFolder'];
    $('#gallery-folder').val(galleryDefaultFolder);
  })
})

function logEventReceived(eventName, eventData) {
  log('<br/>EVENT: ' + eventName);
  log('eventData: ' + eventData);
}

function logEventTriggered(eventName) {
    log('TRIGGERED EVENT: ' + eventName);
}

function log(message) {
  $('#logs').append('<br/>' + message);
}
