const shapes = 'ijlostz'.split('');

// store results of calcMinimumY, calcMinimumX, calcMaximumX
// since those don't change depending on the board, and can be
// slow to calculate
// minMaxResults[shape][o][0] = minimum Y
// minMaxResults[shape][o][1] = minimum X
// minMaxResults[shape][o][2] = maximum X
let minMaxResults = {};

// places a shape on the board at a certain location
function placeShape(x, y, shape, o) {
    for (let point of orientations[shape][o]) {
        board[x + point[0]][y + point[1]] = shape;
    }
}

// removes a shape from the board
function clearShape(x, y, shape, o) {
    for (let point of orientations[shape][o]) {
        board[x + point[0]][y + point[1]] = '';
    }
}

// drops a shape to the bottom of the board, obeying tetris rules
// returns false if the shape could not be dropped at specified position. returns the final y coordinate otherwise.
function dropShape(x, shape, o) {
    let y = getMinimumY(shape, o);

    // place it as low on the board as possible
    while (checkShape(x, y, shape, o)) {
        y++;
    }
    if (y == getMinimumY(shape, o)) {
        // could not be dropped
        return false;
    }

    // previous code moves it down until it won't work
    // we need to move one unit back up to get a position that does work
    y--;
    placeShape(x, y, shape, o);
    return y;
}

// get y coordinate that a shape would be dropped at, without modifying the board
function getDropY(x, shape, o) {
    let y = dropShape(x, shape, o);
    if (y === false) return false;
    clearShape(x, y, shape, o);
    return y;
}

// returns whether or not dropping a shape from the specified point
// a) is possible, and
// b) would not block off a gap, and
// c) would not create a gap with area not a multiple of 4
function goodDrop(x, shape, o) {
    let y = dropShape(x, shape, o);
    if (y === false) return false;

    // scan down each column
    // if, after seeing at least one filled cell, we see an empty cell,
    // then this drop does not work as it would create an overhang
    for (let cx = Math.max(0, x - 2); cx <= Math.min(width - 1, x + 2); cx++) {
        let flag = false;
        for (let cy = 0; cy < height; cy++) {
            if (board[cx][cy] !== '') flag = true;
            if (flag && board[cx][cy] === '') {
                clearShape(x, y, shape, o);
                return false;
            }
        }
    }

    // only check gaps if the shape is near the top
    // if y >= 2, there is no way it exists in the top row
    // if y < 2, we can check against the actual shape
    if (y < 2 && y == getMinimumY(shape, o)) {
        // only check for a gap where we need to
        // e.g. if the top row looks like this (# = shape, . = gap)
        // x = 0 1 2 3 4 5 6 7
        //     # # . . . # . .
        // we only need to check for gaps at (2, 0) and (6, 0)

        // scan across the top row
        // if the current cell is empty and the previous cell
        // either was filled, or didn't exist (we're currently at x=0)
        // then we should check that position
        let last = true;
        for (let tx = 0; tx < width; tx++) {
            if (last && board[tx][0] == '') {
                if (getAreaSize(tx, 0) % 4 != 0) {
                    clearShape(x, y, shape, o);
                    return false;
                }
            }

            last = (board[tx][0] != '');
        }
    }

    clearShape(x, y, shape, o);
    return true;
}

// find all x positions at which we could draw this shape and orientation
function getGoodDrops(shape, o) {
    return allDrops.filter(d => d[1] == shape && d[2] == o && goodDrop(d[0], d[1], d[2]));
}

// returns minimum y-coordinate for placing the specified shape
function calcMinimumY(shape, o) {
    return -Math.min.apply(null, orientations[shape][o].map(p => p[1]));
}

// returns minimum x-coordinate for placing the specified shape
function calcMinimumX(shape, o) {
    return -Math.min.apply(null, orientations[shape][o].map(p => p[0]));
}

// returns maximum x-coordinate for placing the specified shape
function calcMaximumX(shape, o) {
    return width - 1 - Math.max.apply(null, orientations[shape][o].map(p =>p [0]));
}

// these functions just return the results we had calculated earlier
function getMinimumY(shape, o) {
    return minMaxResults[shape][o][0];
}

function getMinimumX(shape, o) {
    return minMaxResults[shape][o][1];
}

function getMaximumX(shape, o) {
    return minMaxResults[shape][o][2];
}

// checks whether a shape will overlap at a specific position
function checkShape(x, y, shape, o) {
    for (let p of orientations[shape][o]) {
        // if that cell is currently occupied, it doesn't work
        if (board[x + p[0]][y + p[1]] !== '') {
            return false;
        }
    }

    return true;
}

// returns a list of [x, shape, o] for every drop that could be made (whether or not they are good)
function getAllDrops() {
    let result = [];

    for (let s of shapes) {
        for (let o in orientations[s]) {
            for (let x = getMinimumX(s, o); x <= getMaximumX(s, o); x++) {
                result.push([x, s, o]);
            }
        }
    }

    return result;
}

// returns size of contiguous area around (x, y)
// based on flood fill algorithm (dark magic)
function getAreaSize(x, y) {
    let target = board[x][y],
        replacement = target + ' ',
        q = [[x, y]];

    while (q.length > 0) {
        let n = q.shift(),
            w = [...n],
            e = [...n];

        if (board[n[0]][n[1]] == replacement) continue;

        while (w[0] > 0 && board[w[0] - 1][w[1]] == target) w[0]--;
        while (e[0] < width - 1 && board[e[0] + 1][e[1]] == target) e[0]++;

        for (let cx = w[0]; cx <= e[0]; cx++) {
            board[cx][n[1]] = replacement;
            if (n[1] > 0 && board[cx][n[1] - 1] == target) q.push([cx, n[1] - 1]);
            if (n[1] < height - 1 && board[cx][n[1] + 1] == target) q.push([cx, n[1] + 1]);
        }
    }

    let count = 0;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (board[x][y] == replacement) {
                count++;
                board[x][y] = target;
            }
        }
    }

    return count;
}

function buildGlobals() {
    // build allCombinations and minMaxResults
    for (let s of shapes) {
        minMaxResults[s] = [];
        for (let o in orientations[s]) {
            allCombinations.push([s, o]);
            minMaxResults[s][o] = [
                calcMinimumY(s, o),
                calcMinimumX(s, o),
                calcMaximumX(s, o)
            ];
        }
    }

    allDrops = getAllDrops();
}
