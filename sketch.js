const colors = {
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
    width = 20,
    height = 20;

let board;

function setup() {
    // randomSeed(0);

    createCanvas(scale * width, scale * height);
    noStroke();

    let worker = new Worker('worker.js');
    worker.onmessage = function(e) {
        board = e.data;
    };
    worker.postMessage({width, height});
}

function draw() {
    background(255);

    if (board === undefined) return;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            fill(colors[board[x][y]]);
            rect(x * scale, y * scale, scale, scale);
        }
    }
}
