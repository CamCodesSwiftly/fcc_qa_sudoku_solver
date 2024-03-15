"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route("/api/check").post((req, res) => {
		let puzzle = req.body.puzzle;
		let coordinate = req.body.coordinate;
		let value = req.body.value;

		// (IGNORE missing puzzle, will handle in c)
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
		if (
			coordinate === "undefined" ||
			!coordinate ||
			value === "undefined" ||
			!value ||
			puzzle === "undefined" ||
			!puzzle
		) {
			return res.json({ error: "Required field(s) missing" });
		}
		// coordinate not correct
		const coordinateRegex = /[A-I][1-9]/g;
		let coordinateWrong = coordinate.match(coordinateRegex);
		if (!coordinateWrong || coordinate.length > 2) {
			console.log(coordinate);
			return res.json({ error: "Invalid coordinate" });
		}
		// value is not 1-9
		const oneToNineRegex = /[^1-9]/g;
		let valueNotAllowed = value.match(oneToNineRegex);
		if (valueNotAllowed) {
			return res.json({ error: "Invalid value" });
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
