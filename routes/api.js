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


		if (coordinate) return res.json("temporary");
	});

	app.route("/api/solve").post((req, res) => {
		let puzzleString = req.body.puzzle;

		const validationResult = solver.validate(puzzleString);

		if (validationResult !== true) {
			return res.json({ error: validationResult });
		}

		let solution = solver.solve(puzzleString);

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
