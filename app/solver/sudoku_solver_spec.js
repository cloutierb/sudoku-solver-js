// sudoku_solver_spec.js
var Chai = require('chai');
var expect = Chai.expect;
var assert = Chai.assert;
var solver = require('./sudoku_solver');


var board9x9;
var board6x6;

var dim6x6 = {
    col:3,
    row:2
}
var dim9x9 = {
    col:3,
    row:3
}
var dim12x12 = {
    col:4,
    row:3
}

var emptyPositions9x9;

describe('#readInBoard()', function() {
    it('read in 9x9 board', function() {
        board9x9 = solver.readInBoard('./boards/example9x9.txt');
        var expectedBoard = [
            [0,9,0,0,0,0,0,0,6],
            [0,0,0,9,6,0,4,8,5],
            [0,0,0,5,8,1,0,0,0],
            [0,0,4,0,0,0,0,0,0],
            [5,1,7,2,0,0,9,0,0],
            [6,0,2,0,0,0,3,7,0],
            [1,0,0,8,0,4,0,2,0],
            [7,0,6,0,0,0,8,1,0],
            [3,0,0,0,9,0,0,0,0]];
        expect(board9x9.length).to.equal(9);
        expect(board9x9[0].length).to.equal(9);
        expect(board9x9).to.eql(expectedBoard);
    });
});

describe('#emptyCells()',function() {
    it('given a board, it should return an array of empty cells', function() {
        emptyPositions9x9 = solver.emptyCells(board9x9);
        
        var expectedPositions = [
            [0,0],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,0],[1,1],
            [1,2],[1,5],[2,0],[2,1],[2,2],[2,6],[2,7],[2,8],[3,0],
            [3,1],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[4,4],[4,5],
            [4,7],[4,8],[5,1],[5,3],[5,4],[5,5],[5,8],[6,1],[6,2],
            [6,4],[6,6],[6,8],[7,1],[7,3],[7,4],[7,5],[7,8],[8,1],
            [8,2],[8,3],[8,5],[8,6],[8,7],[8,8]
        ];
        expect(emptyPositions9x9.length).to.equal(51);
        expect(emptyPositions9x9).to.eql(expectedPositions);
    });
})

describe('#checkBoardValidity()', function() {
    it('valid board',function() {
        var validBoard = [
            [0,9,0,0,0,0,0,0,6],
            [0,0,0,9,6,0,4,8,5],
            [0,0,0,5,8,1,0,0,0],
            [0,0,4,0,0,0,0,0,0],
            [5,1,7,2,0,0,9,0,0],
            [6,0,2,0,0,0,3,7,0],
            [1,0,0,8,0,4,0,2,0],
            [7,0,6,0,0,0,8,1,0],
            [3,0,0,0,9,0,0,0,0]
        ];
        var boxDim = {
            col:3,
            row:3
        }
        expect(solver.checkBoardValidity(validBoard, boxDim)).to.equal(true); 
    });
    
    it('invalid board - duplicate row value', function() {
        var inValidBoard = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ];
        var boxDim = {
            col:3,
            row:3
        }
        expect(solver.checkBoardValidity(inValidBoard)).to.equal(false);
    });
    
    it('invalid board - duplicate column value',function() {
        var inValidBoard = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0]
        ];
        var boxDim = {
            col:4,
            row:3
        }
        expect(solver.checkBoardValidity(inValidBoard)).to.equal(false); 
    });
    
    it('invalid board - duplicate 4x4 value',function() {
        var inValidBoard = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,1,0,0],
            [0,0,0,0,0,0,0,0,0]
        ];
        var boxDim = {
            col:4,
            row:3
        }
        expect(solver.checkBoardValidity(inValidBoard, boxDim)).to.equal(false); 
    });
});

describe('#checkRow()',function() {
   it('it should check that each value given does not equal the input', function() {
      expect(solver.checkRow(board9x9,0,9)).to.equal(false);
      expect(solver.checkRow(board9x9,8,7)).to.equal(true);
   });
});

describe('#checkColn()',function() {
    it('it should check that each value given does not equal the input', function() {
        expect(solver.checkColumn(board9x9,0,5)).to.equal(false);
        expect(solver.checkColumn(board9x9,8,4)).to.equal(true);
    });
});

