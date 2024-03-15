const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
	test("POST /api/check - No puzzle given", function (done) {
		chai.request(server)
			.post("/api/check")
			.send({
				coordinate: "A1",
				value: "8",
			}) // Provide the desired query parameters
			.end(function (err, res) {
				assert.equal(err, null); // No error should occur
				assert.equal(res.status, 200);
				assert.property(
					res.body,
					"error",
					"error property should exist in response"
				);
				// Check for correct error message
				assert.equal(
					res.body.error,
					"Required field(s) missing",
					"Error should equal Required field(s) missing"
				);

				done();
			});
	});
});
