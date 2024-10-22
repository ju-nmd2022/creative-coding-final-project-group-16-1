let currentEmotion = null;  
let storyLocked = false;   

const video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
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

    if (detections.length > 0) {
      const emotions = detections[0].expressions;
      updateEmotionBar(emotions);

      const faceCount = detections.length;
      if (faceCount > 1) {
        warningPopup.style.display = 'block';
        confirm("One face each time!");
      } else {
        warningPopup.style.display = 'none';
        if (!storyLocked) {
          generateRandomStory(emotions);
        }
      }
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

function generateRandomStory(emotions) {
  let detectedEmotion = getDetectedEmotion(emotions);

  if (detectedEmotion !== currentEmotion) {
    currentEmotion = detectedEmotion;
    storyLocked = true;

    const storyText = document.getElementById('storyText');
    const story = generateStoryBasedOnEmotion(currentEmotion);
    storyText.innerText = story;

    // Play sound for the current emotion
    createSound(currentEmotion);
  }
}

function getDetectedEmotion(emotions) {
  if (emotions.happy > 0.5) {
    return "happy";
  } else if (emotions.sad > 0.5) {
    return "sad";
  } else if (emotions.angry > 0.8) {
    return "angry";
  } else if (emotions.disgusted > 0.9) {
    return "disgusted";
  } else {
    return "neutral";
  }
}

function generateStoryBasedOnEmotion(emotion) {
  let storyStart = "";
  let storyMiddle = "";
  let storyEnd = "";

  const stories = {
    happy: {
      start: [
        "In a vibrant village filled with laughter,",
        "On a sunny day where everything seemed perfect,",
        "Amidst blooming flowers and cheerful conversations,"
      ],
      middle: [
        "the villagers danced with joy, celebrating the beauty of life.",
        "everyone gathered to share stories and make new memories.",
        "children ran across the fields, their laughter filling the air."
      ],
      end: [
        "As the sun set, the joy remained, warming everyone's hearts.",
        "The day ended, but the happiness lingered, lighting the path forward.",
        "The night was calm, and the village slept peacefully, content with the day's memories."
      ]
    },
    sad: {
      start: [
        "In a quiet town where the rain never seemed to stop,",
        "On a cloudy day where everything felt heavy,",
        "In a place where the sun had long since disappeared,"
      ],
      middle: [
        "the people moved slowly, burdened by memories of better times.",
        "tears fell like raindrops, as hearts grew heavier with sorrow.",
        "the town was silent, except for the quiet sobs of those remembering what was lost."
      ],
      end: [
        "But even in the darkest times, hope remained, like a small flicker in the distance.",
        "Yet through the tears, a glimmer of light appeared, promising a brighter tomorrow.",
        "Even in the sadness, there was a quiet understanding that the rain would eventually pass."
      ]
    },
    angry: {
      start: [
        "In a land torn apart by conflict and anger,",
        "Under a sky filled with thunder,",
        "In the midst of a storm that reflected the turmoil within,"
      ],
      middle: [
        "tempers flared, and the air was thick with tension.",
        "people shouted and argued, their hearts consumed by fury.",
        "the storm grew stronger, mirroring the anger that burned within the people."
      ],
      end: [
        "But as the storm passed, a calm began to settle, and they realized peace was possible.",
        "The anger subsided, leaving behind a chance to rebuild and make amends.",
        "In the aftermath of the storm, the people found peace, knowing anger was not the answer."
      ]
    },
    disgusted: {
      start: [
        "In a world decaying from within,",
        "Amidst the foul stench of betrayal and greed,",
        "In a land where corruption had taken root deep,"
      ],
      middle: [
        "the people turned away, disgusted by what they had allowed to fester.",
        "there was no joy, only disgust at the sight of the ruin before them.",
        "as the ground decayed, so did the values they once held dear."
      ],
      end: [
        "But from the decay, new life began to sprout, offering hope for the future.",
        "Through confronting the ugliness, they realized the only way forward was through renewal.",
        "Even in the darkest decay, there is always a chance for rebirth and renewal."
      ]
    },
    neutral: {
      start: [
        "On a calm day with nothing remarkable in sight,",
        "In a quiet town where nothing ever seemed to change,",
        "On a peaceful evening where everything was in perfect balance,"
      ],
      middle: [
        "the people went about their lives, content but longing for something more.",
        "life continued as it always had, with no excitement or sorrow.",
        "there was peace, but also a yearning for something to break the monotony."
      ],
      end: [
        "In the stillness, they found meaning in the small moments.",
        "Though nothing extraordinary happened, they realized peace is its own kind of joy.",
        "They understood that even in stillness, there was room for growth and reflection."
      ]
    }
  };

  storyStart = randomElement(stories[emotion].start);
  storyMiddle = randomElement(stories[emotion].middle);
  storyEnd = randomElement(stories[emotion].end);

  return `${storyStart} ${storyMiddle} ${storyEnd}`;
}

function createSound(emotion) {
  let melody = [];
  let duration = [];

  const synth = new Tone.Synth().toDestination();

  if (emotion === "happy") {
    melody = ["C4", "E4", "G4", "C5"];
    duration = ["4n", "4n", "4n", "4n"];
  } else if (emotion === "sad") {
    melody = ["A3", "D4", "F4", "A4"];
    duration = ["2n", "2n", "2n", "2n"];
  } else if (emotion === "angry") {
    melody = ["G3", "D4", "G4", "D5"];
    duration = ["8n", "8n", "8n", "8n"];
  } else if (emotion === "disgusted") {
    melody = ["C3", "Eb4", "G#4", "C5"];
    duration = ["1n", "1n", "1n", "1n"];
  } else {
    melody = ["C4", "D4", "E4"];
    duration = ["1n"];
  }

  // Play the melody as a sequence
  const part = new Tone.Part((time, note) => {
    synth.triggerAttackRelease(note, "8n", time);
  }, melody.map((note, index) => [index * Tone.Time(duration[index]), note]));

  part.start(0);
  Tone.Transport.start();
}

Tone.Transport.bpm.value = 120;

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

document.getElementById('refresh-button').addEventListener('click', () => {
  storyLocked = false;
  currentEmotion = null;
});
