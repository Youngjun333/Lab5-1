// script.js
//Event.preventDefault();
const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('volume-group');
const button_read_text = document.querySelector("[type='button']");
const button_clear = document.querySelector("[type='reset']");
const image_change = document.getElementById('image-input');
const form = document.getElementById("generate-meme");



//Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //const read_text = document.querySelector("reset").disabled = false;
  let bounds = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, bounds.startX, bounds.startY, bounds.width, bounds.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});


//submit
form.addEventListener('submit', generateMeme);

function generateMeme(event){
  event.preventDefault();

  let top = document.getElementById("text-top").value;
  let bot = document.getElementById("text-bottom").value;

  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.strokeText(top, 50, 50);
  ctx.strokeText(bot, 50, 350);

  let allow_clear = document.querySelector("[type='reset']").disabled = false;
  let allow_read_text = document.querySelector("[type='button']").disabled = false;
}

image_change.addEventListener('change', () =>  {
  img.src = URL.createObjectURL(event.target.files[0]);
  //img.src = URL.createObjectURL(File);
});

button_clear.addEventListener('click', function(event) {
  event.preventDefault();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  button_clear.disabled = true;
  const allow_read_text = document.querySelector("[type='button']").disabled = true;
});



var synth = window.speechSynthesis;
var voices = [];
document.getElementById('voice-selection').disabled = false;
function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById('voice-selection').appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
document.getElementById("voice-selection").remove(0);


button_read_text.addEventListener('click', function(event) {

  event.preventDefault();
  let top = document.getElementById("text-top").value;
  let bot = document.getElementById("text-bottom").value;

  var utterThis = new SpeechSynthesisUtterance(top + bot);
  var selectedOption = document.getElementById('voice-selection').selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }

  let sound = document.querySelector("[type='range']").value / 100;
  utterThis.volume = sound;
  synth.speak(utterThis);  
});


slider.addEventListener('input', function() {

  let val = document.querySelector("[type='range']").value;
  let x = document.getElementById("volume-group");

  if(val == 0) {
    x.querySelector("img").src = "icons/volume-level-0.svg"
  }
  else if(val >= 1 && val <= 33){
    x.querySelector("img").src = "icons/volume-level-1.svg"
  }
  else if(val >= 34 && val <= 66){
    x.querySelector("img").src = "icons/volume-level-2.svg"
  }
  else{
    x.querySelector("img").src = "icons/volume-level-3.svg"
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
