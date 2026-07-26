# Sudoku Game Refactoring with GitHub Copilot

## Project Overview

This project modernizes a legacy Sudoku web application using Python Flask and GitHub Copilot.

The application has been refactored into a cleaner, modular structure while introducing several new gameplay features including difficulty levels, timer, hints, leaderboard, live validation, dark mode, and responsive design.

---

## Technologies Used

- Python 3.14
- Flask
- HTML5
- CSS3
- JavaScript
- PyTest
- Git
- GitHub Copilot

---

## Features

### Core Features

- Sudoku puzzle generation
- Unique puzzle solution
- Difficulty Levels
  - Easy
  - Medium
  - Hard
- Locked prefilled cells
- Live input validation
- Check Puzzle button
- Hint button
- Puzzle completion message

### Game Features

- Player name input
- Timer
- Hint counter
- Top 10 Leaderboard
- Local Storage
- Difficulty tracking

### User Interface

- Responsive layout
- Dark Mode
- Mobile friendly
- Alternating 3×3 Sudoku blocks
- Clean modern design

---

## Project Structure

```
starter/
│
├── app.py
├── sudoku_logic.py
├── requirements.txt
├── instruction.md
├── README.md
│
├── templates/
│   └── index.html
│
├── static/
│   ├── main.js
│   └── styles.css
│
├── tests/
│   └── test_basic.py
│
└── Screenshots/
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Create a virtual environment

```bash
python -m venv .venv
```

Activate virtual environment

Windows

```bash
.venv\Scripts\activate
```

Install packages

```bash
pip install -r requirements.txt
```

Run the project

```bash
python app.py
```

Open

```
http://127.0.0.1:5000
```

---

## Running Tests

```bash
pytest
```

---

## GitHub Copilot Usage

GitHub Copilot was used for:

- Refactoring legacy code
- Creating the testing framework
- Sudoku validation improvements
- Hint system
- Timer implementation
- Local storage leaderboard
- Responsive layout improvements
- Dark mode implementation

All AI-generated code was reviewed, tested, and modified where necessary.

---

## Screenshots

The Screenshots folder contains:

- Initial testing framework
- Copilot prompts
- Unique solution implementation
- Local storage implementation
- Styling improvements
- Dark mode
- Final application

---

## Future Improvements

- Note Mode
- Solver Animation
- Accessibility Improvements (WCAG 2.1 AA)
- Number Highlighting
- Keyboard Navigation

---

## Author

E. Venkata Teja
Submitted as part of the **Udacity GitHub Copilot Python Project**.
