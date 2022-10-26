const levels = [
  "ㅁ,ㄹ,ㅓ,ㅏ",
  "ㄴ,ㅣ",
  "ㅇ",
  "ㅎ,ㅗ",
  "ㅂ,ㅃ,ㅔ,ㅖ",
  "ㅈ,ㅉ,ㅐ,ㅒ",
  "ㄷ,ㄸ,ㅑ",
  "ㄱ,ㄲ,ㅕ",
  "ㅅ,ㅆ,ㅛ",
  "ㅋ,ㅡ,ㅌ",
  "ㅊ,ㅜ",
  "ㅍ,ㅠ",
];

let my_url = './data.json'

const fetchData = async (url) => {
  try {
    let response = await fetch(url);
    return response.json()
  } catch (error) {
    //console.log(error);
  }
};


const textDisplayElement = document.getElementById("textDisplay");
const textInputElement = document.getElementById("textInput");
const progressBar = document.getElementById("progressBar");
let wpm = document.getElementById("wpm");
let startTime, endTime, totalTime;
let started = false;
let complete = false;
let now, stringCount, wordCount, currentWpm;

textInputElement.addEventListener("input", () => {
  if (!started) {
    startTime = new Date();
    started = true;
    complete = false;
  }
  now = currentTime();
  const arrayText = textDisplayElement.querySelectorAll("span"); // selects all quote elements in tDE
  const arrayValue = textInputElement.value.split("").map((char) => {
    if (char === " ") {
      char = "␣";
    }
    return char;
  });
  let correct = true;
  stringCount = (string) => string.split("").filter((e) => e).length;
  wordCount = stringCount(textInputElement.value); // word count of currently input text
  testLength = stringCount(loadedText);

  //fill progress bar based on progress
  let completionPercentage = (wordCount / testLength) * 100;
  progressBar.style.width = `${completionPercentage}%`;

  // gives different colours depending on correctness
  arrayText.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      // if character has not been typed yet
      characterSpan.classList.remove("wrong-input");
      characterSpan.classList.remove("correct-input");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct-input");
      characterSpan.classList.remove("wrong-input");
    } else {
      characterSpan.classList.add("wrong-input");
      characterSpan.classList.remove("correct-input");
      correct = false;
    }
  });

  if (correct) {
    renderKoreanText();
  }

  if (wordCount === testLength) {
    endTime = new Date();
  }
  currentWpm = Math.floor(wordCount / 2.65 / (now / 60));
  if (currentWpm !== Infinity && !isNaN(currentWpm)) {
    wpm.innerHTML = `WPM: ${currentWpm}`;
  } else {
    wpm.innerHTML = "WPM: 50";
  }
  if (endTime && !complete && correct) {
    totalTime = (endTime - startTime) / 1000;
    complete = true;
    started = false;
    progressBar.style.width = `0%`;
  }
});

// stores selected option in session storage so the dropdown list also works in chrome
const dropdownList = document.getElementById("levelSelector");
let secondLoad = sessionStorage.getItem("Loaded");
if (secondLoad) {
  document.getElementById("levelSelector").value =
    sessionStorage.getItem("selectedLevel");
}

let key = dropdownList.options[dropdownList.selectedIndex].value;

function storeMe(obj) {
  sessionStorage.setItem("selectedLevel", obj.options[obj.selectedIndex].value);
  secondLoad = true;
  sessionStorage.setItem("Loaded", secondLoad.value);
}

let currentLevel = document.getElementById("currentLevel");
function displayLevel() {
  if (key <= 12) {
    currentLevel.innerHTML = `Level ${key}: ${levels[key - 1]} `;
  } else if (key === 13) {
    currentLevel.innerHTML = "Game Mode";
  } else {
    currentLevel.innerHTML = `교보드`;
  }
}

