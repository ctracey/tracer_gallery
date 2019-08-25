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
    // mainData = Number(arg);
    // targetPrice.innerHTML = '$'+mainData.toLocaleString('en')
  })


  $('#logs').append("<li>gallery js test</li>");
  //Add sample images
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample1.png'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample2.jpg'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample3.jpg'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample4.jpg'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample5.jpg'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample6.jpg'/>");
})

