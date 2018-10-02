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

    let x = 5, y = 5;
    for (let s of shapes) {
        for (let o in orientations[s]) {
            placeShape(x, y, s, o);
            x += 5;
            if (x > 25) {
                x = 5;
                y += 5;
            }
        }
    }
}

function placeShape(x, y, shape, o) {
    for (let point of orientations[shape][o]) {
        board[x + point[0]][y + point[1]] = shape;
    }
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