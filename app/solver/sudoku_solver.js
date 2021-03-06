var fs = require('fs');

/**
* Reads in sudoku board from a file with spaces inbetween numbers and new line for
* each row.
* @param {string} filename - path to board text file
* @return {Array.<number[]>} A 2D array of numbers, ranging from 0-9
*/
function readInBoard(filename) { 
    var board = [];
    var data = fs.readFileSync(filename,'utf8');
    var remaining = '';
    remaining+=data;
    var index = remaining.indexOf('\n');
    
    while (index > -1) {
        var line = remaining.substring(0, index).split(' ');
        for(var i=0; i<line.length;i++) {line[i] = +line[i]} //convert string to numbers
        board.push(line);
        remaining = remaining.substring(index + 1);
        index = remaining.indexOf('\n');
    }
    return board;
}

/**
* Takes in a board and returns an array containing the locations of the empty cells.
* @param {Array.<number[]>} board - 2D array of numbers, ranging from 0-9 with size 
* numRows X numColns.
* @return {Array.<number[]>} An array containing the locations of the empty cells.
*/
function emptyCells(board) {
    var emptyCells = [];
    
    board.forEach(function(row,i) {
       row.forEach(function(value,j) {
           if(value=== 0) emptyCells.push([i,j])
       });
    });
    return emptyCells;
}

/**
* Checks a row from the board for the given value
* @param {Array.<number[]>} board - 2D array of numbers, ranging from 0-9 with size 
* numRows X numColns.
* @param {number} row - the row index that is being looped over
* @param {number} value - the value that is being compared
* @return {boolean} If match found return false, else return true
*/
function checkRow(board, row, value) {
    return board[row].every(function(col) {
       return (value !== col) 
    });
}

/**
* Checks a column from the board for the given value
* @param {Array.<number[]>} board - 2D array of numbers, ranging from 0-9 with size 
* numRows X numColns.
* @param {number} col - the column index that is being looped over
* @param {number} value - the value that is being compared
* @return {boolean} If match found return false, else return true
*/
function checkColumn(board, col, value) {
    var numRows = board.length;
    
    for(var i=0; i<numRows; i++) {
        if(value === board[i][col]) {
            return false;   
        }
    }
    return true;
}

/**
* Check region/box for value located in the given row/col pair
* @param {Array.<number[]>} board - 2D array of numbers, ranging from 0-9 with size 
* numRows X numColns.
* @param {number} row - the row index that is used to locate correct 3x3 box
* @param {number} col - the column index that is used to locate correct 3x3 box
* @param {number} value - the value that is being compared
* @return {boolean} If match found return false, else return true
*/
function checkBox(board, row, col, value, boxDim) { 
    var colBoxSize = boxDim.col;
    var rowBoxSize = boxDim.row;
    var rowNum = Math.floor(row/rowBoxSize);
    var colNum = Math.floor(col/colBoxSize);
    
    for(var i=rowNum*rowBoxSize; i<(rowNum+1)*rowBoxSize; i++) {
        for(var j=colNum*colBoxSize; j<(colNum+1)*colBoxSize; j++) {
            if(value === board[i][j]) {
                return false;   
            }
        }
    }
    return true;
}

/**
* Uses backtrace algorithm to solve a given board.
* @param {Array.<number[]>} board - 2D array of numbers, ranging from 0-9 with size 
* numRows X numColns.
* @param {Array.<number[]>} emptycells - 2D array containing the locations of emptycells.
* @return {Array.<number[]>|undefined} Returns solution if valid board is used, else 
* returns undefined
*/
function backtraceAlgorithm(board,emptycells) {
    var boxDim = calculateBoxDimensions(board.length);
    
    //duplicates in row, coln, and 3x3 squares cause an invalid board.
    if(!checkBoardValidity(board, boxDim)) {
        return undefined;
    }
    
    for(var c=0; c<emptycells.length;) {
        var row = emptycells[c][0];
        var col = emptycells[c][1];
        var value = board[row][col] + 1;
        var foundValue = false;
        
        while(!foundValue) {
            if(value > board.length) {
                c--;
                board[row][col] = 0;
                break;
            } else if(checkRow(board, row, value) &&  checkColumn(board, col, value) 
                      && checkBox(board, row, col, value, boxDim)) {
                board[row][col] = value;
                foundValue = true;
                c++;
            } else {
                value++;
            }
        }
        if(c<0) {
            return undefined;
        }
    }
    return board;
}


/**
* Sets up the puzzle and solves the puzzle. A filename can be given or a board can be given.
* @param {string} filename - path to board text file
* @param {Array.<number[]>} board - 2D array of numbers, ranging from 0-9 with size 
* numRows X numColns.
*/
function solvePuzzle(filename,board) {
    if(filename!==null) {
        var board = readInBoard(filename);  
    }
    var emptycells = emptyCells(board);
    return backtraceAlgorithm(board,emptycells)
}

/**
* Given a board checks for any duplicate entries in row, colomn, or 3x3 that would cause board to be invalid.
* @return {boolean} whether board is valid or not
*/
function checkBoardValidity(board, boxDim) {
    var isValid = true;
    
    board.forEach(function(row,i) {
        row.forEach(function(value,j) {
            if(value!==0) {
                var saveVal = board[i][j]; 
                board[i][j] = 0; //want to zero out the current position of the board, or else the 
                                 //check methods will always return true
                
                if(!checkRow(board, i, value) || !checkColumn(board, j, value) || !checkBox(board, i, j, value, boxDim)) {
                    isValid = false;   
                }
                
                board[i][j] = saveVal;      //set back to the correct value
            }
        });
    });   
    return isValid;
}

/**
* Given an NxN board, this function calculates what the box size. Example a 9x9 board has a box size of 3x3, a 6x6 board has a 
* box size of 2x3 (rows x columns). The larger number is always the column. This only works for 'regular' sudoku boards.
* @param  {number} n - size of the board
* @return {Object} boxDim - the correct box size dimensions
* @return {number} boxDim.col - the number of columns in a box
* @return {number} boxDim.row - the number of rows in a box
*/
function calculateBoxDimensions(n) {
    var largestPrime = _largestPrimeFactor(n);
    var otherFactor = n/largestPrime; 
    var colBoxSize = (largestPrime>otherFactor ? largestPrime : otherFactor);
    var rowBoxSize = n/colBoxSize; 

    return {
        col:colBoxSize,
        row:rowBoxSize
    }
    
    function _largestPrimeFactor(n){
        var i=2;
        while (i<=n){
            if (n%i == 0){
                n/=i;    
            }else{
                i++;
            }
        }
        return i;
    }
}
                     
module.exports = {
    solvePuzzle: solvePuzzle,
    readInBoard: readInBoard,
    emptyCells: emptyCells,
    checkRow: checkRow,
    checkColumn: checkColumn,
    checkBox: checkBox,
    checkBoardValidity: checkBoardValidity,
    calculateBoxDimensions: calculateBoxDimensions,
    backtraceAlgorithm: backtraceAlgorithm,
}
