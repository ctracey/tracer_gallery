// Run this function after the page has loaded
$(() => {
  $('#logs').append("<li>gallery js test</li>");

  //Add sample images
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample1.png'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample2.jpg'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample3.jpg'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample4.jpg'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample5.jpg'/>");
  $('#gallery_container').append("<img style='width:100%' src='./test/sample_images/sample6.jpg'/>");
})

