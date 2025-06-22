let points = 0;
let level = 1;
let monsterHP = 50;
const hpPerLevel = [0, 50, 80, 120, 150, 200];
let timer;
let timeLeft = 30;
const timePerLevel = [0, 30, 25, 20, 15, 10];
let isPaused = false;

const victorySound = document.getElementById("victory-sound");
const levelVictorySound = document.getElementById("level-victory-sound");
const bgMusic = document.getElementById("background-music");
const timeUpSound = document.getElementById("time-up-sound");

let currentQuestion = {};

// AI-like categorized question bank
const questionBank = {
  1: [
    { q: "What is 5 + 3?", a: "8" },
    { q: "Value of 2 * 6?", a: "12" },
    { q: "Result of 10 - 4?", a: "6" }
  ],
  2: [
    { q: "What is the length of 'hello'?", a: "5" },
    { q: "'abc' + 'def' = ?", a: "abcdef" },
    { q: "'python'.toUpperCase() = ?", a: "PYTHON" }
  ],
  3: [
    { q: "Find the largest in [5,3,9]:", a: "9" },
    { q: "[1,2,3][1] = ?", a: "2" },
    { q: "Sum of [1,2,3]?", a: "6" }
  ],
  4: [
    { q: "What is 10 % 3?", a: "1" },
    { q: "True and False = ?", a: "False" },
    { q: "Result of 5 > 2?", a: "True" }
  ],
  5: [
    { q: "Factorial of 4?", a: "24" },
    { q: "Reverse of 'code'?", a: "edoc" },
    { q: "2**3 = ?", a: "8" }
  ]
};

function login() {
  const username = document.getElementById("username").value;
  if (username.trim() === "") {
    alert("Please enter a username!");
    return;
  }

  bgMusic.volume = 0.4;
  bgMusic.play();

  document.getElementById("player-name").textContent = username;
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  startLevel();
  loadQuestion();
}

function startLevel() {
  if (level > 5) {
    endGame(true);
    return;
  }
  monsterHP = hpPerLevel[level];
  points = 0;
  document.getElementById("level").textContent = level;
  document.getElementById("monster-hp").textContent = monsterHP;
  document.getElementById("points").textContent = points;
  document.getElementById("battle-msg").textContent = `Level ${level} - defeat the monster!`;
  document.getElementById("monster-img").src = "https://i.imgur.com/L3CkAAn.png";

  timeLeft = timePerLevel[level];
  updateTimeBar();
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);

  loadQuestion();
}

function loadQuestion() {
  const levelQuestions = questionBank[level];
  const randomIndex = Math.floor(Math.random() * levelQuestions.length);
  currentQuestion = levelQuestions[randomIndex];
  document.getElementById("question").textContent = currentQuestion.q;
}

function submitAnswer() {
  const answer = document.getElementById("answer").value.trim();
  if (answer === "") return alert("Please enter your answer!");

  if (answer === currentQuestion.a) {
    points += 10;
    document.getElementById("points-msg").textContent = "Correct! +10 points";
  } else {
    document.getElementById("points-msg").textContent = "Incorrect!";
  }

  document.getElementById("points").textContent = points;
  document.getElementById("answer").value = "";
  loadQuestion();
}

function attack() {
  if (points === 0) {
    document.getElementById("battle-msg").textContent = "You have no points!";
    return;
  }

  monsterHP -= points;
  points = 0;
  document.getElementById("points").textContent = points;

  if (monsterHP <= 0) {
    document.getElementById("monster-hp").textContent = 0;
    document.getElementById("battle-msg").textContent = `You defeated Level ${level} monster!`;
    document.getElementById("monster-img").src = "https://i.imgur.com/ZkA5R1B.png";

    clearInterval(timer);

    levelVictorySound.currentTime = 0;
    levelVictorySound.play();

    setTimeout(() => {
      levelVictorySound.pause();
      levelVictorySound.currentTime = 0;

      if (level < 5) {
        if (confirm(`You defeated Level ${level}! Do you want to continue to Level ${level + 1}?`)) {
          level++;
          startLevel();
        } else {
          endGame(true);
        }
      } else {
        endGame(true);
      }

    }, 2000);

  } else {
    document.getElementById("monster-hp").textContent = monsterHP;
    document.getElementById("battle-msg").textContent = `Monster has ${monsterHP} HP left.`;
  }
}

function updateTimer() {
  if (isPaused) return;
  timeLeft--;
  updateTimeBar();
  if (timeLeft <= 0) {
    clearInterval(timer);
    document.getElementById("battle-msg").textContent = "⏰ Time's up!";
    document.getElementById("monster-img").src = "https://i.imgur.com/1WjNPNt.png";
    timeUpSound.play();
    endGame(false);
  }
}

function updateTimeBar() {
  document.getElementById("time-bar").style.width = (timeLeft / timePerLevel[level]) * 100 + "%";
}

function endGame(victory) {
  clearInterval(timer);
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("game-over-screen").style.display = "flex";

  if (victory) {
    document.getElementById("final-msg").textContent = "🎉 Congratulations! You defeated all monsters!";
    bgMusic.volume = 0.1;
    victorySound.play();
  } else {
    document.getElementById("final-msg").textContent = `You reached Level ${level}. Better luck next time!`;
  }
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
    document.getElementById("music-toggle").textContent = "Mute Music";
  } else {
    bgMusic.pause();
    document.getElementById("music-toggle").textContent = "Unmute Music";
  }
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pause-btn").textContent = isPaused ? "Resume" : "Pause";
}
