"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route("/api/check").post((req, res) => {});

	app.route("/api/solve").post((req, res) => {
		let puzzleString = req.body.puzzle;
		// No puzzle input?
		if (req.body.puzzle === "undefined" || !req.body.puzzle) {
			return res.json({ error: "Required field missing" });
		}

		// puzzle input incorrect?
		const incorrectInputRegex = /[^\.\d]/g;
		const wrongInput = req.body.puzzle.match(incorrectInputRegex);
		console.log(wrongInput);
		if (wrongInput) {
			return res.json({ error: "Invalid characters in puzzle" });
		}

		// puzzle too long or too short?
		if (req.body.puzzle.length < 81 || req.body.puzzle.length > 81) {
			return res.json({
				error: "Expected puzzle to be 81 characters long",
			});
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
