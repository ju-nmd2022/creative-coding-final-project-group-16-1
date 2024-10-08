function getEmoji(emotions) {
    let emoji = "";

    if (emotions.happy > 0.5) {
        emoji = "😊";  // 开心表情
    } else if (emotions.sad > 0.5) {
        emoji = "😢";  // 难过表情
    } else if (emotions.angry > 0.8) {
        emoji = "😡";  // 生气表情
    } else if (emotions.disgusted > 0.9) {
        emoji = "🤢";  // 厌恶表情
    } else {
        emoji = "😐";  // 中立表情
    }

    return emoji;
}

// 生成表情雨
function createEmojiRain(emotions) {
    const emojiContainer = document.getElementById('emojiContainer');  // 获取显示区域
    const emoji = getEmoji(emotions);  // 根据情绪获取emoji
    const emojiCount = 30;  // 控制表情雨的数量

    // 创建多个emoji并让它们下落
    for (let i = 0; i < emojiCount; i++) {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('emoji');
        emojiElement.innerText = emoji;

        // 随机生成表情的位置和大小
        emojiElement.style.left = `${Math.random() * 100}vw`;  // 随机的水平位置
        emojiElement.style.fontSize = `${30 + Math.random() * 20}px`;  // 随机字体大小

        // 将表情元素添加到容器中
        emojiContainer.appendChild(emojiElement);

        // 动画结束后移除表情元素
        emojiElement.addEventListener('animationend', () => {
            emojiElement.remove();
        });
    }
}

// 模拟情绪数据（可以根据实际的情绪检测数据替换）
const emotions = {
    happy: 0.7,   // 开心情绪
    sad: 0.1,     // 难过情绪
    angry: 0.2,   // 愤怒情绪
    disgusted: 0.05 // 厌恶情绪
};

// 调用函数生成表情雨
createEmojiRain(emotions);