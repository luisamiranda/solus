// inner variables
var song;
var tracker = $('.tracker');
var volume = $('.volume');
// initialization - first element in playlist
initAudio($('.playlist li:first-child'));
// set volume
song.volume = 0.8;
// initialize the volume slider
volume.slider({
range: 'min',
min: 1,
max: 100,
value: 80,
start: function(event,ui) {},
slide: function(event, ui) {
song.volume = ui.value / 100;
},
stop: function(event,ui) {},
});
// empty tracker slider
tracker.slider({
range: 'min',
min: 0, max: 10,
start: function(event,ui) {},
slide: function(event, ui) {
song.currentTime = ui.value;
},
stop: function(event,ui) {}
});

//several general functions to handle audio

export const initAudio = function (elem) {
var url = elem.attr('audiourl');
var title = elem.text();
var cover = elem.attr('cover');
var artist = elem.attr('artist');
$('.player .title').text(title);
$('.player .artist').text(artist);
$('.player .cover').css('background-image','url(data/' + cover+')');;
song = new Audio('data/' + url);
// timeupdate event listener
song.addEventListener('timeupdate',function (){
var curtime = parseInt(song.currentTime, 10);
tracker.slider('value', curtime);
});
$('.playlist li').removeClass('active');
elem.addClass('active');
}
function playAudio() {
19
song.play();
20
tracker.slider("option", "max", song.duration);
21
$('.play').addClass('hidden');
22
$('.pause').addClass('visible');
23
}
24
function stopAudio() {
25
song.pause();
26
$('.play').removeClass('hidden');
27
$('.pause').removeClass('visible');
28
}
And then I started to add event handlers to our control buttons. Play / Pause buttons:

01
// play click
02
$('.play').click(function (e) {
03
e.preventDefault();
04
playAudio();
05
});
06
// pause click
07
$('.pause').click(function (e) {
08
e.preventDefault();
09
stopAudio();
10
});
In order to turn to another song in the playlist, we have to stop playing a current song, pick a next (or previous) object in the playlist, and re-initialize our Audio element. Forward / Rewind buttons:

01
// forward click
02
$('.fwd').click(function (e) {
03
e.preventDefault();
04
stopAudio();
05
var next = $('.playlist li.active').next();
06
if (next.length == 0) {
07
next = $('.playlist li:first-child');
08
}
09
initAudio(next);
10
});
11
// rewind click
12
$('.rew').click(function (e) {
13
e.preventDefault();
14
stopAudio();
15
var prev = $('.playlist li.active').prev();
16
if (prev.length == 0) {
17
prev = $('.playlist li:last-child');
18
}
19
initAudio(prev);
20
});
Finally, few functions to handle with the playlist:

01
// show playlist
02
$('.pl').click(function (e) {
03
e.preventDefault();
04
$('.playlist').fadeIn(300);
05
});
06
// playlist elements - click
07
$('.playlist li').click(function () {
08
stopAudio();
09
initAudio($(this));
10
});
