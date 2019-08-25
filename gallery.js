// Run this function after the page has loaded
$(() => {
  $('#logs').append('<br/>gallery start');

  try {
    var ipc = require('electron').ipcRenderer;
    $('#logs').append('<br/>setup ipc');
  } catch (err) {
    $('#logs').append('<br/>ERROR: ' + err);
  }

  $('#logs').append('<br/>gallery done');

  const updateButton = document.getElementById('updateButton')
  updateButton.addEventListener('click', function () {
    $('#logs').append('<br/>button clicked');
    ipc.send('update-notify-value', 'updateData')
    $('#logs').append('<br/>ipc sent');
  })

  var mainData;
  ipc.on('mainData', function (event, arg) {
    $('#logs').append('<br/>main data received:' + arg);

    var path = arg['path'];
    $('#logs').append('<br/>path:' + path);

    //load images
    for (var i=0; i<arg['filenames'].length; i++) {
      var imageFilename = arg['filenames'][i];
      $('#logs').append('<br/>image:' + imageFilename);

      imagePath = path + '/' + imageFilename;
      $('#gallery_container').append("<img style='width:100%' src='" + imagePath + "'/>");
    }
  })
})

