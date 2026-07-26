from .utils import SIZE


def is_safe(board, row, col, num):
    """Check whether a number can be placed in a cell."""

    # Check row
    for x in range(SIZE):
        if board[row][x] == num:
            return False

    # Check column
    for x in range(SIZE):
        if board[x][col] == num:
            return False

    # Check 3x3 box
    start_row = row - row % 3
    start_col = col - col % 3

    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False

    return True