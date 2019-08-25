// Run this function after the page has loaded
$(() => {
  $('#logs').append('<br/>gallery start');

  let ipc
  try {
    ipc = require('electron').ipcRenderer;
    ipc.send('gallery-loaded', null)
    $('#logs').append('<br/>TRIGGERED EVENT: gallery-loaded');
    $('#logs').append('<br/>setup ipc');
  } catch (err) {
    $('#logs').append('<br/>ERROR: ' + err);
  }

  $('#logs').append('<br/>gallery loaded');

  const updateButton = document.getElementById('updateButton')
  updateButton.addEventListener('click', function () {
    $('#logs').append('<br/>button clicked');

    var galleryFolder = $('#gallery-folder').val();
    $('#logs').append('<br/>dir: ' + galleryFolder);

    ipc.send('select-gallery-images', {
      'galleryFolder': galleryFolder
    })
    $('#logs').append('<br/>TRIGGERED EVENT: select-gallery-images');
  })

  ipc.on('gallery-images-selected', function (event, eventData) {
    $('#logs').append('<br/><br/>EVENT: gallery-images-selected');
    $('#logs').append('<br/>eventData: ' + eventData);

    var galleryPath = eventData['galleryFolder'];
    $('#logs').append('<br/>galleryPath:' + galleryPath);

    //display new images
    $('#gallery_container').empty();
    for (var i=0; i<eventData['imageFilenames'].length; i++) {
      var imageFilename = eventData['imageFilenames'][i];
      imagePath = galleryPath + '/' + imageFilename;
      $('#logs').append('<br/>imagePath:' + imagePath);
      $('#gallery_container').append("<img style='width:100%' src='" + imagePath + "'/>");
    }
  })

  ipc.on('init-gallery', function (event, eventData) {
    $('#logs').append('<br/><br/>EVENT: init-gallery received');
    $('#logs').append('<br/>eventData: ' + eventData);

    var galleryDefaultFolder = eventData['defaultFolder'];
    $('#gallery-folder').val(galleryDefaultFolder);
  })
})

