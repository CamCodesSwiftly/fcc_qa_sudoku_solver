"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route("/api/check").post((req, res) => {});

	app.route("/api/solve").post((req, res) => {
		let puzzleString = req.body.puzzle;

		const validationResult = solver.validate(puzzleString);

		switch (validationResult) {
			case "Required field missing":
				return res.json({ error: "Required field missing" });
				break;
			case "Invalid characters in puzzle":
				return res.json({ error: "Invalid characters in puzzle" });
				break;
			case "Expected puzzle to be 81 characters long":
				return res.json({
					error: "Expected puzzle to be 81 characters long",
				});
				break;
			default:
				break;
		}

		let solution = solver.solve(puzzleString);

		// puzzle cant be solved?
		// if the solution has a . in it, it was not solved
		const unsolvableRegex = /\./g;
		const unsolvable = solution.match(unsolvableRegex);
		if (unsolvable) {
			return res.json({ error: "Puzzle cannot be solved" });
		}
		return res.json({
			solution: solution,
		});
	});
};
