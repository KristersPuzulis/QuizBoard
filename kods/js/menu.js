document.addEventListener("DOMContentLoaded", function () {
  renderSavedBoardsList();
  renderCompleteBoardsList();
});

async function renderSavedBoardsList() {
  const list = document.getElementById("saved-boards-list");
  if (!list) return;

  const savedBoards = await getSavedBoards();

  if (savedBoards.length === 0) {
    list.innerHTML = `<p class="saved-boards-empty">No saved boards yet.</p>`;
    return;
  }

  list.innerHTML = "";

  savedBoards.forEach((savedBoard) => {
    const card = document.createElement("div");
    card.className = "saved-board-card";

    const savedDate = savedBoard.savedAt
      ? new Date(savedBoard.savedAt).toLocaleString()
      : "Unknown date";

    const categoryNames = Array.isArray(savedBoard.board)
      ? savedBoard.board.map((category) => category.category).join(", ")
      : "Unknown categories";

    const boardSize = Array.isArray(savedBoard.board)
      ? `${savedBoard.board.length} × ${Math.max(...savedBoard.board.map((category) => Array.isArray(category.questions) ? category.questions.length : 0), 0)}`
      : "Unknown size";

    card.innerHTML = `
      <div>
        <h3>${escapeHtml(savedBoard.name)}</h3>
        <p>Saved: ${escapeHtml(savedDate)}</p>
        <p>Board size: ${escapeHtml(boardSize)}</p>
        <p>Categories: ${escapeHtml(categoryNames)}</p>
      </div>
      <div class="saved-board-card-actions">
        <button onclick="loadSavedBoard('${savedBoard.id}', 'play.html')">Load</button>
        <button onclick="downloadSavedBoard('${savedBoard.id}')">Download TXT</button>
        <button onclick="deleteSavedBoard('${savedBoard.id}')">Delete</button>
      </div>
    `;

    list.appendChild(card);
  });
}

function renderCompleteBoardsList() {
  const list = document.getElementById("complete-boards-list");
  if (!list) return;

  list.innerHTML = completeBoardTemplates.map((template) => {
    const previewBoard = template.getBoard();
    const columnCount = previewBoard.length;
    const rowCount = Math.max(...previewBoard.map((category) => category.questions.length), 0);
    const categories = previewBoard.map((category) => category.category).join(", ");

    return `
      <div class="complete-board-card">
        <h3>${escapeHtml(template.name)}</h3>
        <p><strong>${escapeHtml(template.type)}</strong></p>
        <p>${escapeHtml(template.description)}</p>
        <p>Size: ${columnCount} × ${rowCount}</p>
        <p>Categories: ${escapeHtml(categories)}</p>
        <div class="complete-board-card-actions">
          <button onclick="loadCompleteBoardTemplate('${template.id}', 'edit.html')">Load</button>
          <button onclick="downloadCompleteBoardTemplate('${template.id}')">Download TXT</button>
        </div>
      </div>
    `;
  }).join("");
}
