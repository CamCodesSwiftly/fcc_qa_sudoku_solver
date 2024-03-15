class SudokuSolver {
	validate(puzzleString) {
		//TODO: Outsource the validation part in api.js (exluding the unsolvability as it requires solve()) to here

		// No puzzle input?
		if (puzzleString === "undefined" || !puzzleString) {
			return "Required field missing";
		}

		// puzzle input incorrect?
		const incorrectInputRegex = /[^\.\d]/g;
		const wrongInput = puzzleString.match(incorrectInputRegex);
		if (wrongInput) {
			return "Invalid characters in puzzle";
		}

		// puzzle too long or too short?
		if (puzzleString.length < 81 || puzzleString.length > 81) {
			return "Expected puzzle to be 81 characters long";
		}

		return true;
	}

	checkRowPlacement(puzzleString, row, column, value) {}

	checkColPlacement(puzzleString, row, column, value) {}

	checkRegionPlacement(puzzleString, row, column, value) {}

	solve(puzzleString) {
		const board = this.parseInput(puzzleString);
		this.recursiveSolve(board);
		const solution = this.formatOutput(board);
		return solution;
	}

	// * Sub Functions
	parseInput(input) {
		const board = [];
		for (let i = 0; i < 9; i++) {
			board.push(input.slice(i * 9, (i + 1) * 9).split(""));
		}
		return board;
	}
	recursiveSolve(board) {
		const emptyCell = this.findEmptyCell(board);
		if (!emptyCell) {
			return true; // Puzzle solved
		}
		const [row, col] = emptyCell;
		for (let num = 1; num <= 9; num++) {
			if (this.isSafe(board, row, col, num.toString())) {
				board[row][col] = num.toString();
				if (this.recursiveSolve(board)) {
					return true; // Solution found
				}
				// Undo the current placement (backtrack)
				board[row][col] = ".";
			}
		}
		return false; // not solvable
	}
	findEmptyCell(board) {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (board[row][col] === ".") {
					return [row, col];
				}
			}
		}
		return null; // No empty cell found
	}
	isSafe(board, row, col, num) {
		// Check row for conflicts
		for (let i = 0; i < 9; i++) {
			if (board[row][i] === num) {
				return false;
			}
		}
		// Check column for conflicts
		for (let i = 0; i < 9; i++) {
			if (board[i][col] === num) {
				return false;
			}
		}
		// Check 3x3 box for conflicts
		const boxStartRow = Math.floor(row / 3) * 3;
		const boxStartCol = Math.floor(col / 3) * 3;
		for (let i = boxStartRow; i < boxStartRow + 3; i++) {
			for (let j = boxStartCol; j < boxStartCol + 3; j++) {
				if (board[i][j] === num) {
					return false;
				}
			}
		}
		return true; // No conflicts found
	}
	// formatOutput(board) {
	// 	return board.map((row) => row.join("")).join("");
	// }
	formatOutput(board) {
		let result = "";
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				result += board[i][j] === 0 ? "." : board[i][j];
			}
		}
		return result;
	}
}

module.exports = SudokuSolver;
