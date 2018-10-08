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
    size = 32;

let board = [],
    allDrops = getAllDrops(),
    // goodDrops = {},
    allCombinations = [],
    globalStop = false;

function setup() {
    // randomSeed(2);

    createCanvas(scale * size, scale * size);
    noStroke();

    // create empty board
    for (let x = 0; x < size; x++) {
        board.push([]);
        for (let y = 0; y < size; y++) {
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

    let timeout = setTimeout(_ => {
        globalStop = true;
    }, 1000);

    while (!globalStop && !foundOneThatWorks) {
        let [s, o] = random(allCombinations);
        while (!globalStop && triedCombinations.some(c => (c[0] == s && c[1] == o))) {
            [s, o] = random(allCombinations);
        }

        triedCombinations.push([s, o]);
        let drops = getGoodDrops(s, o);
        if (drops.length > 0) {
            drop = random(drops);
            foundOneThatWorks = true;
        }
    }
    dropShape(drop[0], drop[1], drop[2]);
    clearTimeout(timeout);
}

function draw() {
    background(255);
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            fill(colors[board[x][y]]);
            rect(x * scale, y * scale, scale, scale);
        }
    }

    addOne();
}
