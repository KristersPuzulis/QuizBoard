let editModalCategoryIndex = -1;
let editModalQuestionIndex = -1;
let editModalMedia = "";
let editModalMediaType = "";

document.addEventListener("DOMContentLoaded", function () {
  renderEditor();
});

function updateBoardSizeLabels() {
  const columnLabel = document.getElementById("column-count-label");
  const rowLabel = document.getElementById("row-count-label");

  if (columnLabel) columnLabel.textContent = getColumnCount();
  if (rowLabel) rowLabel.textContent = getRowCount();
}

function addColumn() {
  if (getColumnCount() >= MAX_COLUMNS) {
    alert("Maximum 10 columns allowed.");
    return;
  }

  const rowCount = getRowCount();

  gameData.push({
    category: `Category ${gameData.length + 1}`,
    questions: Array.from({ length: rowCount }, (_, questionIndex) => createQuestion((questionIndex + 1) * 100))
  });

  saveGameData();
  renderEditor();
}

function removeColumn() {
  if (getColumnCount() <= MIN_COLUMNS) {
    alert("At least 1 column is required.");
    return;
  }

  if (!confirm("Remove the last column and all of its questions?")) return;

  gameData.pop();

  saveGameData();
  renderEditor();
}

function addRow() {
  if (getRowCount() >= MAX_ROWS) {
    alert("Maximum 10 rows allowed.");
    return;
  }

  const newPoints = (getRowCount() + 1) * 100;

  gameData.forEach((category) => {
    category.questions.push(createQuestion(newPoints));
  });

  saveGameData();
  renderEditor();
}

function removeRow() {
  if (getRowCount() <= MIN_ROWS) {
    alert("At least 1 row is required.");
    return;
  }

  if (!confirm("Remove the last row and all of its questions?")) return;

  gameData.forEach((category) => {
    category.questions.pop();
  });

  saveGameData();
  renderEditor();
}

function renderEditor() {
  const editor = document.getElementById("editor");
  if (!editor) return;

  const columnCount = getColumnCount();
  const rowCount = getRowCount();

  updateBoardSizeLabels();

  const categoryInputs = gameData.map((category, categoryIndex) => `
    <input
      class="edit-category-input"
      value="${escapeHtml(category.category)}"
      placeholder="Enter Category Name"
      oninput="updateCategoryName(${categoryIndex}, this.value, false)"
      onchange="saveGameData();"
    >
  `).join("");

  let cells = "";

  for (let questionIndex = 0; questionIndex < rowCount; questionIndex++) {
    for (let categoryIndex = 0; categoryIndex < columnCount; categoryIndex++) {
      const question = gameData[categoryIndex].questions[questionIndex];
      const questionText = question.question.trim() || String(question.points);
      const answerText = question.answer.trim() || "No answer added.";
      const classes = ["edit-board-cell", getTextLengthClass(questionText, answerText)];

      if (question.answered) classes.push("answered");
      if (question.dailyDouble) classes.push("daily-double-cell");

      cells += `
        <button
          class="${classes.filter(Boolean).join(" ")}"
          onclick="openQuestionEditor(${categoryIndex}, ${questionIndex})"
          title="Click to edit. Hover to see answer."
        >
          <span class="edit-cell-question">${escapeHtml(questionText)}</span>
          <span class="edit-cell-answer">${escapeHtml(answerText)}</span>
          ${question.dailyDouble ? `<span class="edit-cell-badge daily-double-badge">DD</span>` : ""}
          ${question.questionMedia ? `<span class="edit-cell-badge media-badge">📎</span>` : ""}
        </button>
      `;
    }
  }

  editor.innerHTML = `
    <div class="edit-board-wrapper" style="--cols: ${columnCount}; --rows: ${rowCount};">
      <div class="edit-category-row">${categoryInputs}</div>
      <div class="edit-board-grid">${cells}</div>
    </div>
  `;
}

function updateCategoryName(categoryIndex, newName, shouldRender = true) {
  gameData[categoryIndex].category = newName;

  if (shouldRender) {
    saveGameData();
    renderEditor();
  }
}

function openQuestionEditor(categoryIndex, questionIndex) {
  editModalCategoryIndex = categoryIndex;
  editModalQuestionIndex = questionIndex;

  const question = gameData[categoryIndex].questions[questionIndex];
  editModalMedia = question.questionMedia || "";
  editModalMediaType = question.questionMediaType || "";

  document.getElementById("edit-modal-title").textContent =
    `${gameData[categoryIndex].category || `Category ${categoryIndex + 1}`} for ${question.points}`;
  document.getElementById("edit-modal-question").value = question.question || "";
  document.getElementById("edit-modal-answer").value = question.answer || "";
  document.getElementById("edit-modal-daily-double").checked = question.dailyDouble || false;

  updateEditModalMediaPreview();
  document.getElementById("edit-question-modal").classList.remove("hidden");
  document.getElementById("edit-modal-question").focus();
}

function closeEditQuestionEditor(shouldSave) {
  const modal = document.getElementById("edit-question-modal");

  if (shouldSave && editModalCategoryIndex > -1 && editModalQuestionIndex > -1) {
    const question = gameData[editModalCategoryIndex].questions[editModalQuestionIndex];

    question.question = document.getElementById("edit-modal-question").value;
    question.answer = document.getElementById("edit-modal-answer").value;
    question.dailyDouble = document.getElementById("edit-modal-daily-double").checked;
    question.questionMedia = editModalMedia;
    question.questionMediaType = editModalMediaType;

    saveGameData();
    renderEditor();
  }

  modal.classList.add("hidden");
  editModalCategoryIndex = -1;
  editModalQuestionIndex = -1;
  editModalMedia = "";
  editModalMediaType = "";
}

function uploadEditModalMedia(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    editModalMedia = event.target.result;
    editModalMediaType = file.type;
    updateEditModalMediaPreview(file.name + " added.");
  };

  reader.readAsDataURL(file);
}

function removeEditModalMedia() {
  editModalMedia = "";
  editModalMediaType = "";
  updateEditModalMediaPreview();
}

function updateEditModalMediaPreview(customText) {
  const preview = document.getElementById("edit-modal-media-preview");
  const removeButton = document.getElementById("edit-modal-remove-media");

  if (!preview || !removeButton) return;

  if (editModalMedia) {
    preview.textContent = customText || "Question media added.";
    removeButton.classList.remove("hidden");
  } else {
    preview.textContent = "No question media.";
    removeButton.classList.add("hidden");
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") return;

  const editModal = document.getElementById("edit-question-modal");
  const optionsPopup = document.getElementById("options-popup");

  if (editModal && !editModal.classList.contains("hidden")) {
    closeEditQuestionEditor(false);
    return;
  }

  if (optionsPopup && !optionsPopup.classList.contains("hidden")) {
    closeOptionsPopup();
  }
});
