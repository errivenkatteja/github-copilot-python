import copy

SIZE = 9
EMPTY = 0


def deep_copy(board):
    """Return a deep copy of the Sudoku board."""
    return copy.deepcopy(board)


def create_empty_board():
    """Create an empty 9x9 Sudoku board."""
    return [[EMPTY for _ in range(SIZE)] for _ in range(SIZE)]