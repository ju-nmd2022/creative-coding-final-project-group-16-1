const emotionBar = document.getElementById('emotion-bar');
let emotionScore = 50; // emotion score

export function emotionbarLevel(emotions) {
  const positiveEmotion = emotions.happy;
  const negativeEmotion = emotions.sad + emotions.angry + emotions.disgusted;

  if (positiveEmotion > negativeEmotion) {
    emotionBar.value = Math.min(100, emotionBar.value + 10); // increases if positive
  } else {
    emotionBar.value = Math.max(0, emotionBar.value - 10); // decreases if negative
  }
}