var chai   = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var server = require("./server.js");


describe("Test api helper functions", function() {

    describe("test getEstimate function", function() {
        var result;
        var data = [];
        var value = {
            'bedrooms': 3,
            'bathrooms': 3,
            'price': 2344,
            'square-foot': 3223
        };
        data.push(value);

        it("should get an estimate with all data input", function() {
            result = server.getEstimate(data, 3, 3, 1243);
            expect(result).to.not.be.null;
        });
        it("should get an error when bath no data introduced", function() {
            result = server.getEstimate(null, 3, 4, 1243);
            expect(result).to.be.null;
        });
        it("should get an error when bath not introduced", function() {
            result = server.getEstimate(data, 3, null, 1243);
            expect(result).to.be.null;
        });
        it("should get an error when rooms not introduced", function() {
            result = server.getEstimate(data, null, 3, 1243);
            expect(result).to.be.null;
        });
        it("should get an error when sqft not introduced", function() {
            result = server.getEstimate(data, 3, 3, null);
            expect(result).to.be.null;
        });
    });

    describe("test getMedian function", function() {
        var sampleData = [453, 34,223,434,22,4432,43,2];
        var result;

        it("should get the median of an array", function() {
            result = server.getMedian(sampleData);
            expect(result).to.not.be.null;
        });
        it("it should return  null if array is empty", function() {
            result = server.getMedian([]);
            expect(result).to.be.null;
        });
        it("it should return null if array is null", function() {
            result = server.getMedian(null);
            expect(result).to.be.null;
        });
    });
});
