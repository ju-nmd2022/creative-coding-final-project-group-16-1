
function getMood() {
  const currentHour = new Date().getHours(); 

  if (currentHour >= 6 && currentHour < 9) {
    return "tired";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "energetic";
  } else if (currentHour >= 20 && currentHour < 24) {
    return "sleepy";
  } else {
    return "neutral";
  }
}


function randomChance() {
  const chance = Math.floor(Math.random() * 10) + 1; 

  if (chance >= 6) {
    return "positive";
  } else if (chance <= 4) {
    return "negative";
  } else {
    return "indifference";
  }
}


export function response(emotions) {
  const currentMood = getMood();
  const currentChance = randomChance();
  let responseMessage = "";  

 
  if (currentChance === "positive") {
    if (currentMood === "tired") {
      responseMessage += "Aaahnm... Good morning! How are you?";
    } else if (currentMood === "energetic") {
      responseMessage += "Good afternoon! I'm feeling full of energy!";
    } else if (currentMood === "sleepy") {
      responseMessage += "It's getting late, isn't it? Time to wind down…";
    } else {
      responseMessage += "How are you feeling?";
    }
  } 
  else if (currentChance === "negative") {
    if (currentMood === "tired") {
      responseMessage += "Ugh, mornings… Are you as tired as I am?";
    } else if (currentMood === "energetic") {
      responseMessage += "Hiiii...";
    } else if (currentMood === "sleepy") {
      responseMessage += "Ahh! Can you go to bed and leave me alone!";
    } else {
      responseMessage += "How are you feeling?";
    }
  } 
  else if (currentChance === "indifference") {
    if (currentMood === "tired") {
      responseMessage += "Morning...";
    } else if (currentMood === "energetic") {
      responseMessage += "What?";
    } else if (currentMood === "sleepy") {
      responseMessage += "...";
    } else {
      responseMessage += "Hi, how can I help?";
    }
  }


  if (emotions.happy > 0.5) {
    responseMessage += " You seem happy though, that's awesome!";
  } else if (emotions.sad > 0.5) {
    responseMessage += " Aww, don't be sad. Everything will get better!";
  } else if (emotions.angry > 0.8) {
    responseMessage += " Hey, are you feeling good? Can I help you with something?";
  } else if (emotions.disgusted > 0.9) {
    responseMessage += " Hmm, you seem disgusted. Let's shift that mood!";
  }

  
  if (!window.popupShown) {
    alert(responseMessage); 
    window.popupShown = true; 
  }
  
  return responseMessage; 
}
