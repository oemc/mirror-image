document.getElementById('buttonL').style.visibility = 'hidden';
document.getElementById('buttonR').style.visibility = 'hidden';

document.getElementById('original_image').onload = function() {
  // Get original width and height
  var w = original_image.width;
  var h = original_image.height;
  console.log('image loaded!')
  // Draw the mirrored version
  draw(this, w, h);
}

document.getElementById('original_input').onchange = function(evt) {
  var tgt = evt.target || window.event.srcElement;
  var files = tgt.files;
  // FileReader support
  if (FileReader && files && files.length) {
    var fr = new FileReader();
    fr.onload = function () {
      document.getElementById('original_image').src = fr.result;
    }
    fr.readAsDataURL(files[0]);
  }
  // Not supported
  else {
    alert("FileReader not supported");
  }
}

function save(canvas_id){
  var link = document.createElement('a');
  link.download = canvas_id + '.png';
  link.href = document.getElementById(canvas_id).toDataURL('image/png');
  link.click();
  //var img = document.getElementById(canvas_id).toDataURL('image/png');
  //window.open(img, '_blank')
}

function draw(img, w, h){
  //Display original
  img.style.display = "none";
  var original = document.getElementById('canvas_image');
  original.width = w;
  original.height = h;
  var ctx = original.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  
  //Left Mirroring
  var leftMirrored = document.getElementById('mirrored_image1');
  leftMirrored.width = w;
  leftMirrored.height = h;
  var Lctx = leftMirrored.getContext('2d');
  Lctx.drawImage(img, 0, 0, w, h);
  var LimageData = Lctx.getImageData(0, 0, leftMirrored.width, leftMirrored.height);
  var Ldata = LimageData.data;
  
  //Right Mirroring
  var rightMirrored = document.getElementById('mirrored_image2');
  rightMirrored.width = w;
  rightMirrored.height = h;
  var Rctx = rightMirrored.getContext('2d');
  Rctx.drawImage(img, 0, 0, w, h);
  var RimageData = Rctx.getImageData(0, 0, rightMirrored.width, rightMirrored.height);
  var Rdata = RimageData.data;
  
  //Loop
  var index = 0;
  var m_index = 0;
  for (var j = 0; j < h; j++){
    for (var i = 0; i < w; i++){
      index = (i + j * w) * 4;
      m_index = ((w - i) + j * w) * 4;
      if (i < (w/2)){
        Rdata[index] = Rdata[m_index];         //RED
        Rdata[index + 1] = Rdata[m_index + 1]; //BLUE
        Rdata[index + 2] = Rdata[m_index + 2]; //GREEN
        Rdata[index + 3] = Rdata[m_index + 3]; //ALPHA        
      }
      else{
        Ldata[index] = Ldata[m_index];         //RED
        Ldata[index + 1] = Ldata[m_index + 1]; //BLUE
        Ldata[index + 2] = Ldata[m_index + 2]; //GREEN
        Ldata[index + 3] = Ldata[m_index + 3]; //ALPHA 
      } 
    }
  }
  Lctx.putImageData(LimageData, 0, 0);
  Rctx.putImageData(RimageData, 0, 0);
  document.getElementById('buttonL').style.visibility = 'visible';
  document.getElementById('buttonR').style.visibility = 'visible';
}