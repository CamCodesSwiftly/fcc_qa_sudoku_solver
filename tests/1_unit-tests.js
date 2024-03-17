const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
	//#1
	test("#handle valid puzzle of 81 characters", () => {
		assert.strictEqual(
			solver.validate(
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
			),
			true,
			"validate() must return true for a valid 81 character puzzle string"
		);
	});
	//#2
	test("#hanlde puzzle with invalid characters", () => {
		assert.strictEqual(
			solver.validate(
				"1.5..2.84..63.a%.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
			),
			"Invalid characters in puzzle",
			"validate() must return -Invalid characters in puzzle- for a puzzle that contains other characters than numbers between 1-9 or dots (.)"
		);
	});
	//#3
	test("#hanlde puzzle with that doesnt have 81 characters", () => {
		let tooLong = assert.strictEqual(
			solver.validate(
				"111.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
			),
			"Expected puzzle to be 81 characters long",
			"validate() must return -Expected puzzle to be 81 characters long- for a puzzle that contains other characters than numbers between 1-9 or dots (.)"
		);
		let tooShort = assert.strictEqual(
			solver.validate(
				".5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
			),
			"Expected puzzle to be 81 characters long",
			"validate() must return -Expected puzzle to be 81 characters long- for a puzzle that contains other characters than numbers between 1-9 or dots (.)"
		);
	});
	//#4
	test("#handle a valid row placement", () => {
		let board = solver.parseInput(
			"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
		);

		let coordinates = solver.getCoordinates("A2");
		let value = "6";

		assert.strictEqual(
			solver.checkRowPlacement(
				board,
				coordinates.xCoordinate,
				coordinates.yCoordinate,
				value
			),
			false,
			"checkRowPlacement() must return false for a valid row placement"
		);
	});
	//#5
	test("#handle an invalid row placement", () => {
		let board = solver.parseInput(
			"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
		);
		let coordinates = solver.getCoordinates("A2");
		let value = "5";

		assert.strictEqual(
			solver.checkRowPlacement(
				board,
				coordinates.xCoordinate,
				coordinates.yCoordinate,
				value
			),
			"row",
			"checkRowPlacement() must return -row- for an invalid row placement"
		);
	});
	//#6
	test("#handle a valid column placement", () => {
		let board = solver.parseInput(
			"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
		);

		let coordinates = solver.getCoordinates("A4");
		let value = "6";

		assert.strictEqual(
			solver.checkColPlacement(
				board,
				coordinates.xCoordinate,
				coordinates.yCoordinate,
				value
			),
			false,
			"checkColPlacement() must return false for a valid column placement"
		);
	});
	//#7
	test("#handle an invalid column placement", () => {
		let board = solver.parseInput(
			"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
		);
		let coordinates = solver.getCoordinates("A4");
		let value = "7";

		assert.strictEqual(
			solver.checkColPlacement(
				board,
				coordinates.xCoordinate,
				coordinates.yCoordinate,
				value
			),
			"column",
			"checkColPlacement() must return -column- for an invalid column placement"
		);
	});
	//#8
	test("#handle a valid region placement", () => {
		let board = solver.parseInput(
			"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
		);

		let coordinates = solver.getCoordinates("A5");
		let value = "3";

		assert.strictEqual(
			solver.checkRegionPlacement(
				board,
				coordinates.xCoordinate,
				coordinates.yCoordinate,
				value
			),
			false,
			"checkRegionPlacement() must return false for a valid region placement"
		);
	});
	//#9
	test("#handle an invalid region placement", () => {
		let board = solver.parseInput(
			"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
		);
		let coordinates = solver.getCoordinates("A5");
		let value = "4";

		assert.strictEqual(
			solver.checkRegionPlacement(board, coordinates.boxNumber, value),
			"region",
			"checkRegionPlacement() must return -region- for an invalid column placement"
		);
	});
	//#10
	test("#valid puzzle string passes the solver", () => {
		let solution = solver.solve(
			"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
		);
		assert.notStrictEqual(solution, false, "Solution must not be false");
	});
	//#11
	test("#invalid puzzle string fails the solver", () => {
		let solution = solver.solve(
			"..9..5.1.85.4....2532......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
		).stringOutput;

		const unsolvableRegex = /\./g;
		let unsolvable = solution.match(unsolvableRegex);
		assert.ok(
			unsolvable,
			true,
			"Solution must be truthy. A regex tests the stringOutput of solution to be free from dots."
		);
	});
	//#12
	test("#valid but incomplete puzzle fails the solver", () => {
		let solution = solver.solve(
			"..9..5.1.85.4....32......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
		).stringOutput;
		const unsolvableRegex = /\./g;
		let unsolvable = solution.match(unsolvableRegex);
		assert.ok(
			unsolvable,
			true,
			"Solution must be truthy. A regex tests the stringOutput of solution to be free from dots."
		);
	});
});
