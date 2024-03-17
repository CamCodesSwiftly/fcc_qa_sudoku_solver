"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route("/api/check").post((req, res) => {
		let puzzle = req.body.puzzle;
		let coordinate = req.body.coordinate;
		let value = req.body.value;

		// a) puzzle too long/short? b) puzzle has invalid characters?
		let puzzleValidationResult = solver.validate(puzzle);
		if (
			puzzleValidationResult === "Invalid characters in puzzle" ||
			puzzleValidationResult ===
				"Expected puzzle to be 81 characters long"
		) {
			return res.json({ error: puzzleValidationResult });
		}

		// c) puzzle, value or coordinate missing?
		// d) invalid value?
		// e) invalid coordinate?
		let checkValidationResult = solver.validateCheck(
			puzzle,
			coordinate,
			value
		);
		if (checkValidationResult !== true) {
			return res.json({ error: checkValidationResult });
		}

		// correct inputs and correct value/coordinate match

		let board = solver.parseInput(puzzle);

		let placement = solver.getCoordinates(coordinate);

		// is the value already on that field?
		let valueExists = solver.checkAlreadyExists(
			board,
			placement.xCoordinate,
			placement.yCoordinate,
			value
		);
		if (valueExists === true) {
			return res.json({ valid: true });
		}

		// is the value and all prior checks okay?
		let conflicts = [];
		let rowConflict = solver.checkRowPlacement(
			board,
			placement.xCoordinate,
			placement.yCoordinate,
			value
		);

		if (rowConflict) {
			conflicts.push(rowConflict);
		}
		let colConflict = solver.checkColPlacement(
			board,
			placement.xCoordinate,
			placement.yCoordinate,
			value
		);

		if (colConflict) conflicts.push(colConflict);
		let regionConflict = solver.checkRegionPlacement(
			board,
			placement.boxNumber,
			value
		);

		if (regionConflict) conflicts.push(regionConflict);

		// value can be placed safely on that field
		if (
			rowConflict == false &&
			colConflict == false &&
			regionConflict == false
		) {
			return res.json({ valid: true });
		}

		// value violates row, column or region rules
		return res.json({
			valid: false,
			conflict: conflicts,
		});
	});

	app.route("/api/solve").post((req, res) => {
		let puzzleString = req.body.puzzle;

		const validationResult = solver.validate(puzzleString);

		if (validationResult !== true) {
			return res.json({ error: validationResult });
		}

		let solution = solver.solve(puzzleString).stringOutput;
		// puzzle cant be solved?
		// if the solution has a . in it, it was not solved
		const unsolvableRegex = /\./g;
		let unsolvable = solution.match(unsolvableRegex);
		if (unsolvable) {
			return res.json({ error: "Puzzle cannot be solved" });
		}
		return res.json({
			solution: solution,
		});
	});
};
