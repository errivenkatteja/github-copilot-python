"""
Difficulty settings for Sudoku puzzles.
"""

DIFFICULTY_LEVELS = {
    "easy": 45,
    "medium": 35,
    "hard": 25,
}


def get_clues(level: str) -> int:
    """
    Return the number of clues for the selected difficulty.
    Defaults to medium if an unknown level is provided.
    """
    return DIFFICULTY_LEVELS.get(level.lower(), 35)