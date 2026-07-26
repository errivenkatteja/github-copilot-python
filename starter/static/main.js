// ======================================================
// Sudoku Game - Client-side Logic
// This file manages the client-side functionality of the
// Sudoku application, including board rendering, timer,
// leaderboard, live validation, and user interaction.
// ======================================================

// Board configuration
const SIZE = 9;

// Stores the current Sudoku puzzle
let puzzle = [];

// ------------------------------------------------------
// Timer Variables
// Used to track the elapsed time for the current game.
// ------------------------------------------------------
let timerInterval = null;
let secondsElapsed = 0;

// ------------------------------------------------------
// Hint Counter
// Tracks the number of hints used by the player.
// ------------------------------------------------------
let hintsUsed = 0;

// ------------------------------------------------------
// Convert elapsed seconds into MM:SS format.
// ------------------------------------------------------

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

}

// ------------------------------------------------------
// Start the game timer.
// Resets the timer and updates it every second.
// ------------------------------------------------------

function startTimer() {

    clearInterval(timerInterval);

    secondsElapsed = 0;

    document.getElementById("timer").innerText = "00:00";

    timerInterval = setInterval(() => {

        secondsElapsed++;

        document.getElementById("timer").innerText =
            formatTime(secondsElapsed);

    }, 1000);

}

// ------------------------------------------------------
// Stop the game timer.
// Called when the puzzle is solved.
// ------------------------------------------------------

function stopTimer() {

    clearInterval(timerInterval);

}

// ------------------------------------------------------
// Save the completed game to Local Storage.
// Only the fastest 10 scores are retained.
// ------------------------------------------------------

function saveScore() {

    const player =
        document.getElementById("player-name").value.trim() || "Anonymous";

    const difficulty =
        document.getElementById("difficulty").value;

    let scores =
        JSON.parse(localStorage.getItem("sudokuScores")) || [];

    scores.push({

        name: player,

        time: secondsElapsed,

        difficulty: difficulty,

        hints: hintsUsed

    });

    scores.sort((a, b) => a.time - b.time);

    scores = scores.slice(0, 10);

    localStorage.setItem(
        "sudokuScores",
        JSON.stringify(scores)
    );

    loadLeaderboard();

}

// ------------------------------------------------------
// Load leaderboard data from Local Storage
// and display the top 10 scores.
// ------------------------------------------------------

