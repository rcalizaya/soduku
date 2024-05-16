class SudokuSolver {
  validate(puzzleString) {
    let message;
    if (puzzleString.length !== 81) {
      message = 'Expected puzzle to be 81 characters long';
      return message;
    }
    // eslint-disable-next-line no-useless-escape
    const regex = /^[\d|\.]+$/;
    if (!regex.test(puzzleString)) {
      message = 'Invalid characters in puzzle';
      return message;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let tempRow;
    const firstRowChar = (row - 1) * 9;
    tempRow = puzzleString.substr(firstRowChar, 9);
    tempRow = tempRow.substr(0, column - 1) + tempRow.substr(column);
    if (tempRow.includes(value)) return false;
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let tempCol = '';
    for (let i = 0; i < 9; i += 1) {
      tempCol += puzzleString[(column - 1) + i * 9];
    }
    tempCol = tempCol.substring(0, row - 1) + tempCol.substring(row);
    if (tempCol.includes(value)) return false;
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let region = '';
    let regionRows;
    let regionColumns;
    const regionColumnRow = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

    // indicate region row and column numbers.
    for (let i = 0; i < 3; i += 1) {
      if (regionColumnRow[i].includes(row)) regionRows = regionColumnRow[i];
      if (regionColumnRow[i].includes(column)) regionColumns = regionColumnRow[i];
    }

    // make the region
    let index;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (row === regionRows[i] && column === regionColumns[j]) continue;
        index = (regionRows[i] - 1) * 9 + (regionColumns[j] - 1);
        region += puzzleString[index];
      }
    }

    // check for value in region
    if (region.includes(value)) return false;
    return true;
  }

  solve(puzzleString) {
    let cell;
    let updatedPuzzle;
    let possibleValues;
    let puzzleNotComplete = true;
    while (puzzleNotComplete) {
      puzzleNotComplete = false;
      for (let row = 1; row <= 9; row += 1) {
        for (let col = 1; col <= 9; col += 1) {
          cell = puzzleString[(row - 1) * 9 + (col - 1)];
          if (cell === '.') {
            possibleValues = [];
            for (let num = 1; num <= 9; num += 1) {
              if (!this.checkRowPlacement(puzzleString, row, col, num)) continue;
              if (!this.checkColPlacement(puzzleString, row, col, num)) continue;
              if (!this.checkRegionPlacement(puzzleString, row, col, num)) continue;
              possibleValues.push(num);
            }
            if (possibleValues.length === 1) {
              puzzleNotComplete = true;
              updatedPuzzle = puzzleString.substring(0, (row - 1) * 9 + (col - 1));
              updatedPuzzle += possibleValues[0];
              updatedPuzzle += puzzleString.substring((row - 1) * 9 + col);
              puzzleString = updatedPuzzle;
              // console.log(`cell >> ${cell} - ${row} - ${col}`);
              // console.log("Replaced Value >> ", possibleValues[0]);
            }
          }
        }
      }
    }
    if (puzzleString.includes('.')) return false;
    return puzzleString;
  }
}

module.exports = SudokuSolver;
