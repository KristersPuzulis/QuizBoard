const CURRENT_BOARD_STORAGE_KEY = "jeopardyGameData";
const TEAM_STORAGE_KEY = "jeopardyTeamData";
const DB_NAME = "JeopardyBoardsDB";
const DB_VERSION = 1;
const BOARD_STORE_NAME = "boards";

const MIN_TEAMS = 1;
const MAX_TEAMS = 10;
const MIN_COLUMNS = 1;
const MAX_COLUMNS = 10;
const MIN_ROWS = 1;
const MAX_ROWS = 10;

let gameData = createDefaultBoard(5, 5);
let teamData = [
  { name: "Team 1", score: "0" },
  { name: "Team 2", score: "0" },
  { name: "Team 3", score: "0" },
  { name: "Team 4", score: "0" },
  { name: "Team 5", score: "0" }
];

const completeBoardTemplates = [
  {
    id: "blank-5x5",
    name: "Blank Classic Board",
    type: "Template",
    description: "A clean 5 × 5 board for starting a normal Jeopardy game.",
    getBoard: () => createDefaultBoard(5, 5)
  },
  {
    id: "blank-10x10",
    name: "Blank Huge Board",
    type: "Template",
    description: "A full 10 × 10 blank board for bigger games.",
    getBoard: () => createDefaultBoard(10, 10)
  },
  {
    id: "starter-mixed-5x5",
    name: "Starter Mixed Board",
    type: "Complete Board",
    description: "A ready-to-play 5 × 5 board with general starter questions.",
    getBoard: () => createStarterMixedBoard()
  },
  {
    id: "party-bundle",
    name: "Party Bundle",
    type: "Board Bundle",
    description: "A bundle-style starter page. For now it includes one complete party board, and more boards can be added later.",
    getBoard: () => createPartyBoard()
  }
];

function createQuestion(points) {
  return {
    points,
    question: "",
    answer: "",
    questionMedia: "",
    questionMediaType: "",
    answered: false,
    dailyDouble: false
  };
}

function createDefaultBoard(columnCount = 5, rowCount = 5) {
  return Array.from({ length: columnCount }, (_, categoryIndex) => ({
    category: `Category ${categoryIndex + 1}`,
    questions: Array.from({ length: rowCount }, (_, questionIndex) => createQuestion((questionIndex + 1) * 100))
  }));
}

function createStarterMixedBoard() {
  const board = createDefaultBoard(5, 5);
  const categories = ["Movies", "Sports", "History", "Music", "Random"];
  const questions = [
    [
      ["What movie features the quote 'May the Force be with you'?", "Star Wars"],
      ["What animated movie has a character named Shrek?", "Shrek"],
      ["What movie series features Hogwarts?", "Harry Potter"],
      ["Who is Batman's city usually called?", "Gotham City"],
      ["What movie has a giant ship that hits an iceberg?", "Titanic"]
    ],
    [
      ["How many players are on a football/soccer team on the field?", "11"],
      ["What sport uses a puck?", "Ice hockey"],
      ["How many points is a basketball free throw worth?", "1"],
      ["What country has won the most FIFA World Cups?", "Brazil"],
      ["What sport is Wimbledon known for?", "Tennis"]
    ],
    [
      ["What ancient civilization built the pyramids at Giza?", "Ancient Egypt"],
      ["Who was the first president of the United States?", "George Washington"],
      ["In which war was the Battle of Waterloo fought?", "The Napoleonic Wars"],
      ["What wall divided a German city during the Cold War?", "The Berlin Wall"],
      ["What year did World War II end?", "1945"]
    ],
    [
      ["How many strings does a standard guitar usually have?", "6"],
      ["Who is known as the King of Pop?", "Michael Jackson"],
      ["What music platform is known for playlists and wrapped summaries?", "Spotify"],
      ["What band released 'Bohemian Rhapsody'?", "Queen"],
      ["What instrument has black and white keys?", "Piano"]
    ],
    [
      ["What color do you get by mixing red and blue?", "Purple"],
      ["How many days are in a leap year?", "366"],
      ["What is the largest planet in our solar system?", "Jupiter"],
      ["What language is primarily spoken in Brazil?", "Portuguese"],
      ["What is the chemical symbol for water?", "H2O"]
    ]
  ];

  board.forEach((category, categoryIndex) => {
    category.category = categories[categoryIndex];
    category.questions.forEach((question, questionIndex) => {
      question.question = questions[categoryIndex][questionIndex][0];
      question.answer = questions[categoryIndex][questionIndex][1];
    });
  });

  return board;
}

