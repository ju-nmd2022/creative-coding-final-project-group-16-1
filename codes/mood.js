// system's mood
function getMood() {
  const currentHour = new Date().getHours();
  
  if (currentHour >= 6 && currentHour < 9) {
    return "tired";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "energetic";
  } else if (currentHour >= 20 && currentHour < 24) {
    return "calm";
  } else {
    return "neutral";
  }
}

// response
export function response(emotions) {
  const currentMood = getMood();  
  let responseMessage = "";  
  
  // let chance = Math.floor(Math.random() * 10) + 1; // Fixed random number generation
  
  if (currentMood === "tired") {
    confirm ("Ugh, mornings… Are you as tired as I am?");
  } else if (currentMood === "energetic") {
    confirm ("Hey! Look at you, full of energy!");
  } else if (currentMood === "calm") {
    confirm ("It’s getting late, isn't it? Time to wind down…");
  } else {
    responseMessage += "How are you feeling?";
  }

  // responses based on emotions
  if (emotions.happy > 0.5) {
    responseMessage += " You seem happy though, that's awesome!";
  } else if (emotions.sad > 0.5) {
    responseMessage += " Aww, don't be sad. Everything will get better!";
  } else if (emotions.angry > 0.8) {
    responseMessage += " Hey, are you feeling good? Can I help you with something?";
  } else if (emotions.disgusted > 0.9) {
    responseMessage += " Hmm, you seem disgusted. Let's shift that mood!";
  }
  return responseMessage;  
}
