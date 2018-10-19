/*
Title: p5-tetris
Imagined, Designed, and Programmed by: Ben Grant
Date: 2018-10-12
Description: Fills a board with Tetris shapes
Sources of ideas and inspiration (title, author, URL):
 * Tetris, by Alexey Pajitnov
 
Includes code from (title, author, URL):
 * https://en.wikipedia.org/wiki/Flood_fill (third pseudocode listing)
*/

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
    scale = 8,
    width = 64,
    height = 64;

let board = [],
    allDrops = getAllDrops(),
    allCombinations = [],
    dropsMade = [],
    globalStop = false,
    numToRemove = 1,
    pointsChanged = [];

function setup() {
    randomSeed(0);

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
        for (let o in orientations[s]) {
            allCombinations.push([s, o]);
        }
    }

    // start algorithm in another thread
    setTimeout(iter, 0);
}

function iter() {
    addOne();

    if (globalStop && dropsMade.length < width * height / 4) {
        for (let i = 0; i < numToRemove && dropsMade.length > 0; i++) removeOne();
        globalStop = false;
        numToRemove += 4;
    }

    if (!globalStop) setTimeout(iter, 0);
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

    let y = dropShapeForReal(...drop);
    // [x, y, shape, o]
    dropsMade.push([drop[0], y, drop[1], drop[2]]);
}

function dropShapeForReal(...drop) {
    let y = dropShape(...drop),
        [x, shape, o] = drop;
    for (let p of orientations[shape][o]) {
        pointsChanged.push([p[0] + x, p[1] + y]);
    }
    return y;
}

function clearShapeForReal(...drop) {
    clearShape(...drop);
    let [x, y, shape, o] = drop;
    for (let p of orientations[shape][o]) {
        pointsChanged.push([p[0] + x, p[1] + y]);
    }
}

function removeOne() {
    clearShapeForReal(...dropsMade.pop());
}

function draw() {
    let numChanged = pointsChanged.length;
    console.log(numChanged);
    for (let i = 0; i < numChanged; i++) {
        let [x, y] = pointsChanged.shift();
        fill(colors[board[x][y]]);
        rect(x * scale, y * scale, scale, scale);
    }
}
