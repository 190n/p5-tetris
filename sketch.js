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

// pixels per board cell
const scale = 16,
    // in cells, not pixels
    width = 28,
    height = 20;

let board = [],
    // all possible combinations of x, shape, orientation
    allDrops,
    // all possible combinations of shape, orientation
    allCombinations = [],
    dropsMade = [],
    // set to true to stop iterating
    globalStop = false,
    // how many to remove when no more can be added and the board isn't full
    numToRemove = 1,
    // which shapes have been added or removed since the last redraw
    dropsChanged = [],
    // references to sprites for shape/orientation combinations
    sprites = {};

function preload() {
    // load all sprites
    for (let s of shapes) {
        sprites[s] = [];
        for (let o in orientations[s]) {
            sprites[s].push(loadImage('sprites/16s/' + s + o + '.png'));
        }
    }
}

function setup() {
    let seed = parseInt(prompt('Enter seed'));
    randomSeed(seed);
    document.getElementById('seed').innerHTML = 'Seed: ' + seed;

    createCanvas(scale * width, scale * height);
    noStroke();

    // create empty board
    for (let x = 0; x < width; x++) {
        board.push([]);
        for (let y = 0; y < height; y++) {
            board[x].push('');
        }
    }

    buildGlobals();

    // start algorithm in another thread
    setTimeout(iter, 0);
}

function iter() {
    addOne();

    if (globalStop && dropsMade.length < width * height / 4) {
        for (let i = 0; i < numToRemove && dropsMade.length > 0; i++) removeOne();
        globalStop = false;
        numToRemove++;
    }

    // run again immediately
    if (!globalStop) setTimeout(iter, 0);
}

function addOne() {
    if (globalStop) return;

    let foundOneThatWorks = false,
        drop,
        triedCombinations = [];

    // find a shape/orientation combination that works
    while (!globalStop && !foundOneThatWorks) {
        let [s, o] = random(allCombinations);
        while (!globalStop && triedCombinations.some(c => (c[0] == s && c[1] == o))) {
            [s, o] = random(allCombinations);
        }

        triedCombinations.push([s, o]);
        if (triedCombinations.length >= allCombinations.length) {
            globalStop = true;
        }

        // find all x-coordinates we can drop it at
        let drops = getGoodDrops(s, o);
        if (drops.length > 0) {
            // if any work, choose the one lowest on the board
            drop = drops.sort((a, b) => getDropY(...b) - getDropY(...a))[0];
            foundOneThatWorks = true;
        }
    }

    if (globalStop) return;

    // drop the shape
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
            // draw appropriate sprite
            image(sprites[s][o], (x + spriteOffsets[s][o][0]) * scale, (y + spriteOffsets[s][o][1]) * scale);
        } else {
            // fill the area covered by that shape with white
            fill(255);
            for (let p of orientations[s][o]) {
                rect((p[0] + x) * scale, (p[1] + y) * scale, scale, scale);
            }
        }
    }
}
