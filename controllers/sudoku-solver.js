class SudokuSolver {
	validate(puzzleString) {
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

	validateCheck(puzzle, coordinate, value) {
		// c) puzzle, value or coordinate missing?
		if (
			coordinate === "undefined" ||
			!coordinate ||
			value === "undefined" ||
			!value ||
			puzzle === "undefined" ||
			!puzzle
		) {
			return "Required field(s) missing";
		}
		// coordinate not correct
		const coordinateRegex = /[A-I][1-9]/g;
		let coordinateWrong = coordinate.match(coordinateRegex);
		if (!coordinateWrong || coordinate.length > 2) {
			return "Invalid coordinate";
		}
		// value is not 1-9
		const oneToNineRegex = /[^1-9]/g;
		let valueNotAllowed = value.match(oneToNineRegex);
		if (valueNotAllowed) {
			return "Invalid value";
		}

		return true;
	}

	getCoordinates(input) {
		const rowMap = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8 };
		const colMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8 };

		const xCoordinate = colMap[input[1]];
		const yCoordinate = rowMap[input[0]];

		let boxNumber;
		if (colMap[input[1]] < 3) {
			boxNumber = Math.floor(rowMap[input[0]] / 3);
		} else if (colMap[input[1]] < 6) {
			boxNumber = 3 + Math.floor(rowMap[input[0]] / 3);
		} else {
			boxNumber = 6 + Math.floor(rowMap[input[0]] / 3);
		}

		return { xCoordinate, yCoordinate, boxNumber };
	}

	checkAlreadyExists(board, row, column, value) {
		if (board[column][row] == value) {
			return true;
		}
		return false;
	}

	checkRowPlacement(board, column, row, value) {
		if (board[row].includes(value) === true) {
			return "row";
		}
		return false;
	}
	checkColPlacement(board, row, column, value) {
		for (let i = 0; i < board[0].length; i++) {
			if (board[i][row] == value) {
				return "column";
			}
		}
		return false;
	}
	checkRegionPlacement(board, box, value) {
		// i need a better view than before, sorry
		let regionView = transposeRegions(board);

		let betterRegionView = [];
		for (let i = 0; i < regionView.length; i++) {
			// renn durch das ober array
			let j = 0; // renn durch die 3er unterarrays
			let region = [];
			region = regionView[i][j]
				.concat(regionView[i][j + 1])
				.concat(regionView[i][j + 2]);
			betterRegionView.push(region);
			region = [];
		}

		// now i can check for the placement
		// i got the boxes as arrays, all i need to do is to ask if the value is included
		if (betterRegionView[box].includes(value) == true) {
			return "region";
		}
		return false;
	}

	solve(puzzleString) {
		const board = this.parseInput(puzzleString);
		this.recursiveSolve(board);
		const stringOutPut = this.stringOutput(board);
		this.matrixOutput(board);
		const solution = {
			stringOutput: stringOutPut,
			matrixOutput: board,
		};
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
	matrixOutput(board) {
		return board.map((row) => row.join("")).join("");
	}
	stringOutput(board) {
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

function transposeRegions(matrix) {
	const transposedRegions = [];

	// Loop through each row of regions
	for (let regionRow = 0; regionRow < 3; regionRow++) {
		// Loop through each column of regions
		for (let regionCol = 0; regionCol < 3; regionCol++) {
			const transposedRegion = transposeRegion(
				matrix,
				regionRow,
				regionCol
			);
			transposedRegions.push(transposedRegion);
		}
	}

	return transposedRegions;
}

function transposeRegion(matrix, regionRow, regionCol) {
	const transposedRegion = [];

	// Calculate the starting row and column indices of the region
	const startRow = regionRow * 3;
	const startCol = regionCol * 3;

	// Loop through the rows of the region
	for (let row = startRow; row < startRow + 3; row++) {
		const transposedRow = [];
		// Loop through the columns of the region
		for (let col = startCol; col < startCol + 3; col++) {
			// Push the element at the current position into the transposed row
			transposedRow.push(matrix[col][row]);
		}
		// Push the transposed row into the transposed region
		transposedRegion.push(transposedRow);
	}

	return transposedRegion;
}
