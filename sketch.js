const shapes = 'ijlostz'.split(''),
    colors = {
        i: '#00ffff',
        j: '#0000ff',
        l: '#ff8000',
        o: '#00ffff',
        s: '#00ff00',
        t: '#800080',
        z: '#ff0000'
    },
    scale = 16,
    size = 32,
    board = [];

function setup() {
    createCanvas(scale * size, scale * size);
    noStroke();
    for (let x = 0; x < size; x++) {
        board.push([]);
        for (let y = 0; y < size; y++) {
            board[x].push(random(shapes));
        }
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