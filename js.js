const buttons = document.querySelectorAll(".btn");
const choices = ["rock", "paper", "scissors"];

const playerChoice = document.querySelector("#player1");
const computerChoice = document.querySelector("#player2");
const results = document.querySelector("#result");

const MyScore = document.querySelector("#YourScore");
const ComputerScore = document.querySelector("#ComputerScore");
const roundNumber = document.querySelector("#round");

const playAgainButton = document.querySelector("#again");
const themeBtn = document.querySelector("#themeBtn");

const playerCircle = document.querySelector("#playerCircle");
const computerCircle = document.querySelector("#computerCircle");

const history = document.querySelector("#History");

/* Sounds */
const winSound = new Audio("sounds/Game Win.mp3");
const drawSound = new Audio("sounds/Fail.mp3");
const clickSound = new Audio("sounds/ButtonClick.mp3");

/* Objects */
const icons = {
  rock: '<i class="fa-solid fa-hand-back-fist"></i>',
  paper: '<i class="fa-solid fa-hand"></i>',
  scissors: '<i class="fa-solid fa-hand-scissors"></i>',
};

const rules = {
  rock: "paper",
  paper: "scissors",
  scissors: "rock",
};

const historyIcons = {
  wins: '<i class="fa-solid fa-trophy"></i>',
  losses: '<i class="fa-solid fa-xmark"></i>',
  draws: '<i class="fa-solid fa-handshake"></i>',
};

/* Game state */
let rounds = 0;
let meScore = 0;
let computerScore = 0;

/* Persistent stats */
let stats = JSON.parse(localStorage.getItem("stats")) || {
  wins: 0,
  losses: 0,
  draws: 0,
};

/* Initial UI */
updateScore();
updateHistory();
loadTheme();

/* Functions */
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function updateScore() {
  MyScore.innerText = "0" + meScore;
  ComputerScore.innerText = "0" + computerScore;
  roundNumber.innerText = rounds + "/3";
}

function updateChoices(player, cpu) {
  playerChoice.innerHTML = `${icons[player]}<span>${player}</span>`;
  computerChoice.innerHTML = `${icons[cpu]}<span>${cpu}</span>`;
}

function getComputerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function clearGlow() {
  playerCircle.classList.remove("win-glow", "lose-glow", "draw-glow");
  computerCircle.classList.remove("win-glow", "lose-glow", "draw-glow");
}

function animateChoices() {
  playerChoice.classList.add("animate");
  computerChoice.classList.add("animate");

  setTimeout(() => {
    playerChoice.classList.remove("animate");
    computerChoice.classList.remove("animate");
  }, 300);
}

function saveStats() {
  localStorage.setItem("stats", JSON.stringify(stats));
}

function updateHistory() {
  history.innerHTML = `
    <div>${historyIcons.wins} Wins: ${stats.wins}</div>
    <div>${historyIcons.losses} Losses: ${stats.losses}</div>
    <div>${historyIcons.draws} Draws: ${stats.draws}</div>
  `;
}

function updateStats(type) {
  stats[type]++;
  saveStats();
  updateHistory();
}

function whoWins(me, computer) {
  clearGlow();

  if (me === computer) {
    results.innerText = "draw";
    playerCircle.classList.add("draw-glow");
    computerCircle.classList.add("draw-glow");
    updateStats("draws");
  } else if (rules[me] === computer) {
    results.innerText = "computer win";
    computerScore++;
    playerCircle.classList.add("lose-glow");
    computerCircle.classList.add("win-glow");
    updateStats("losses");
  } else {
    results.innerText = "you win";
    meScore++;
    playerCircle.classList.add("win-glow");
    computerCircle.classList.add("lose-glow");
    updateStats("wins");
  }

  if (rounds === 3) {
    if (meScore > computerScore) {
      results.innerText = "you win | game over";
      playSound(winSound);
    } else if (meScore < computerScore) {
      results.innerText = "computer win | game over";
      playSound(drawSound);
    } else {
      results.innerText = "draw | game over";
      playSound(drawSound);
    }

    disableButtons();
  }
}

function resetGame() {
  rounds = 0;
  meScore = 0;
  computerScore = 0;

  updateScore();

  playerChoice.innerText = "?";
  computerChoice.innerText = "?";
  results.innerText = "Choose one";

  enableButtons();
  clearGlow();
}

function disableButtons() {
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

function enableButtons() {
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  updateThemeButton();
}

function updateThemeButton() {
  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light mode';
  } else {
    localStorage.setItem("theme", "dark");
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark mode';
  }
}

/* Events */
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (rounds < 3) {
      playSound(clickSound);

      const me = button.dataset.choice;
      const computer = getComputerChoice();

      rounds++;

      updateChoices(me, computer);
      animateChoices();
      whoWins(me, computer);
      updateScore();
    }
  });
});

playAgainButton.addEventListener("click", () => {
  resetGame();
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  updateThemeButton();
});