# ==========================================================
# Flask Sudoku Application
# ----------------------------------------------------------
# This application provides the backend for the Sudoku game.
# It handles:
# - Loading the main web page
# - Creating new Sudoku puzzles
# - Checking completed puzzles
# - Providing hints
# - Live validation of user input
# ==========================================================

from flask import Flask, render_template, jsonify, request
from sudoku.generator import generate_puzzle
from sudoku.utils import SIZE
from sudoku.difficulty import get_clues

# Create the Flask application
app = Flask(__name__)

# Store the current puzzle and solution in memory
CURRENT = {
    'puzzle': None,
    'solution': None
}

# ==========================================================
# Home Page
# Loads the Sudoku game interface.
# ==========================================================

@app.route('/')
def index():
    return render_template('index.html')

# ==========================================================
# Create a New Sudoku Puzzle
# Generates a puzzle based on the selected difficulty level.
# ==========================================================

@app.route('/new')
def new_game():
    # Read difficulty from the request
    difficulty = request.args.get("difficulty", "medium")

    # Get the number of clues for the selected difficulty
    clues = get_clues(difficulty)

    # Generate a new puzzle and its solution
    puzzle, solution = generate_puzzle(clues)

    # Save puzzle and solution for later validation
    CURRENT['puzzle'] = puzzle
    CURRENT['solution'] = solution

    # Return the puzzle to the frontend
    return jsonify({'puzzle': puzzle})

# ==========================================================
# Check Sudoku Solution
# Compares the player's board against the correct solution.
# Returns a list of incorrect cells.
# ==========================================================

@app.route('/check', methods=['POST'])
def check_solution():
    data = request.json
    board = data.get('board')
    solution = CURRENT.get('solution')

    # Ensure a game is currently active
    if solution is None:
        return jsonify({'error': 'No game in progress'}), 400
    
    incorrect = []

    # Compare every cell with the solution
    for i in range(SIZE):
        for j in range(SIZE):
            if board[i][j] != solution[i][j]:
                incorrect.append([i, j])
    return jsonify({'incorrect': incorrect})

# ==========================================================
# Hint System
# Finds the first empty cell and returns its correct value.
# ==========================================================

@app.route('/hint', methods=['POST'])
def hint():

    data = request.json
    board = data.get("board")

    solution = CURRENT.get("solution")

    if solution is None:
        return jsonify({"error": "No game in progress"}), 400

    # Find the first empty cell
    for i in range(SIZE):
        for j in range(SIZE):

            if board[i][j] == 0:

                return jsonify({
                    "row": i,
                    "col": j,
                    "value": solution[i][j]
                })
    # Puzzle is already complete        
    return jsonify({"message": "Puzzle already complete"})

# ==========================================================
# Live Cell Validation
# Checks whether a user's entered number matches the solution.
# Used for instant feedback while typing.
# ==========================================================

@app.route('/validate', methods=['POST'])
def validate():

    data = request.json

    row = data["row"]
    col = data["col"]
    value = data["value"]

    solution = CURRENT.get("solution")

    # No active puzzle
    if solution is None:
        return jsonify({"valid": False})

    # Return whether the entered value is correct
    return jsonify({
        "valid": value == solution[row][col]
    })

# ==========================================================
# Application Entry Point
# Starts the Flask development server.
# ==========================================================

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080, debug=True)