// make multidimensional array for each ex for case 3 [[KeyD][KeyS,KeyL]]
let keyCodes = [];
let keyOff = [];
function keyColours() {
  switch (Number(key)) {
    case 1:
      keyCodes = ["KeyA", "KeyF", "KeyJ", "KeyK"];
      keyOff = [];
      break;
    case 2:
      keyCodes = ["KeyS", "KeyL"];
      keyOff = ["KeyA", "KeyF", "KeyJ", "KeyK"];
      break;
    case 3:
      keyCodes = ["KeyD"];
      keyOff = ["KeyS", "KeyL"];
      break;
    case 4:
      keyCodes = ["KeyG", "KeyH"];
      keyOff = ["KeyD"];
      break;
    case 5:
      keyCodes = ["KeyQ", "KeyP"];
      keyOff = ["KeyG", "KeyH"];
      break;
    case 6:
      keyCodes = ["KeyW", "KeyO"];
      keyOff = ["KeyQ", "KeyP"];
      break;
    case 7:
      keyCodes = ["KeyE", "KeyI"];
      keyOff = ["KeyW", "KeyO"];
      break;
    case 8:
      keyCodes = ["KeyR", "KeyU"];
      keyOff = ["KeyE", "KeyI"];
      break;
    case 9:
      keyCodes = ["KeyT", "KeyY"];
      keyOff = ["KeyR", "KeyU"];
      break;
    case 10:
      keyCodes = ["KeyZ", "KeyM", "KeyX"];
      keyOff = ["KeyT", "KeyY"];
      break;
    case 11:
      keyCodes = ["KeyC", "KeyN"];
      keyOff = ["KeyZ", "KeyM", "KeyX"];
      break;
    case 12:
      keyCodes = ["KeyV", "KeyB"];
      keyOff = ["KeyC", "KeyN"];
      break;
    default:
      keyCodes = [];
  }

  for (let i = 0; i < keyCodes.length; i++) {
    document
      .getElementById(`${keyCodes[i]}`)
      .classList.add("current-lesson-keys");
  }
  for (let i = 0; i < keyOff.length; i++) {
    document
      .getElementById(`${keyOff[i]}`)
      .classList.remove("current-lesson-keys");
  }
}

let korean = {}
let index;
let encouragingWords = document.getElementById("encouragements");
async function getKoreanText() {

  korean = await fetchData(my_url);
  let text = korean[key]
  let gameText = [];
  if (key > 13) {
    return "You reached the end.";
  } else if (key == 13) {
    while (gameText.length < 10) {
      gameText.push(text[getRandomInt(999)]);
    }
    gameText.push("");
    return gameText.join(" ");
  }
  index = korean.encouragements.length;
  encouragingWords.innerHTML = korean.encouragements[getRandomInt(index)];
  setTimeout(() => {
    encouragingWords.innerHTML = "";
  }, 3000);
  return text;
}

// makes it possible for the user to select another level based on the dropdown
toNewLevel.addEventListener("click", () => location.reload());


let loadedText;

// display text on screen and parse text into array
async function renderKoreanText() {
  textDisplayElement.innerHTML = "";
  displayLevel();
  keyColours();

  const text = await getKoreanText();
  loadedText = text;
  if (key < 13) {
    key++;
  }

  text.split("").forEach((char) => {
    if (char === " ") {
      char = "␣";
    }
    const characterSpan = document.createElement("span"); //*
    characterSpan.innerText = char; //*
    textDisplayElement.appendChild(characterSpan); //* these three work together
  }); // each syllable is a span
  textInputElement.value = ""; // clears value when we get new text
}

// function so the pressed keys change colour
textInputElement.addEventListener("keyup", logKey);
function logKey(key) {
  let value = key.code;
  const focusedKey = document.getElementById(value);
  focusedKey.classList.add("key-on-focus");
  setTimeout(RemoveClass, 300);

  function RemoveClass() {
    focusedKey.classList.remove("key-on-focus");
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function currentTime() {
  return Math.floor((new Date() - startTime) / 1000); // time in seconds
}

const btn = document.querySelector(".keybr-btn");
const keybrDisplay = document.querySelector(".keybr-container");
btn.addEventListener("click", function () {
  if (!btn.classList.contains("slide")) {
    btn.classList.add("slide");
    btn.classList.add("inactive-switch");
    keybrDisplay.style.opacity = "0";
  } else {
    btn.classList.remove("slide"); //to reset the button
    btn.classList.remove("inactive-switch");
    keybrDisplay.style.opacity = "1";
  }
});

renderKoreanText();
