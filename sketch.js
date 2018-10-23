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
    width = 60,
    height = 40;

let board = [],
    allDrops = getAllDrops(),
    allCombinations = [],
    dropsMade = [],
    globalStop = false,
    numToRemove = 1,
    dropsChanged = [],
    sprites = {};

function preload() {
    for (let s of shapes) {
        sprites[s] = [];
        for (let o in orientations[s]) {
            sprites[s].push(loadImage('sprites/' + s + o + '.png'));
        }
    }
}

function setup() {
    // randomSeed(0);

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
    dropsChanged.push([x, y, shape, o, true]);
    return y;
}

function clearShapeForReal(...drop) {
    clearShape(...drop);
    let [x, y, shape, o] = drop;
    dropsChanged.push([x, y, shape, o, false]);
}

function removeOne() {
    clearShapeForReal(...dropsMade.pop());
}

function draw() {
    let numChanged = dropsChanged.length;
    for (let i = 0; i < numChanged; i++) {
        let [x, y, s, o, exists] = dropsChanged.shift();
        if (exists) {
            image(sprites[s][o], (x + spriteOffsets[s][o][0]) * scale, (y + spriteOffsets[s][o][1]) * scale);
        } else {
            fill(255);
            for (let p of orientations[s][o]) {
                rect((p[0] + x) * scale, (p[1] + y) * scale, scale, scale);
            }
        }
    }
}
