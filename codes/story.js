let currentEmotion = null; // 用于锁定情绪状态
let storyLocked = false;   // 是否锁定故事

// 启动视频流并加载模型
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
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (detections.length > 0) {
            const emotions = detections[0].expressions;
            if (!storyLocked) {
                updateEmotionBar(emotions);
                generateRandomStory(emotions);
            }
        }
    }, 100);
});

// 更新情绪条
function updateEmotionBar(emotions) {
    const emotionBar = document.getElementById('emo-bar');
    const positiveEmotion = emotions.happy;
    const negativeEmotion = emotions.sad + emotions.angry + emotions.disgusted;

    if (positiveEmotion > negativeEmotion) {
        emotionBar.value = Math.min(100, emotionBar.value + 10); // 增加
    } else {
        emotionBar.value = Math.max(0, emotionBar.value - 10);   // 减少
    }
}

// 随机生成故事
function generateRandomStory(emotions) {
    let detectedEmotion = getDetectedEmotion(emotions);
    
    // 如果情绪变化，则锁定并生成故事
    if (detectedEmotion !== currentEmotion) {
        currentEmotion = detectedEmotion;
        storyLocked = true;

        const storyText = document.getElementById('storyText');
        const story = generateStoryBasedOnEmotion(currentEmotion);
        storyText.innerText = story;
    }
}

// 获取当前情绪的类型
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

// 根据情绪生成不同的随机故事
function generateStoryBasedOnEmotion(emotion) {
    let storyStart = "";
    let storyMiddle = "";
    let storyEnd = "";

    // 不同情绪对应不同的故事起始、中间和结尾
    const happyStart = [
        "In a world full of joy and laughter,",
        "On a bright and sunny morning,",
        "Once upon a time, in a village of happiness,"
    ];
    const happyMiddle = [
        "the villagers were always smiling and sharing stories with each other.",
        "the flowers bloomed as if they were dancing with the wind.",
        "everyone gathered to celebrate the joy of life, their hearts filled with love."
    ];
    const happyEnd = [
        "And so, the day ended with everyone sleeping under the stars, their hearts warm.",
        "The sun set, but the joy in their hearts would carry them through any challenge ahead.",
        "They knew that no matter what came their way, together they would always find happiness."
    ];

    const sadStart = [
        "In a small, rainy town,",
        "On a cold and quiet night,",
        "Once upon a time, there was a village covered in endless grey clouds,"
    ];
    const sadMiddle = [
        "the villagers wandered aimlessly, their hearts heavy with sorrow.",
        "the rain never seemed to stop, mirroring the tears of those who lived there.",
        "people moved slowly, burdened by memories of better days now long gone."
    ];
    const sadEnd = [
        "Yet, even in the darkest of nights, a single light flickered in the distance, offering hope.",
        "But through their sadness, they realized that after every storm comes a new beginning.",
        "Even as the rain fell, there was a promise of sunshine waiting on the horizon."
    ];

    const angryStart = [
        "In the midst of a brewing storm,",
        "Under the shadow of a growing conflict,",
        "In a land torn by chaos and fury,"
    ];
    const angryMiddle = [
        "the people fought endlessly, their anger fueling the fire that consumed them.",
        "tempers flared as every argument seemed to lead to a new battle.",
        "there was no peace, only the burning desire for vengeance and power."
    ];
    const angryEnd = [
        "But as the fires burned out, they realized that peace was the only true path forward.",
        "In the ashes of their fury, they found a new resolve to build something better.",
        "Even in the midst of rage, there was a glimmer of understanding that could heal all wounds."
    ];

    const disgustedStart = [
        "In a land plagued by corruption and decay,",
        "Amidst the foul stench of betrayal and lies,",
        "In a world that had lost its moral compass,"
    ];
    const disgustedMiddle = [
        "people turned away from the sight of what their land had become.",
        "there was no trust left, only disgust for what had once been beautiful.",
        "the ground beneath them seemed to rot, much like the values they had abandoned."
    ];
    const disgustedEnd = [
        "But from the decay, a new seed of change was planted, offering hope for renewal.",
        "Even in the darkest times, there were those who believed that things could change.",
        "They knew that only by confronting their own disgust could they hope to rebuild."
    ];

    const neutralStart = [
        "On a calm and peaceful day,",
        "In a quiet and serene village,",
        "In a world where everything was perfectly balanced,"
    ];
    const neutralMiddle = [
        "the people went about their lives, content but unremarkable.",
        "there were no great highs or lows, just a steady rhythm of life.",
        "everything moved in harmony, though some wished for a little more excitement."
    ];
    const neutralEnd = [
        "But in the quiet, they found a deeper meaning to their everyday actions.",
        "Though nothing extraordinary happened, they found peace in the simple things.",
        "They realized that in the stillness of life, there is room for personal growth."
    ];

    // 根据情绪选择不同的故事段落
    if (emotion === "happy") {
        storyStart = randomElement(happyStart);
        storyMiddle = randomElement(happyMiddle);
        storyEnd = randomElement(happyEnd);
    } else if (emotion === "sad") {
        storyStart = randomElement(sadStart);
        storyMiddle = randomElement(sadMiddle);
        storyEnd = randomElement(sadEnd);
    } else if (emotion === "angry") {
        storyStart = randomElement(angryStart);
        storyMiddle = randomElement(angryMiddle);
        storyEnd = randomElement(angryEnd);
    } else if (emotion === "disgusted") {
        storyStart = randomElement(disgustedStart);
        storyMiddle = randomElement(disgustedMiddle);
        storyEnd = randomElement(disgustedEnd);
    } else {
        storyStart = randomElement(neutralStart);
        storyMiddle = randomElement(neutralMiddle);
        storyEnd = randomElement(neutralEnd);
    }

    return `${storyStart} ${storyMiddle} ${storyEnd}`;
}

// 随机选择数组中的一个元素
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