function createPartyBoard() {
  const board = createDefaultBoard(5, 5);
  const categories = ["Internet", "Games", "Food", "Latvia", "Party"];
  const questions = [
    [
      ["What does 'LOL' usually mean online?", "Laughing out loud"],
      ["What app is known for short vertical videos?", "TikTok"],
      ["What is the name of Google's video platform?", "YouTube"],
      ["What symbol starts a hashtag?", "#"],
      ["What does Wi-Fi let devices connect to wirelessly?", "A network / internet"]
    ],
    [
      ["In chess, which piece moves in an L-shape?", "Knight"],
      ["In Monopoly, what do you collect when passing GO?", "$200"],
      ["What game has blocks called Tetriminos?", "Tetris"],
      ["What color is the 8-ball in pool?", "Black"],
      ["What game uses the phrase 'checkmate'?", "Chess"]
    ],
    [
      ["What food is usually round and topped with cheese?", "Pizza"],
      ["What drink is made from grapes?", "Wine / grape juice"],
      ["What fruit is yellow and curved?", "Banana"],
      ["What is sushi traditionally wrapped with?", "Seaweed / nori"],
      ["What do bees make?", "Honey"]
    ],
    [
      ["What is the capital of Latvia?", "Riga"],
      ["What sea is next to Latvia?", "The Baltic Sea"],
      ["What are Latvia's flag colors?", "Dark red and white"],
      ["What currency does Latvia use?", "Euro"],
      ["What Latvian city is known for its beach and music festivals?", "Liepāja / Jūrmala depending the clue"]
    ],
    [
      ["What do you usually blow out on a birthday cake?", "Candles"],
      ["What is a group photo often called?", "Selfie / group selfie"],
      ["What item is used to decorate rooms and floats in air?", "Balloon"],
      ["What song is usually sung at birthdays?", "Happy Birthday"],
      ["What do you call the person who invites guests to a party?", "Host"]
    ]
  ];

  board.forEach((category, categoryIndex) => {
    category.category = categories[categoryIndex];
    category.questions.forEach((question, questionIndex) => {
      question.question = questions[categoryIndex][questionIndex][0];
      question.answer = questions[categoryIndex][questionIndex][1];
    });
  });

  return board;
}

function getColumnCount() {
  return gameData.length;
}

