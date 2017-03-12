/*------------- Cross-Browser Prefixes -------------*/
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

/*--------------- Create Grammar/Vocab ---------------*/
var goodMoods = ['well', 'great', 'pretty good', 'happy']
var badMoods = ['depressed', 'sad', 'tired', 'stressed']
var vague = ['okay', 'fine']

var grammar = '#JSGF V1.0; grammar colors; public <goodMoods> = ' +
  goodMoods.join(' | ') + ' ; #JSGF V1.0; grammar colors; public <badMoods> = ' +
  badMoods.join(' | ') + ' ; #JSGF V1.0; grammar colors; public <vague> = ' +
  vague.join(' | ') + ' ;'

/*-------------- Initialize Speech Rec -------------*/
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
/*-------------- Initialize Speech Synth ------------*/
var synth = window.speechSynthesis;
var voices = synth.getVoices();

function say (response) {
  //event.preventDefault();

  var utterance = new SpeechSynthesisUtterance(response);
  utterance.voice = voices[0];
  utterance.pitch = 1;
  utterance.rate = 1;
  synth.speak(utterance);

  // utterance.onpause = function(event) {
  //   var char = event.utterance.text.charAt(event.charIndex);
  //   console.log('Speech paused at character ' + event.charIndex + ' of "' +
  //   event.utterance.text + '", which is "' + char + '".');
  // }
  //response.blur();
}

/*--------------- Define Page Outputs ---------------*/
var diagnostic = document.querySelector('.output');
var bg = document.querySelector('body');
bg.style.background = "url(img/solace-default.png) center";

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive.');
}

/*------------ Choose Response Text and BG ----------*/
recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.

  var last = event.results.length - 1;
  var input = event.results[last][0].transcript;
  var response = "";

  diagnostic.textContent = 'I heard: ' + input + '.';
  if (goodMoods.includes(input)) {
    bg.style.background = "url(img/dusk-1.jpg)";
  } else if (badMoods.includes(input)) {
    bg.style.background = "url(img/midday-2.jpg)";
  } else if (vague.includes(input)) {
    bg.style.background = "url(img/sunrise-4.jpg)";
    response = "Tell me more."
  }
  console.log('Confidence: ' + event.results[0][0].confidence);
  say(response);
}

recognition.onspeechend = function() {
  recognition.stop();
}


/*---------------- Error Handling ---------------*/
recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't understand your mood.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
