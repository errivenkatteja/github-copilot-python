import random

from .utils import SIZE, EMPTY
from .validator import is_safe


def fill_board(board):
    """Fill the Sudoku board using backtracking."""

    for row in range(SIZE):
        for col in range(SIZE):

            if board[row][col] == EMPTY:

                numbers = list(range(1, SIZE + 1))
                random.shuffle(numbers)

                for number in numbers:

                    if is_safe(board, row, col, number):

                        board[row][col] = number

                        if fill_board(board):
                            return True

                        board[row][col] = EMPTY

                return False

    return True



def count_solutions(board):
    """Count the number of solutions for a Sudoku board.
    Stops after finding two solutions.
    """
    count = 0

    def solve():
        nonlocal count

        if count >= 2:
            return

        for row in range(SIZE):
            for col in range(SIZE):
                if board[row][col] == EMPTY:
                    for number in range(1, SIZE + 1):
                        if is_safe(board, row, col, number):
                            board[row][col] = number
                            solve()
                            board[row][col] = EMPTY
                    return

        count += 1

    solve()
    return count