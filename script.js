// Firebase Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyAJ52b330dLaXxZPcLPx8tt7jdl0sdB-2k",
  authDomain: "wortartenspiele.firebaseapp.com",
  projectId: "wortartenspiele",
  storageBucket: "wortartenspiele.appspot.com",
  messagingSenderId: "625097154932",
  appId: "1:625097154932:web:9e0d78a7b0d8e8e81e05d7",
  databaseURL: "https://wortartenspiele-default-rtdb.europe-west1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const vocab = [
  { english: "Clothing", german: "Kleidung" },
  { english: "Jumper", german: "Pullover" },
  { english: "Shoes", german: "Schuhe" },
  { english: "Trousers / Pants", german: "Hose" },
  { english: "Blouse", german: "Bluse" },
  { english: "Cap", german: "Mütze" },
  { english: "Belt", german: "Gürtel" },
  { english: "Watch", german: "Armbanduhr" },
  { english: "Student", german: "Schüler" },
  { english: "Sunglasses", german: "Sonnenbrille" },
  { english: "Backpack", german: "Rucksack" },
  { english: "School playground", german: "Schulhof" },
  { english: "At school", german: "In der Schule" },
  { english: "Interested", german: "Interessiert" },
  { english: "Good", german: "Gut" },
  { english: "Favourite / Favorite", german: "Lieblings-" },
  { english: "Subject", german: "Fach" },
  { english: "Maths", german: "Mathe" },
  { english: "Science", german: "Naturwissenschaften" },
  { english: "History", german: "Geschichte" },
  { english: "Art", german: "Kunst" },
  { english: "French", german: "Französisch" },
  { english: "Geography", german: "Geografie" },
  { english: "also", german: "auch" },
  { english: "Passion", german: "Leidenschaft" },
  { english: "Practice", german: "Übung" },
  { english: "Effort", german: "Anstrengung" },
  { english: "Proud", german: "Stolz" },
  { english: "Spend", german: "Verbringen" },
  { english: "Every day", german: "Jeden Tag" },
  { english: "At the weekend", german: "Am Wochenende" },
  { english: "A lot of", german: "Viele" },
  { english: "Feel", german: "Fühlen" },
  { english: "Jewellery", german: "Schmuck" },
  { english: "Exciting", german: "Spannend" },
  { english: "Passionate", german: "Leidenschaftlich" },
  { english: "Inventor", german: "Erfinder" },
  { english: "Solve a Problem", german: "Ein Problem lösen" },
  { english: "Invention", german: "Erfindung" }
];

let startTime = 0;
let timerInterval;
let currentLevel = 0;

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").innerText = `Time: ${elapsed}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  return elapsed;
}

function startLevel(level) {
  currentLevel = level;
  document.getElementById("game-container").innerHTML = "";
  startTimer();
  if (level === 1) level1();
  else if (level === 2) level2();
  else alert("Level 3 & 4 coming soon!");
}

function level1() {
  const container = document.getElementById("game-container");
  const words = vocab.sort(() => 0.5 - Math.random()).slice(0, 10);
  words.forEach(word => {
    const div = document.createElement("div");
    div.className = "draggable";
    div.draggable = true;
    div.textContent = word.english;
    div.dataset.german = word.german;
    div.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text", word.english);
    });
    container.appendChild(div);
  });
  words.forEach(word => {
    const drop = document.createElement("div");
    drop.className = "dropzone";
    drop.textContent = word.german;
    drop.addEventListener("dragover", e => e.preventDefault());
    drop.addEventListener("drop", e => {
      const eng = e.dataTransfer.getData("text");
      if (eng === word.english) {
        drop.style.background = "lightgreen";
        checkLevel1Complete();
      } else {
        drop.style.background = "lightcoral";
      }
    });
    container.appendChild(drop);
  });
}

function checkLevel1Complete() {
  const greens = [...document.querySelectorAll(".dropzone")].filter(d => d.style.background === "lightgreen").length;
  if (greens === 10) {
    const time = stopTimer();
    alert("Level 1 complete in " + time + "s!");
    db.ref(`highscores/level${currentLevel}`).push({ name: "anonymous", time });
  }
}

function level2() {
  const container = document.getElementById("game-container");
  const words = vocab.sort(() => 0.5 - Math.random()).slice(0, 10);
  words.forEach(word => {
    const div = document.createElement("div");
    div.innerHTML = `${word.english}: <input type="text" data-answer="${word.german}" />`;
    container.appendChild(div);
  });
  const button = document.createElement("button");
  button.textContent = "Check";
  button.onclick = () => {
    const inputs = container.querySelectorAll("input");
    let allCorrect = true;
    inputs.forEach(inp => {
      if (inp.value.trim().toLowerCase() !== inp.dataset.answer.toLowerCase()) {
        allCorrect = false;
        inp.style.background = "lightcoral";
      } else {
        inp.style.background = "lightgreen";
      }
    });
    if (allCorrect) {
      const time = stopTimer();
      alert("Level 2 complete in " + time + "s!");
      db.ref(`highscores/level${currentLevel}`).push({ name: "anonymous", time });
    }
  };
  container.appendChild(button);
}
