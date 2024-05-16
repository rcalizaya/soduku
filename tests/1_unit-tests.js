const chai = require('chai');

const { assert } = chai;

const Solver = require('../controllers/sudoku-solver');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

const solver = new Solver();

suite('Unit Tests', () => {
  suite('Validate Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
      assert.equal(solver.validate(puzzlesAndSolutions[0][0]), true);
      done();
    });
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
      const testPuzzle = puzzlesAndSolutions[0][0].replace(9, '$');
      assert.equal(
        solver.validate(testPuzzle),
        'Invalid characters in puzzle',
      );
      done();
    });
    test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
      const testPuzzle = `${puzzlesAndSolutions[0][0]}2.63.`;
      assert.equal(
        solver.validate(testPuzzle),
        'Expected puzzle to be 81 characters long',
      );
      done();
    });
  });
  suite('Check Placement Tests', () => {
    test('Logic handles a valid row placement', (done) => {
      assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 2, 8, 5), true);
      done();
    });
    test('Logic handles an invalid row placement', (done) => {
      assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 2, 8, 6), false);
      done();
    });
    test('Logic handles a valid column placement', (done) => {
      assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 7, 3, 3), true);
      done();
    });
    test('Logic handles an invalid column placement', (done) => {
      assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 7, 3, 5), false);
      done();
    });
    test('Logic handles a valid region (3x3 grid) placement', (done) => {
      assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 4, 6, 9), true);
      done();
    });
    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
      assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 4, 6, 2), false);
      done();
    });
    test('Valid puzzle strings pass the solver', (done) => {
      assert.equal(solver.solve(puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1]);
      done();
    });
    test('Invalid puzzle strings fail the solver', (done) => {
      let testPuzzle = puzzlesAndSolutions[0][0].slice(0, 20);
      testPuzzle += '3';
      testPuzzle += puzzlesAndSolutions[0][0].slice(21);
      assert.equal(solver.solve(testPuzzle), false);
      done();
    });
    test('Valid puzzle strings pass the solver', (done) => {
      assert.equal(solver.solve(puzzlesAndSolutions[1][0]), puzzlesAndSolutions[1][1]);
      done();
    });
  });
});
