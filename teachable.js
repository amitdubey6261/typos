let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/ARAuZB7qj/';

let video;
let flippedVideo;
let label = "";

var count = 0 ; 

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

var beep = new Howl({
    src : ['./public/beep.mp3'] , 
});

function setup() {
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  classifyVideo();
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();

}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  if(results[0].label == 'Class 2') {
    count+=1 ; 
  }

  if( count == 30 ){
    beep.play();
    count = 0 ; 
  }

  classifyVideo();
}