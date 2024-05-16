const chai = require('chai');
const chaiHttp = require('chai-http');

const { assert } = chai;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('/api/solve Tests', () => {
    test('Solve a puzzle with valid puzzle string', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[2][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, puzzlesAndSolutions[2][1]);
          done();
        });
    });
    test('Solve a puzzle with missing puzzle string', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });
    test('Solve a puzzle with invalid characters', (done) => {
      const testPuzzle = puzzlesAndSolutions[2][0].replace('5', '$');
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: testPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });
    test('Solve a puzzle with incorrect length', (done) => {
      const testPuzzle = `${puzzlesAndSolutions[2][0]}2.9..`;
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: testPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });
    test('Solve a puzzle that cannot be solved', (done) => {
      let testPuzzle = puzzlesAndSolutions[2][0].slice(0, 34);
      testPuzzle += '1';
      testPuzzle += puzzlesAndSolutions[2][0].slice(35);
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: testPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });
  suite('/api/check Tests', () => {
    test('Check a puzzle placement with all fields', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[3][0], coordinate: 'A3', value: '1' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });
    test('Check a puzzle placement with single placement conflict', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[3][0], coordinate: 'B5', value: '8' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 1);
          done();
        });
    });
    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[3][0], coordinate: 'H8', value: '6' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 2);
          done();
        });
    });
    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[3][0], coordinate: 'A3', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 3);
          done();
        });
    });
    test('Check a puzzle placement with missing required fields', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[3][0], value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });
    test('Check a puzzle placement with invalid characters', (done) => {
      const testPuzzle = puzzlesAndSolutions[3][0].replace('2', '$');
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: testPuzzle, coordinate: 'A9', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });
    test('Check a puzzle placement with incorrect length', (done) => {
      const testPuzzle = `${puzzlesAndSolutions[3][0]}2.9..`;
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: testPuzzle, coordinate: 'A9', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });
    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[3][0], coordinate: 'S6', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });
    test('Check a puzzle placement with invalid placement value', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[3][0], coordinate: 'A3', value: '7$5s' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});