describe('#checkRegion()',function() {
    it('check 3x3 square (9x9 board)', function() {
        var boxDim = {
            col:3,
            row:3
        }
        expect(solver.checkRegion(board9x9,0,0,8,boxDim)).to.equal(true);
        expect(solver.checkRegion(board9x9,0,0,9,boxDim)).to.equal(false);
        expect(solver.checkRegion(board9x9,6,6,2,boxDim)).to.equal(false);
        expect(solver.checkRegion(board9x9,7,7,9,boxDim)).to.equal(true);
        expect(solver.checkRegion(board9x9,7,7,8,boxDim)).to.equal(false);
    });
    
    it('check 4x3 rectangle (12x12 board)', function() {
        var board12x12 = [[0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0],
                         [0,0,0,0,0,0,0,0,0,0,9,0],
                         [0,0,0,0,0,0,0,0,0,0,0,0]];
        var boxDim = {
            col:4,
            row:3
        }
        expect(solver.checkRegion(board12x12,0,0,8,boxDim)).to.equal(true);
        expect(solver.checkRegion(board12x12,11,11,9,boxDim)).to.equal(false);
    });
    it('check 3x2 rectangle (6x6 board)', function() {
        var board12x12 = [[0,0,0,0,0,0],
                          [0,0,0,0,0,0],
                          [0,0,0,0,0,0],
                          [0,0,0,0,0,0],
                          [0,0,0,9,0,0],
                          [0,0,0,0,0,0]];
        var boxDim = {
            col:3,
            row:2
        }
        expect(solver.checkRegion(board12x12,0,0,8,boxDim)).to.equal(true);
        expect(solver.checkRegion(board12x12,4,4,9,boxDim)).to.equal(false);
    });
});

describe('#backtraceAlgorithm()',function() {
    it('valid board - 9x9', function() {
        var expectSoln = [[ 8,9,5,7,4,2,1,3,6 ],
                        [ 2,7,1,9,6,3,4,8,5 ],
                        [ 4,6,3,5,8,1,7,9,2 ],
                        [ 9,3,4,6,1,7,2,5,8 ],
                        [ 5,1,7,2,3,8,9,6,4 ],
                        [ 6,8,2,4,5,9,3,7,1 ],
                        [ 1,5,9,8,7,4,6,2,3 ],
                        [ 7,4,6,3,2,5,8,1,9 ],
                        [ 3,2,8,1,9,6,5,4,7 ]];
        
        var soln = solver.backtraceAlgorithm(board9x9, emptyPositions9x9);
        expect(soln).to.eql(expectSoln);
    });
    
    it('invalid board - 9x9', function() {
        var inValidBoard = [[9,9,0,0,0,0,0,0,6],
                            [0,0,0,9,6,0,4,8,5],
                            [0,0,0,5,8,1,0,0,0],
                            [0,0,4,0,0,0,0,0,0],
                            [5,1,7,2,0,0,9,0,0],
                            [6,0,2,0,0,0,3,7,0],
                            [1,0,0,8,0,4,0,2,0],
                            [7,0,6,0,0,0,8,1,0],
                            [3,0,0,0,9,0,0,0,0]];
        
        var invalidSoln = solver.backtraceAlgorithm(inValidBoard, solver.emptyCells(inValidBoard));
        expect(invalidSoln).to.eql(undefined);
    });
    
    it('valid board - 6x6',function() {
        var board6x6 = [[1,2,3,4,5,6],
                        [6,0,0,0,0,0],
                        [0,0,0,0,3,0],
                        [0,4,0,0,0,0],
                        [0,0,0,2,0,0],
                        [0,3,0,0,0,1]];
        
        var expectedSoln = [[1,2,3,4,5,6],
                            [6,5,4,3,1,2],
                            [2,1,5,6,3,4],
                            [3,4,6,1,2,5],
                            [5,6,1,2,4,3],
                            [4,3,2,5,6,1]]; 

        var emptyPositions = solver.emptyCells(board6x6);
        var soln = solver.backtraceAlgorithm(board6x6,emptyPositions);
        expect(soln).to.eql(expectedSoln);
    });
});
    