function getRowCount() {
  return Math.max(...gameData.map((category) => category.questions.length), 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cloneBoardData(boardData) {
  return JSON.parse(JSON.stringify(boardData));
}

function cloneBoardWithoutMedia(boardData) {
  return boardData.map((category) => ({
    category: category.category,
    questions: category.questions.map((question) => ({
      points: question.points,
      question: question.question,
      answer: question.answer,
      answered: question.answered || false,
      dailyDouble: question.dailyDouble || false,
      questionMedia: "",
      questionMediaType: ""
    }))
  }));
}

function normalizeBoardData(inputData) {
  const rawBoard = Array.isArray(inputData) ? inputData : inputData.board;

  if (!Array.isArray(rawBoard)) {
    throw new Error("This file does not contain a valid Jeopardy board.");
  }

  const columnCount = Math.min(Math.max(rawBoard.length || 5, MIN_COLUMNS), MAX_COLUMNS);
  const maxSourceRows = Math.max(...rawBoard.map((category) => Array.isArray(category.questions) ? category.questions.length : 0), 5);
  const rowCount = Math.min(Math.max(maxSourceRows, MIN_ROWS), MAX_ROWS);

  return rawBoard.slice(0, columnCount).map((category, categoryIndex) => {
    const sourceQuestions = Array.isArray(category.questions) ? category.questions : [];

    return {
      category: String(category.category || `Category ${categoryIndex + 1}`),
      questions: Array.from({ length: rowCount }, (_, questionIndex) => {
        const sourceQuestion = sourceQuestions[questionIndex] || {};
        const fallbackPoints = (questionIndex + 1) * 100;

        return {
          points: Number(sourceQuestion.points) || fallbackPoints,
          question: String(sourceQuestion.question || ""),
          answer: String(sourceQuestion.answer || ""),
          dailyDouble: Boolean(sourceQuestion.dailyDouble),
          answered: Boolean(sourceQuestion.answered),
          questionMedia: String(sourceQuestion.questionMedia || ""),
          questionMediaType: String(sourceQuestion.questionMediaType || sourceQuestion.mediaType || "")
        };
      })
    };
  });
}

function saveGameData() {
  try {
    localStorage.setItem(CURRENT_BOARD_STORAGE_KEY, JSON.stringify(gameData));
  } catch (error) {
    localStorage.setItem(CURRENT_BOARD_STORAGE_KEY, JSON.stringify(cloneBoardWithoutMedia(gameData)));
    console.warn("Current board was saved without media because localStorage is full.");
  }
}

function loadSavedGameData() {
  const savedData = localStorage.getItem(CURRENT_BOARD_STORAGE_KEY);

  if (!savedData) return;

  try {
    const parsedData = JSON.parse(savedData);
    const normalizedBoard = normalizeBoardData(parsedData);

    gameData.length = 0;
    normalizedBoard.forEach(category => gameData.push(category));
  } catch (error) {
    console.warn("Saved current board could not be loaded.");
  }
}

function replaceCurrentBoard(newBoardData) {
  const normalizedBoard = normalizeBoardData(newBoardData);

  gameData.length = 0;
  normalizedBoard.forEach((category) => gameData.push(category));

  saveGameData();
  rerenderCurrentPage();
}

function rerenderCurrentPage() {
  if (typeof renderBoard === "function") renderBoard();
  if (typeof renderEditor === "function") renderEditor();
  if (typeof renderSavedBoardsList === "function") renderSavedBoardsList();
  if (typeof renderCompleteBoardsList === "function") renderCompleteBoardsList();
}

function getBoardExportObject() {
  return {
    type: "jeopardy-board-save",
    version: 4,
    savedAt: new Date().toISOString(),
    board: cloneBoardData(gameData)
  };
}

function openBoardsDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function () {
      const db = request.result;

      if (!db.objectStoreNames.contains(BOARD_STORE_NAME)) {
        db.createObjectStore(BOARD_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

async function getSavedBoards() {
  const db = await openBoardsDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BOARD_STORE_NAME, "readonly");
    const store = transaction.objectStore(BOARD_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = function () {
      const boards = request.result || [];
      boards.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
      resolve(boards);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

async function saveBoardRecord(boardRecord) {
  const db = await openBoardsDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BOARD_STORE_NAME, "readwrite");
    const store = transaction.objectStore(BOARD_STORE_NAME);
    const request = store.put(boardRecord);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteBoardRecord(boardId) {
  const db = await openBoardsDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BOARD_STORE_NAME, "readwrite");
    const store = transaction.objectStore(BOARD_STORE_NAME);
    const request = store.delete(boardId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function saveCurrentBoardToWebsite() {
  const defaultName = `Board ${new Date().toLocaleString()}`;
  const boardName = prompt("Name this saved board:", defaultName);

  if (boardName === null) return;

  const cleanedName = boardName.trim() || defaultName;

  try {
    await saveBoardRecord({
      id: Date.now().toString(),
      name: cleanedName,
      savedAt: new Date().toISOString(),
      board: cloneBoardData(gameData)
    });
  } catch (error) {
    alert("The board could not be saved in the website. The browser storage may be full, usually because the media files are too large.");
    return;
  }

  if (typeof renderSavedBoardsList === "function") renderSavedBoardsList();
  alert("Board saved in the website.");
}

async function loadSavedBoard(boardId, targetPage = "play.html") {
  const savedBoards = await getSavedBoards();
  const savedBoard = savedBoards.find((board) => board.id === boardId);

  if (!savedBoard) {
    alert("Saved board was not found.");
    return;
  }

  replaceCurrentBoard(savedBoard.board);
  window.location.href = targetPage;
}

async function deleteSavedBoard(boardId) {
  const savedBoards = await getSavedBoards();
  const savedBoard = savedBoards.find((board) => board.id === boardId);

  if (!savedBoard) return;
  if (!confirm(`Delete saved board "${savedBoard.name}"?`)) return;

  await deleteBoardRecord(boardId);
  if (typeof renderSavedBoardsList === "function") renderSavedBoardsList();
}

async function downloadSavedBoard(boardId) {
  const savedBoards = await getSavedBoards();
  const savedBoard = savedBoards.find((board) => board.id === boardId);

  if (!savedBoard) {
    alert("Saved board was not found.");
    return;
  }

  downloadBoardObject({
    type: "jeopardy-board-save",
    version: 4,
    savedAt: savedBoard.savedAt,
    board: savedBoard.board
  }, savedBoard.name);
}

function loadCompleteBoardTemplate(templateId, targetPage = "edit.html") {
  const template = completeBoardTemplates.find((item) => item.id === templateId);
  if (!template) return;

  if (!confirm(`Load "${template.name}"? This will replace the current board.`)) return;

  replaceCurrentBoard(template.getBoard());
  resetAnsweredBoxes(false);
  window.location.href = targetPage;
}

function downloadCompleteBoardTemplate(templateId) {
  const template = completeBoardTemplates.find((item) => item.id === templateId);
  if (!template) return;

  downloadBoardObject({
    type: "jeopardy-board-save",
    version: 4,
    savedAt: new Date().toISOString(),
    board: template.getBoard()
  }, template.name);
}

function resetAnsweredBoxes(shouldNotify = true) {
  gameData.forEach(category => {
    category.questions.forEach(question => {
      question.answered = false;
    });
  });

  saveGameData();
  rerenderCurrentPage();

  if (shouldNotify) {
    alert("Answered boxes reset.");
  }
}

function downloadBoardObject(boardObject, boardName = "jeopardy-game-save") {
  const fileContent = JSON.stringify(boardObject, null, 2);
  const blob = new Blob([fileContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  const safeName = boardName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "jeopardy-game-save";

  downloadLink.href = url;
  downloadLink.download = safeName + ".txt";

  document.body.appendChild(downloadLink);
  downloadLink.click();

  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

function downloadGameInfo() {
  downloadBoardObject(getBoardExportObject(), "jeopardy-game-save");
}

function uploadBoardTxt(file, targetPage = "play.html") {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const parsedData = JSON.parse(event.target.result);
      replaceCurrentBoard(parsedData);
      window.location.href = targetPage;
    } catch (error) {
      alert("This TXT file could not be loaded as a Jeopardy board.");
    }
  };

  reader.readAsText(file);
}

function renderMedia(containerId, mediaUrl, mediaType) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (!mediaUrl || !mediaType) return;

  if (mediaType.startsWith("image/")) {
    container.innerHTML = `<img src="${mediaUrl}" class="modal-media">`;
  } else if (mediaType.startsWith("audio/")) {
    container.innerHTML = `<audio src="${mediaUrl}" controls></audio>`;
  } else if (mediaType.startsWith("video/")) {
    container.innerHTML = `<video src="${mediaUrl}" class="modal-media" controls></video>`;
  } else {
    container.innerHTML = `<p>Unsupported media type.</p>`;
  }
}

function saveTeamData() {
  const teams = document.querySelectorAll("#main-scoreboard .team");

  if (teams.length === 0) {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));
    return;
  }

  teamData = Array.from(teams).map((team, index) => ({
    name: team.querySelector(".team-name").value || `Team ${index + 1}`,
    score: team.querySelector(".score").value || "0"
  }));

  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));
}

function loadTeamData() {
  const savedTeams = localStorage.getItem(TEAM_STORAGE_KEY);

  if (savedTeams) {
    try {
      const parsedTeams = JSON.parse(savedTeams);

      if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
        teamData = parsedTeams.slice(0, MAX_TEAMS).map((team, index) => ({
          name: String(team.name || `Team ${index + 1}`),
          score: String(team.score || "0")
        }));
      }
    } catch (error) {
      console.warn("Saved teams could not be loaded.");
    }
  }

  if (typeof renderTeams === "function") renderTeams();
}

function resetTeamScores() {
  if (typeof saveTeamData === "function") saveTeamData();

  teamData = teamData.map((team, index) => ({
    name: team.name || `Team ${index + 1}`,
    score: "0"
  }));

  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));

  if (typeof renderTeams === "function") renderTeams();
  if (typeof renderModalScoreboard === "function") renderModalScoreboard();

  alert("Team scores reset.");
}

function resetTeamsToDefault() {
  if (!confirm("Reset teams to the default 5 teams and clear team scores?")) return;

  teamData = [
    { name: "Team 1", score: "0" },
    { name: "Team 2", score: "0" },
    { name: "Team 3", score: "0" },
    { name: "Team 4", score: "0" },
    { name: "Team 5", score: "0" }
  ];

  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));

  if (typeof renderTeams === "function") renderTeams();
  if (typeof renderModalScoreboard === "function") renderModalScoreboard();

  alert("Teams reset to default.");
}

function goToMainMenu() {
  window.location.href = "index.html";
}

function goToPlayBoard() {
  window.location.href = "play.html";
}

function goToEditBoard() {
  window.location.href = "edit.html";
}

function goToSavedBoards() {
  window.location.href = "index.html#saved-boards-screen";
}

function goToCompleteBoards() {
  window.location.href = "index.html#complete-boards-screen";
}

function toggleMenu() {
  const menuPanel = document.getElementById("menu-panel");
  if (!menuPanel) return;

  menuPanel.classList.toggle("menu-open");
}

function closeMenuPanel() {
  document.getElementById("menu-panel")?.classList.remove("menu-open");
}

function openOptionsPopup() {
  closeMenuPanel();
  document.getElementById("options-popup")?.classList.remove("hidden");
}

function closeOptionsPopup() {
  document.getElementById("options-popup")?.classList.add("hidden");
}

function getTextLengthClass(questionText, answerText) {
  const longestLength = Math.max(questionText.length, answerText.length);

  if (longestLength > 115) return "very-long-text";
  if (longestLength > 55) return "long-text";
  return "";
}

document.addEventListener("DOMContentLoaded", function () {
  loadSavedGameData();
  loadTeamData();
});
