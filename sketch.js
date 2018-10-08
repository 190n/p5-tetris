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
    width = 16,
    height = 16;

let board = [],
    allDrops = getAllDrops(),
    // goodDrops = {},
    allCombinations = [],
    dropsMade = [],
    globalStop = false;

function setup() {
    // randomSeed(2);

    createCanvas(scale * width, scale * height);
    noStroke();

    // create empty board
    for (let x = 0; x < width; x++) {
        board.push([]);
        for (let y = 0; y < height; y++) {
            board[x].push('');
        }
    }

    for (let s of shapes) {
        // goodDrops[s] = [];
        for (let o in orientations[s]) {
            // goodDrops[s][o] = allDrops.filter(d => d[0] == s && d[1] == o);
            allCombinations.push([s, o]);
        }
    }
}

function addOne() {
    if (globalStop) return;

    let foundOneThatWorks = false,
        drop,
        triedCombinations = [];

    while (!globalStop && !foundOneThatWorks) {
        let [s, o] = random(allCombinations);
        while (!globalStop && triedCombinations.some(c => (c[0] == s && c[1] == o))) {
            [s, o] = random(allCombinations);
        }

        triedCombinations.push([s, o]);
        if (triedCombinations.length >= allCombinations.length) {
            globalStop = true;
        }
        let drops = getGoodDrops(s, o);
        if (drops.length > 0) {
            drop = drops.sort((a, b) => getDropY(...b) - getDropY(...a))[0];
            foundOneThatWorks = true;
        }
    }

    if (globalStop) return;

    let y = dropShape(...drop);
    // [x, y, shape, o]
    dropsMade.push([drop[0], y, drop[1], drop[2]]);
}

function draw() {
    background(255);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            fill(colors[board[x][y]]);
            rect(x * scale, y * scale, scale, scale);
        }
    }

    addOne();
}
