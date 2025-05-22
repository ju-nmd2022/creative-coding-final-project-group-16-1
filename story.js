let currentEmotion = null;  
let storyLocked = false;   
let latestEmotions = null;  

const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights')
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Error accessing webcam: ", err));
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.getElementById('video-section').append(canvas);

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    const faceCount = detections.length;
    if (faceCount > 1) {
      warningPopup.style.display = 'block';
      confirm("One face each time!")
    } else {
      warningPopup.style.display = 'none';
    }

    if (detections.length > 0) {
      latestEmotions = detections[0].expressions;  
      updateEmotionBar(latestEmotions);   // update the emotion bar in real time
    }
  }, 400);
});

function updateEmotionBar(emotions) {
  const emotionBar = document.getElementById('emo-bar');
  const positiveEmotion = emotions.happy;
  const negativeEmotion = emotions.sad + emotions.angry + emotions.disgusted;

  if (positiveEmotion > negativeEmotion) {
    emotionBar.value = Math.min(100, emotionBar.value + 10);
  } else {
    emotionBar.value = Math.max(0, emotionBar.value - 10);
  }

  updateEmotionBarColor(emotionBar.value);
}

function updateEmotionBarColor(value) {
  const emotionBar = document.getElementById('emo-bar');
  let red, green;

  if (value <= 50) {
    red = 255;
    green = Math.floor(255 * (value / 50));  
  } else {
    red = Math.floor(255 * (1 - (value - 50) / 50));  
    green = 255;
  }

  emotionBar.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
}

function getDetectedEmotion(emotions) {
  const sorted = Object.entries(emotions).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0.5 ? sorted[0][0] : "neutral";
}

function generateStoryBasedOnEmotion(emotion) {
  const characters = [
    "a curious fox", "a lonely astronaut", "a tired robot", "a rebellious princess", 
    "an ancient tree", "a traveler with no past", "a creature made of light"
  ];

  const locations = [
    "in a forgotten forest", "on a floating island", "beneath the ocean", 
    "in the last city on Earth", "among the stars", "inside a dream", 
    "in a world made of mirrors"
  ];

  const quests = [
    "searching for something they could not name",
    "trying to remember why they were born",
    "running from a voice only they could hear",
    "looking for a door that appears only at night",
    "trying to undo a promise made long ago"
  ];

  const twists = {
    happy: [
      "Suddenly, they found a glowing key buried under a sunflower.",
      "Out of nowhere, laughter echoed through the sky like music.",
      "Then, a cloud opened up and rained candy on the land below."
    ],
    sad: [
      "Suddenly, all color faded from the world.",
      "A ghostly figure whispered their name and vanished.",
      "They realized the stars had forgotten how to shine."
    ],
    angry: [
      "Then the ground cracked, and fire leapt out to answer their rage.",
      "Their scream summoned a dragon that had been asleep for 1000 years.",
      "They punched the sky so hard, the moon fell into the sea."
    ],
    disgusted: [
      "Out of the rot, something began to crawl — but it was beautiful.",
      "They touched the ooze, and it whispered secrets to them.",
      "The ugliness around them twisted into a kind of truth."
    ],
    neutral: [
      "Nothing happened — and yet, everything felt different.",
      "Time blinked, then reversed for just a moment.",
      "A bird landed beside them and said, 'The world is watching.'"
    ]
  };

  const endings = [
    "They kept walking, unsure if the journey had just begun or just ended.",
    "And so, they became a story that others would someday tell.",
    "No one knows what happened next — maybe even they forgot.",
    "But one thing was clear: nothing would ever be the same again.",
    "And in that moment, they understood everything without needing words."
  ];

 
  const character = randomElement(characters);
  const location = randomElement(locations);
  const quest = randomElement(quests);
  const twist = randomElement(twists[emotion] || twists["neutral"]);
  const ending = randomElement(endings);

  return `There was once ${character} who lived ${location}. They were ${quest}. ${twist} ${ending}`;
}

function createSound(emotion) {
  Tone.Transport.stop();
  Tone.Transport.cancel();

  let synth, effectChain, scale = [], bpm, baseOctave;

 
  function generateRandomMelody(scale, length) {
    return Array.from({ length }, () => {
      const note = scale[Math.floor(Math.random() * scale.length)];
      const octave = baseOctave + Math.floor(Math.random() * 2); 
      return `${note}${octave}`;
    });
  }


  const durations = ["4n", "8n", "16n", "2n"];


  if (emotion === "happy") {
    synth = new Tone.Synth().connect(new Tone.Reverb(Math.random() * 3).toDestination());
    scale = ["C", "D", "E", "G", "A"];
    baseOctave = 4;
    bpm = 120 + Math.floor(Math.random() * 40); 

  } else if (emotion === "sad") {
    synth = new Tone.FMSynth().connect(new Tone.FeedbackDelay("8n", Math.random()).toDestination());
    scale = ["A", "B", "C", "D", "E"];
    baseOctave = 3;
    bpm = 60 + Math.floor(Math.random() * 20);  

  } else if (emotion === "angry") {
    synth = new Tone.MembraneSynth().connect(new Tone.Distortion(Math.random()).toDestination());
    scale = ["C", "D", "Eb", "F", "G"];
    baseOctave = 2;
    bpm = 160 + Math.floor(Math.random() * 40);  

  } else if (emotion === "disgusted") {
    synth = new Tone.AMSynth().connect(new Tone.FeedbackDelay("16n", Math.random()).toDestination());
    scale = ["C", "Db", "Gb", "A"];
    baseOctave = 2;
    bpm = 80 + Math.floor(Math.random() * 20);

  } else {
    synth = new Tone.DuoSynth().connect(new Tone.Reverb(Math.random() * 5).toDestination());
    scale = ["C", "D", "E", "F", "G", "A", "B"];
    baseOctave = 3;
    bpm = 100 + Math.floor(Math.random() * 30);
  }

  const melody = generateRandomMelody(scale, 6);
  const durationSeq = melody.map(() => durations[Math.floor(Math.random() * durations.length)]);

  Tone.Transport.bpm.value = bpm;

  const part = new Tone.Part((time, note) => {
    synth.triggerAttackRelease(note, "8n", time);
  }, melody.map((note, i) => [i * Tone.Time(durationSeq[i]), note]));

  part.start(0);
  Tone.Transport.start();
}


function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

document.getElementById('refresh-button').addEventListener('click', () => {
  if (latestEmotions) {
    const detectedEmotion = getDetectedEmotion(latestEmotions);

    const storyText = document.getElementById('storyText');
    const story = generateStoryBasedOnEmotion(detectedEmotion);
    storyText.innerText = story;

    createSound(detectedEmotion);
    updateEmotionBar(latestEmotions);
  }
});