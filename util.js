const shapes = 'ijlostz'.split('');

// places a shape on the board at a certain location
function _placeShape(x, y, shape, o) {
    for (let point of orientations[shape][o]) {
        board[x + point[0]][y + point[1]] = shape;
    }
}

// removes a shape from the board
function _clearShape(x, y, shape, o) {
    for (let point of orientations[shape][o]) {
        board[x + point[0]][y + point[1]] = '';
    }
}

// drops a shape to the bottom of the board, obeying tetris rules
// returns false if the shape could not be dropped at specified position. returns the final y coordinate otherwise.
function dropShape(x, shape, o) {
    let y = getMinimumY(shape, o);
    while (checkShape(x, y, shape, o)) {
        y++;
    }
    if (y == getMinimumY(shape, o)) {
        // could not be dropped
        return false;
    }

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
// b) would not block off a gap
function goodDrop(x, shape, o) {
    let y = dropShape(x, shape, o);
    if (y === false) return false;

    // scan down each column
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

    clearShape(x, y, shape, o);
    return true;
}

function getGoodDrops(shape, o) {
    return allDrops.filter(d => d[1] == shape && d[2] == o && goodDrop(d[0], d[1], d[2]));
}

// returns minimum y-coordinate for placing the specified shape
function getMinimumY(shape, o) {
    return -Math.min.apply(null, orientations[shape][o].map(p => p[1]));
}

// returns minimum x-coordinate for placing the specified shape
function getMinimumX(shape, o) {
    return -Math.min.apply(null, orientations[shape][o].map(p => p[0]));
}

// returns maximum x-coordinate for placing the specified shape
function getMaximumX(shape, o) {
    return width - 1 - Math.max.apply(null, orientations[shape][o].map(p =>p [0]));
}

// checks whether a shape will overlap at a specific position
function checkShape(x, y, shape, o) {
    for (let p of orientations[shape][o]) {
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

// selects random item from array
let random;

// only call this when seeded RNG has been loaded
function initRandom() {
    random = (function() {
        // seed with random value
        let rng = new Math.seedrandom(Math.random());

        return function random(arr) {
            return arr[Math.floor(rng() / arr.length)];
        }
    })();
}