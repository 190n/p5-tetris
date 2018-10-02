const shapes = 'ijlostz'.split(''),
    colors = {
        i: '#00ffff',
        j: '#0000ff',
        l: '#ff8000',
        o: '#ffff00',
        s: '#00ff00',
        t: '#800080',
        z: '#ff0000',
        '': '#ffffff'
    },
    scale = 16,
    size = 32,
    board = [];

function setup() {
    createCanvas(scale * size, scale * size);
    noStroke();

    // create empty board
    for (let x = 0; x < size; x++) {
        board.push([]);
        for (let y = 0; y < size; y++) {
            board[x].push('');
        }
    }

    dropShape(16, 'i', 1);
    dropShape(16, 'i', 0);
    dropShape(16, 's', 1);
    dropShape(16, 'z', 0);
    dropShape(16, 'l', 0);
}

// places a shape on the board at a certain location
function placeShape(x, y, shape, o) {
    for (let point of orientations[shape][o]) {
        board[x + point[0]][y + point[1]] = shape;
    }
}

// drops a shape to the bottom of the board, obeying tetris rules
// returns false if the shape could not be dropped at specified position. returns true otherwise.
function dropShape(x, shape, o) {
    let y = getMinimumY(shape, o);
    while (checkShape(x, y, shape, o) && y <= getMaximumY(shape, o)) {
        y++;
    }
    if (y == getMinimumY(shape, o)) {
        // could not be dropped
        return false;
    }

    y--;
    placeShape(x, y, shape, o);
    return true;
}

// returns minimum y-coordinate for specified shape
function getMinimumY(shape, o) {
    return -Math.min.apply(null, orientations[shape][o].map(p => p[1]));
}

// returns maximum y-coordinate for specified shape
function getMaximumY(shape, o) {
    return size - 1 - Math.max.apply(null, orientations[shape][o].map(p => p[1]));
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

function draw() {
    background(255);
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            fill(colors[board[x][y]]);
            rect(x * scale, y * scale, scale, scale);
        }
    }
}