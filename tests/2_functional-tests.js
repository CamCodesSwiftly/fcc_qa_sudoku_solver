const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
	suite("/API/SOLVE - Solve Puzzle with...", () => {
		test("...valid puzzle string", function (done) {
			chai.request(server)
				.post("/api/solve")
				.send({
					puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
				}) // Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"solution",
						"solution property should exist in response"
					);
					done();
				});
		});
		test("...missing puzzle string", function (done) {
			chai.request(server)
				.post("/api/solve")
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"error",
						"error property should exist in response"
					);
					assert.strictEqual(
						res.body.error,
						"Required field missing"
					);
					done();
				});
		});
		test("...invalid characters in puzzle string", function (done) {
			chai.request(server)
				.post("/api/solve")
				.send({
					puzzle: "..abc.7.5!5.....964..&.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"error",
						"error property should exist in response"
					);
					assert.strictEqual(
						res.body.error,
						"Invalid characters in puzzle"
					);
					done();
				});
		});
		test("...invalid length on puzzle string", function (done) {
			chai.request(server)
				.post("/api/solve")
				.send({
					puzzle: "39.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"error",
						"error property should exist in response"
					);
					assert.strictEqual(
						res.body.error,
						"Expected puzzle to be 81 characters long"
					);
					done();
				});
		});
		test("...insolvable puzzle string", function (done) {
			chai.request(server)
				.post("/api/solve")
				.send({
					puzzle: "..9..5.1.85.4....5132......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"error",
						"error property should exist in response"
					);
					assert.strictEqual(
						res.body.error,
						"Puzzle cannot be solved"
					);
					done();
				});
		});
	});
	suite("/API/CHECK - Check placement with...", () => {
		test("...all fields", function (done) {
			chai.request(server)
				.post("/api/check")
				.send({
					puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
					coordinate: "E4",
					value: "2",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"valid",
						"valid property should exist in response"
					);
					assert.strictEqual(
						res.body.valid,
						true,
						"response must be valid: true"
					);
					done();
				});
		});
		test("...single placement conflict", function (done) {
			chai.request(server)
				.post("/api/check")
				.send({
					puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
					coordinate: "E4",
					value: "4",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"valid",
						"valid property should exist in response"
					);
					assert.property(
						res.body,
						"conflict",
						"conflict property should exist in response"
					);
					assert.isArray(
						res.body.conflict,
						"conflict must be an array"
					);
					assert.strictEqual(
						res.body.valid,
						false,
						"response must contain valid: false"
					);
					assert.strictEqual(
						res.body.conflict.length,
						1,
						"conflict must hold exactly one conflict"
					);
					done();
				});
		});
		test("...multiple placement conflict", function (done) {
			chai.request(server)
				.post("/api/check")
				.send({
					puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
					coordinate: "E4",
					value: "9",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"valid",
						"valid property should exist in response"
					);
					assert.property(
						res.body,
						"conflict",
						"conflict property should exist in response"
					);
					assert.isArray(
						res.body.conflict,
						"conflict must be an array"
					);
					assert.strictEqual(
						res.body.valid,
						false,
						"response must contain valid: false"
					);
					assert.ok(
						res.body.conflict.length > 1,
						true,
						"number of entries in conflict must be more than 1"
					);
					done();
				});
		});
		test("...all placement conflicts", function (done) {
			chai.request(server)
				.post("/api/check")
				.send({
					puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
					coordinate: "H2",
					value: "4",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"valid",
						"valid property should exist in response"
					);
					assert.property(
						res.body,
						"conflict",
						"conflict property should exist in response"
					);
					assert.isArray(
						res.body.conflict,
						"conflict must be an array"
					);
					assert.strictEqual(
						res.body.valid,
						false,
						"response must contain valid: false"
					);
					assert.strictEqual(
						res.body.conflict.length === 3,
						true,
						"number of entries in conflict must be exactly 3"
					);
					done();
				});
		});
		test("...missing required fields", function (done) {
			chai.request(server)
				.post("/api/check")
				.send({
					puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
					coordinate: "H2",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"error",
						"error property should exist in response"
					);

					assert.strictEqual(
						res.body.error,
						"Required field(s) missing",
						"error property must contain exactly -Required field(s) missing-"
					);

					done();
				});
		});
		test("...invalid characters", function (done) {
			chai.request(server)
				.post("/api/check")
				.send({
					puzzle: "..9..5.1.85.4....abc$......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
					coordinate: "H2",
					value: "3",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"error",
						"error property should exist in response"
					);

					assert.strictEqual(
						res.body.error,
						"Invalid characters in puzzle",
						"error property must contain exactly -Invalid characters in puzzle-"
					);

					done();
				});
		});
		test("...incorrect puzzle length", function (done) {
			chai.request(server)
				.post("/api/check")
				.send({
					puzzle: "1234.3..6..",
					coordinate: "H2",
					value: "3",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"error",
						"error property should exist in response"
					);

					assert.strictEqual(
						res.body.error,
						"Expected puzzle to be 81 characters long",
						"error property must contain exactly -Expected puzzle to be 81 characters long-"
					);

					done();
				});
		});
		test("...invalid placement coordinate", function (done) {
			chai.request(server)
				.post("/api/check")
				.send({
					puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
					coordinate: "H2",
					value: "@2",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"error",
						"error property should exist in response"
					);

					assert.strictEqual(
						res.body.error,
						"Invalid value",
						"error property must contain exactly -Invalid value-"
					);

					done();
				});
		});
		test("...invalid placement value", function (done) {
			chai.request(server)
				.post("/api/check")
				.send({
					puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
					coordinate: "bBlabl31",
					value: "3",
				})
				// Provide the desired query parameters
				.end(function (err, res) {
					assert.equal(err, null); // No error should occur
					assert.equal(res.status, 200);
					assert.property(
						res.body,
						"error",
						"error property should exist in response"
					);

					assert.strictEqual(
						res.body.error,
						"Invalid coordinate",
						"error property must contain exactly -Invalid coordinate-"
					);

					done();
				});
		});
	});
});
