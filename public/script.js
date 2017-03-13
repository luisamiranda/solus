/*------------- Cross-Browser Prefixes -------------*/
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

/*--------------- Create Grammar/Vocab ---------------*/
var greatMoods = ['great', 'I\'m great', 'I feel great', 'awesome', 'I\'m excited', 'I\'m happy'];
var goodMoods = ['well', 'I\'m well', 'very well, thanks','good', 'I\'m good', 'pretty good'];
var sadMoods = ['depressed', 'I\'m depressed', 'sad', 'I\'m sad', 'been better', 'I\'ve been better'];
var tiredMoods = ['tired', 'I\'m tired', 'I\'m so tired', 'exhausted', 'I\'m exhausted', 'sleepy', 'I\'m sleepy'];
var tenseMoods = ['stressed', 'I\'m stressed', 'anxious', 'I\'m anxious', 'worried', 'I\'m worried', 'frustrated', 'I\'m frustrated'];
var vague = ['okay', 'I\'m okay', 'fine', 'I\'m fine', 'fine, thank you', 'not bad', 'not so bad', 'not too bad', 'eh', 'meh'];

var grammar = '#JSGF V1.0; grammar colors; public <goodMoods> = ' +
  goodMoods.join(' | ') + ' ; #JSGF V1.0; grammar colors; public <sadMoods> = ' +
  sadMoods.join(' | ') + ' ; #JSGF V1.0; grammar colors; public <vague> = ' +
  vague.join(' | ') + ' ; #JSGF V1.0; grammar colors; public <greatMoods> = ' +
  greatMoods.join(' | ') + ' ; #JSGF V1.0; grammar colors; public <tenseMoods> = ' +
  tenseMoods.join(' | ') + ' ; #JSGF V1.0; grammar colors; public <tiredMoods> = ' +
  tiredMoods.join(' | ') + ' ;'

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

  var utterance = new SpeechSynthesisUtterance(response);
  utterance.voice = voices[1];
  utterance.pitch = 1;
  utterance.rate = 1;
  synth.speak(utterance);

  // utterance.onpause = function(event) {
  //   var char = event.utterance.text.charAt(event.charIndex);
  //   console.log('Speech paused at character ' + event.charIndex + ' of "' +
  //   event.utterance.text + '", which is "' + char + '".');
  // }
}

/*--------------- Define Page Outputs ---------------*/
var diagnostic = document.querySelector('.output');
var bg = document.querySelector('body');
var audio = document.getElementById('player');
//var source = document.getElementById('source');
bg.style.background = "url(img/solace-default.png) center";

/*--------------- Start Interaction! ---------------*/
say("How are you? Click to speak.");
audio.src="audio/01 Raga Jogeshwari, Alap 1.mp3";
audio.load();
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
  if (greatMoods.includes(input)) {
    response = "I'm happy to hear that. I hope you like this!";
    bg.style.background = "url(img/midday-2.jpg)";
    audio.src = "audio/Its_Not_Night_Its_Space_-_02_-_Starry_Wisdom.mp3";
    audio.load();
  } else if (goodMoods.includes(input)) {
    response = "I'm glad. Enjoy this painting of a sunrise.";
    bg.style.background = "url(img/sunrise-4.jpg)";
    audio.src = "audio/02 Miss Modular.mp3";
    audio.load();
  } else if (sadMoods.includes(input)) {
    response = "I'm sorry. Maybe this will make you feel better.";
    bg.style.background = "url(img/sunrise-1.jpg)";
    audio.src = "audio/01 Sleepwalker.mp3";
    audio.load();
  } else if (tiredMoods.includes(input)) {
    response = "Here's something energizing";
    bg.style.background = "url(img/midday-1.jpg)";
    audio.src = "audio/Iva_Bittova_-_04_-_Improvisation_4.mp3";
    audio.load();
  } else if (tenseMoods.includes(input)) {
    response = "I'm sorry. Here's something I find calming.";
    bg.style.background = "url(img/dusk-2.jpg)";
    audio.src = "audio/07 Corcovado.mp3";
    audio.load();
  } else if (vague.includes(input)) {
    response = "Can you tell me more?";
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
