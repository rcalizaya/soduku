const SudokuSolver = require('../controllers/sudoku-solver');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (
        puzzle === '' || puzzle === undefined
        || coordinate === '' || coordinate === undefined
        || value === '' || value === undefined
      ) {
        return res.send({ error: 'Required field(s) missing' });
      }

      const message = solver.validate(puzzle);
      if (message !== true) return res.send({ error: message });
      if (Number.isNaN(Number(value)) || value > 9 || value < 1) return res.send({ error: 'Invalid value' });
      const coordinateRegex = /^[A-I][1-9]$/i;
      if (!coordinateRegex.test(coordinate)) return res.send({ error: 'Invalid coordinate' });

      const coordinateRows = 'ABCDEFGHI';
      const rowNumber = coordinateRows.indexOf(coordinate[0].toUpperCase()) + 1;
      const columnNumber = Number(coordinate[1]);

      const conflict = [];
      let valid = true;
      if (!solver.checkRowPlacement(puzzle, rowNumber, columnNumber, value)) { conflict.push('row'); }
      if (!solver.checkColPlacement(puzzle, rowNumber, columnNumber, value)) { conflict.push('column'); }
      if (!solver.checkRegionPlacement(puzzle, rowNumber, columnNumber, value)) { conflict.push('region'); }
      if (conflict.length > 0) valid = false;

      return res.send({ valid, conflict });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (puzzle === '' || puzzle === undefined) return res.send({ error: 'Required field missing' });

      const message = solver.validate(puzzle);
      if (message !== true) return res.send({ error: message });

      const solution = solver.solve(puzzle);
      if (solution === false) return res.send({ error: 'Puzzle cannot be solved' });

      return res.send({ solution });
    });
};
