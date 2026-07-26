# ==========================================================
# Sudoku Puzzle Generator
# ----------------------------------------------------------
# This module generates a playable Sudoku puzzle by:
# 1. Creating an empty board.
# 2. Filling it with a complete valid Sudoku solution.
# 3. Removing cells based on the selected difficulty.
# 4. Returning both the puzzle and its solution.
# ==========================================================

import random

from .solver import fill_board, count_solutions
from .utils import create_empty_board, deep_copy, SIZE, EMPTY

# ==========================================================
# Remove Cells from the Solved Board
# ----------------------------------------------------------
# Removes numbers randomly while leaving the remaining cells
# as clues for the player. The number of clues depends on the
# selected difficulty level.
# ==========================================================

def remove_cells(board, clues):
    """
    Remove numbers while ensuring the puzzle still has
    exactly one solution.
    """

    cells_to_remove = SIZE * SIZE - clues

    while cells_to_remove > 0:

        row = random.randrange(SIZE)
        col = random.randrange(SIZE)

        if board[row][col] == EMPTY:
            continue

        # Save the value before removing it
        backup = board[row][col]
        board[row][col] = EMPTY

        # Make a copy and test uniqueness
        test_board = deep_copy(board)

        if count_solutions(test_board) != 1:
            # More than one solution -> restore the cell
            board[row][col] = backup
        else:
            # Safe to remove
            cells_to_remove -= 1

# ==========================================================
# Generate Sudoku Puzzle
# ----------------------------------------------------------
# Creates a complete Sudoku solution, removes cells according
# to the selected difficulty, and returns both the puzzle and
# the solved board.
# ==========================================================
def generate_puzzle(clues=35):
    """Generate a Sudoku puzzle and its solution."""

    # Create an empty Sudoku board
    board = create_empty_board()

    # Fill the board with a valid Sudoku solution
    fill_board(board)

    # Save a copy of the completed solution
    solution = deep_copy(board)

    # Remove cells to create the playable puzzle
    remove_cells(board, clues)

    # Save the puzzle after removing cells
    puzzle = deep_copy(board)

    # Return both the puzzle and the solution
    return puzzle, solution