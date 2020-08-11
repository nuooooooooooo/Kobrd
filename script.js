const korean = { content: "가 나 다 라 마 바 사" };
const textDisplayElement = document.getElementById("textDisplay");
const textInputElement = document.getElementById("textInput");

textInputElement.addEventListener("input", () => {
  const arrayText = textDisplayElement.querySelectorAll("span"); // selects all quote elements in tDE
  const arrayValue = textInputElement.value.split("").map((char) => {
    if (char === " ") {
      char = "␣";
    }
    return char;
  });

  textInputElement.addEventListener("keyup", logKey);

  function logKey(key) {
    console.log(key.code);
    let value = key.code;
    const focusedKey = document.getElementById(value);
    focusedKey.classList.add("key-on-focus");
    setTimeout(RemoveClass, 300);

    function RemoveClass() {
      focusedKey.classList.remove("key-on-focus");
    }
  }

  arrayText.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      // if character has not been typed yet
      characterSpan.classList.remove("wrong-input");
      characterSpan.classList.remove("correct-input");
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct-input");
      characterSpan.classList.remove("wrong-input");
    } else {
      characterSpan.classList.add("wrong-input");
      characterSpan.classList.remove("correct-input");
    }
  });
});

function getKoreanText() {
  const text = korean.content;
  textDisplayElement.innerhtml = "";
  text.split("").forEach((char) => {
    if (char === " ") {
      char = "␣";
    }
    const characterSpan = document.createElement("span"); //*
    characterSpan.innerText = char; //*
    textDisplayElement.appendChild(characterSpan); //* these three work together
  }); // each syllable is a span
  textInputElement.value = null; // clears value when we get new text
}

getKoreanText();
