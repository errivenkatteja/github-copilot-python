# GitHub Copilot Instructions

## Coding Style
- Follow PEP 8.
- Use type hints where appropriate.
- Keep functions short and focused.
- Avoid duplicate code.
- Write reusable functions.

## Project Structure
- Separate Flask routes from Sudoku logic.
- Keep HTML, CSS, JavaScript, and Python organized.
- Prefer modular code over one large file.

## UI
- Responsive layout.
- Support light and dark mode.
- Keep the Sudoku board centered.
- Make controls easy to read.

## Game Logic
- Ensure generated puzzles have exactly one solution.
- Lock prefilled cells.
- Validate moves immediately.
- Keep the existing functionality working while adding new features.

## Testing
- Use pytest.
- Don't break existing tests.