var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var goodMoods = ['well', 'aqua']
var badMoods = ['depressed', 'black']
var vague = ['okay', 'blue']

var grammar = '#JSGF V1.0; grammar colors; public <goodMoods> = ' +
  goodMoods.join(' | ') + ' ; #JSGF V1.0; grammar colors; public <badMoods> = ' +
  badMoods.join(' | ') + ' ; #JSGF V1.0; grammar colors; public <vague> = ' +
  vague.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('body');
var hints = document.querySelector('.hints');

var moodsHTML= '';
goodMoods.forEach(function(v, i, a){
  console.log(v, i);
  moodsHTML += '<span> ' + v + ' </span>';
});
hints.innerHTML = 'Tap/click then say a word to change the background color of the app. Try '+ moodsHTML + '.';

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive.');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  var last = event.results.length - 1;
  var input = event.results[last][0].transcript;

  diagnostic.textContent = 'Result received: ' + input + '.';
  bg.style.background = "url(img/sunrise-1.jpg)";
  console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't understand your mood.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
