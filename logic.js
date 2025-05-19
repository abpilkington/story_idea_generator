function getRandomStoryIdea() {
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    const retryText = retryTexts[Math.floor(Math.random() * retryTexts.length)];

    const genre = genres[Math.floor(Math.random() * genres.length)];
    const subgenre = subgenres[Math.floor(Math.random() * subgenres.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const character = characters[Math.floor(Math.random() * characters.length)];
    const twist = twists[Math.floor(Math.random() * twists.length)];

    const storyIdea = `${capitalizeFirstLetter(genre)} / ${capitalizeFirstLetter(subgenre)}: ${character} in ${location}, where ${twist}.`;
    
    changeStoryText(prompt, retryText, storyIdea)
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

async function changeStoryText(prompt, retryText, storyIdea) {

    // Step 1: Fade out the text
    await Promise.all([
        fadeOut("#storyIdea"),
        fadeOut("#promptIntro"),
        fadeOut("#retryBtn")
    ]);

    // Step 2: Change the text
    document.getElementById("storyIdea").innerText = storyIdea;
    document.getElementById("promptIntro").innerText = prompt;
    document.getElementById("retryBtn").innerText = retryText;
    
    // Step 3: Fade the text back in
    await Promise.all([
        fadeIn("#storyIdea"),
        fadeIn("#promptIntro"),
        fadeIn("#retryBtn")
    ]);
}

// Helper function to fade out an element
function fadeOut(selector) {
    return new Promise(resolve => {
        $(selector).fadeTo(300, 0.01, resolve); // Fade out with a 300ms duration
    });
}

// Helper function to fade in an element
function fadeIn(selector) {
    return new Promise(resolve => {
        $(selector).fadeTo(300, 1, resolve); // Fade in with a 300ms duration
    });
}

function firstLoad() {
    getRandomStoryIdea();
    document.getElementById("myButton").style.opacity = 1;
}
window.onload = firstLoad;