function loadLeaderboard() {

    const tbody =
        document.querySelector("#leaderboard tbody");

    tbody.innerHTML = "";

    const scores =
        JSON.parse(localStorage.getItem("sudokuScores")) || [];

    scores.forEach((score, index) => {

        tbody.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${score.name}</td>
            <td>${formatTime(score.time)}</td>
            <td>${score.difficulty}</td>
            <td>${score.hints}</td>
        </tr>
        `;

    });

}

// ------------------------------------------------------
// Create the 9×9 Sudoku board dynamically.
// Alternate 3×3 regions receive a different background
// color for better visual separation.
// ------------------------------------------------------

function createBoardElement() {

    const boardDiv = document.getElementById("sudoku-board");

    boardDiv.innerHTML = "";

    for (let i = 0; i < SIZE; i++) {

        const rowDiv = document.createElement("div");

        rowDiv.className = "sudoku-row";

        for (let j = 0; j < SIZE; j++) {

            const input = document.createElement("input");

            input.type = "text";

            input.maxLength = 1;

            input.className = "sudoku-cell";

            // Alternate 3×3 block background
            
            const blockRow = Math.floor(i / 3);
            
            const blockCol = Math.floor(j / 3);
            
            if ((blockRow + blockCol) % 2 === 0) {
              input.classList.add("block-alt");
            }

            input.dataset.row = i;

            input.dataset.col = j;

            input.addEventListener("input", async (e) => {

                const val = e.target.value.replace(/[^1-9]/g, "");

                e.target.value = val;

                if (val === "") {

                    e.target.classList.remove("incorrect");

                    return;

                }

                const response = await fetch("/validate", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        row: Number(e.target.dataset.row),

                        col: Number(e.target.dataset.col),

                        value: Number(val)

                    })

                });

                const result = await response.json();

                if (result.valid) {

                    e.target.classList.remove("incorrect");

                } else {

                    e.target.classList.add("incorrect");

                }

            });

            rowDiv.appendChild(input);

        }

        boardDiv.appendChild(rowDiv);

    }

}

// ------------------------------------------------------
// Render a new Sudoku puzzle on the board.
// Prefilled cells are locked to prevent editing.
// ------------------------------------------------------

function renderPuzzle(puz) {

    puzzle = puz;

    createBoardElement();

    const boardDiv =
        document.getElementById("sudoku-board");

    const inputs =
        boardDiv.getElementsByTagName("input");

    for (let i = 0; i < SIZE; i++) {

        for (let j = 0; j < SIZE; j++) {

            const index = i * SIZE + j;

            const value = puzzle[i][j];

            const input = inputs[index];

            input.className = "sudoku-cell";
            const blockRow = Math.floor(i / 3);
            const blockCol = Math.floor(j / 3);

            if ((blockRow + blockCol) % 2 === 0) {
              input.classList.add("block-alt");
            }

            if (value !== 0) {

                input.value = value;

                input.disabled = true;

                input.classList.add("prefilled");

            } else {

                input.value = "";

                input.disabled = false;

            }

        }

    }

}


// ------------------------------------------------------
// Start a new Sudoku game.
// Resets the hint counter, loads a puzzle based on the
// selected difficulty, renders the board, and starts
// the game timer.
// ------------------------------------------------------

async function newGame() {

    hintsUsed = 0;

    const difficulty =
        document.getElementById("difficulty").value;

    const res =
        await fetch(`/new?difficulty=${difficulty}`);

    const data = await res.json();

    renderPuzzle(data.puzzle);

    startTimer();

    document.getElementById("message").innerText = "";
}

// ------------------------------------------------------
// Request a hint from the server.
// A valid value is inserted into one empty cell,
// the cell becomes locked, and the hint counter
// is updated.
// ------------------------------------------------------

async function giveHint() {

    const boardDiv = document.getElementById("sudoku-board");
    const inputs = boardDiv.getElementsByTagName("input");

    const board = [];

    for (let i = 0; i < SIZE; i++) {
        board[i] = [];

        for (let j = 0; j < SIZE; j++) {
            const index = i * SIZE + j;

            board[i][j] = inputs[index].value
                ? parseInt(inputs[index].value)
                : 0;
        }
    }

    const res = await fetch("/hint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ board })
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    // Increase hint counter ONLY after a successful hint
    hintsUsed++;

    const index = data.row * SIZE + data.col;

    inputs[index].value = data.value;
    inputs[index].disabled = true;
    inputs[index].classList.add("prefilled");
}

// ------------------------------------------------------
// Compare the player's board with the correct solution.
// Incorrect cells are highlighted. If the puzzle is
// solved correctly, stop the timer and save the score.
// ------------------------------------------------------

async function checkSolution() {

    const boardDiv =
        document.getElementById("sudoku-board");

    const inputs =
        boardDiv.getElementsByTagName("input");

    const board = [];

    for (let i = 0; i < SIZE; i++) {

        board[i] = [];

        for (let j = 0; j < SIZE; j++) {

            const index = i * SIZE + j;

            board[i][j] = inputs[index].value
                ? parseInt(inputs[index].value)
                : 0;

        }

    }

    const res = await fetch("/check", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({ board })

    });

    const data = await res.json();

    const msg =
        document.getElementById("message");

    if (data.error) {

        msg.style.color = "#d32f2f";

        msg.innerText = data.error;

        return;

    }

    const incorrect =
        new Set(data.incorrect.map(x => x[0] * SIZE + x[1]));

    for (let i = 0; i < inputs.length; i++) {

        if (inputs[i].disabled)
            continue;

        inputs[i].className = "sudoku-cell";
        const row = Math.floor((i / SIZE) / 3);
        const col = Math.floor((i % SIZE) / 3);
        if ((row + col) % 2 === 0) {
          inputs[i].classList.add("block-alt");
        }

        if (incorrect.has(i)) {

            inputs[i].classList.add("incorrect");

        }

    }

    if (incorrect.size === 0) {

        stopTimer();

        saveScore();

        msg.style.color = "#388e3c";

        msg.innerText =
            "🎉 Congratulations! You solved the puzzle!";

    } else {

        msg.style.color = "#d32f2f";

        msg.innerText =
            "Some cells are incorrect.";

    }

}

// ------------------------------------------------------
// Toggle Dark Mode.
// The selected theme is stored in Local Storage so it
// persists across browser sessions.
// ------------------------------------------------------

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    const enabled =
        document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "darkMode",
        enabled
    );

}

// ------------------------------------------------------
// Load the user's previously saved Dark Mode preference
// from Local Storage when the application starts.
// ------------------------------------------------------

function loadDarkMode() {

    const enabled =
        localStorage.getItem("darkMode") === "true";

    if (enabled) {

        document.body.classList.add("dark-mode");

    }

}

// ------------------------------------------------------
// Application Initialization
// Register event listeners, restore saved settings,
// load the leaderboard, and start a new game.
// ------------------------------------------------------

window.addEventListener("load", () => {
  document
    .getElementById("dark-mode-toggle")
    .addEventListener("click", toggleDarkMode);
  loadDarkMode();

    document
        .getElementById("new-game")
        .addEventListener("click", newGame);

    document
        .getElementById("check-solution")
        .addEventListener("click", checkSolution);

    document
        .getElementById("hint-button")
        .addEventListener("click", giveHint);

    loadLeaderboard();
  
  newGame();
});