let currentCategoryIndex = -1;
let currentQuestionIndex = -1;
let currentQuestionPoints = 0;

document.addEventListener("DOMContentLoaded", function () {
  renderBoard();
  renderTeams();
});

function createTeamHtml(team, index, isModal = false) {
  const extraClick = isModal ? "; syncScoresFromModal();" : "";

  return `
    <div class="team">
      <input class="team-name" value="${escapeHtml(team.name || `Team ${index + 1}`)}">
      <input class="score" type="text" value="${escapeHtml(team.score || "0")}">
      <div class="team-controls">
        <button onclick="changeTeamScore(this, 1)${extraClick}">+</button>
        <button onclick="changeTeamScore(this, -1)${extraClick}">-</button>
      </div>
    </div>
  `;
}

function renderTeams() {
  const mainScoreboard = document.getElementById("main-scoreboard");
  if (!mainScoreboard) return;

  mainScoreboard.innerHTML = teamData
    .map((team, index) => createTeamHtml(team, index, false))
    .join("");

  document.querySelectorAll("#main-scoreboard .team-name, #main-scoreboard .score").forEach((input) => {
    input.addEventListener("input", saveTeamData);
    input.addEventListener("change", saveTeamData);
  });
}

function addTeam() {
  saveTeamData();

  if (teamData.length >= MAX_TEAMS) {
    alert("Maximum 10 teams allowed.");
    return;
  }

  teamData.push({
    name: `Team ${teamData.length + 1}`,
    score: "0"
  });

  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));
  renderTeams();

  if (!document.getElementById("question-modal").classList.contains("hidden")) {
    renderModalScoreboard();
  }
}

function removeTeam() {
  saveTeamData();

  if (teamData.length <= MIN_TEAMS) {
    alert("At least 1 team is required.");
    return;
  }

  teamData.pop();

  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));
  renderTeams();

  if (!document.getElementById("question-modal").classList.contains("hidden")) {
    renderModalScoreboard();
  }
}

function renderModalScoreboard() {
  saveTeamData();

  const modalScoreboard = document.getElementById("modal-scoreboard");
  if (!modalScoreboard) return;

  modalScoreboard.innerHTML = teamData
    .map((team, index) => createTeamHtml(team, index, true))
    .join("");

  document.querySelectorAll("#modal-scoreboard .team-name, #modal-scoreboard .score").forEach((input) => {
    input.addEventListener("input", syncScoresFromModal);
    input.addEventListener("change", syncScoresFromModal);
  });
}

function syncScoresFromModal() {
  const modalTeams = document.querySelectorAll("#modal-scoreboard .team");

  teamData = Array.from(modalTeams).map((modalTeam, index) => ({
    name: modalTeam.querySelector(".team-name").value || `Team ${index + 1}`,
    score: modalTeam.querySelector(".score").value || "0"
  }));

  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));
  renderTeams();
}

function renderBoard() {
  const columnCount = getColumnCount();
  const rowCount = getRowCount();
  const categoryContainer = document.getElementById("play-categories");
  const board = document.getElementById("play-board");

  if (!categoryContainer || !board) return;

  categoryContainer.style.setProperty("--cols", columnCount);
  board.style.setProperty("--cols", columnCount);
  board.style.setProperty("--rows", rowCount);

  categoryContainer.innerHTML = gameData
    .map((category) => `<div>${escapeHtml(category.category)}</div>`)
    .join("");

  let cells = "";

  for (let questionIndex = 0; questionIndex < rowCount; questionIndex++) {
    for (let categoryIndex = 0; categoryIndex < columnCount; categoryIndex++) {
      const question = gameData[categoryIndex].questions[questionIndex];
      const classes = question.answered ? "cell answered" : "cell";

      cells += `
        <button class="${classes}" onclick="loadQuestion(${categoryIndex}, ${questionIndex})">
          ${escapeHtml(question.points)}
        </button>
      `;
    }
  }

  board.innerHTML = cells;
}

function loadQuestion(categoryIndex, questionIndex) {
  currentCategoryIndex = categoryIndex;
  currentQuestionIndex = questionIndex;

  const selectedQuestion = gameData[categoryIndex].questions[questionIndex];
  currentQuestionPoints = selectedQuestion.dailyDouble
    ? selectedQuestion.points * 2
    : selectedQuestion.points;

  const modal = document.getElementById("question-content");

  if (selectedQuestion.questionMedia) {
    modal.classList.add("has-media");
  } else {
    modal.classList.remove("has-media");
  }

  document.getElementById("question-text").textContent =
    selectedQuestion.question || "No question text added.";

  renderMedia(
    "question-media",
    selectedQuestion.questionMedia,
    selectedQuestion.questionMediaType
  );

  if (selectedQuestion.dailyDouble) {
    showDailyDoubleAnimation();
  }

  document.getElementById("answer-text").textContent =
    selectedQuestion.answer || "No answer added.";

  document.getElementById("answer-reveal").classList.add("hidden");
  renderModalScoreboard();
  document.getElementById("question-modal").classList.remove("hidden");
}

function changeTeamScore(button, direction) {
  const teamBox = button.closest(".team");
  const scoreInput = teamBox.querySelector(".score");

  const currentScore = parseInt(scoreInput.value) || 0;
  scoreInput.value = currentScore + currentQuestionPoints * direction;

  saveTeamData();
}

function revealAnswer() {
  const selectedQuestion = gameData[currentCategoryIndex].questions[currentQuestionIndex];

  selectedQuestion.answered = true;

  document.getElementById("answer-reveal").classList.remove("hidden");

  saveGameData();
  renderBoard();
}

function closeQuestion() {
  document.getElementById("question-modal").classList.add("hidden");
}

function showDailyDoubleAnimation() {
  const popup = document.getElementById("daily-double-popup");

  popup.classList.remove("hidden");
  popup.classList.remove("daily-double-animate");

  void popup.offsetWidth;

  popup.classList.add("daily-double-animate");

  setTimeout(function () {
    popup.classList.add("hidden");
    popup.classList.remove("daily-double-animate");
  }, 3000);
}
