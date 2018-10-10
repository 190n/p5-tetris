importScripts('seedrandom.min.js', 'util.js', 'orientations.js');

let i = 0,
    width,
    height,
    board = [],
    allDrops = getAllDrops(),
    // goodDrops = {},
    allCombinations = [],
    dropsMade = [],
    globalStop = false,
    numToRemove = 1;

onmessage = function(e) {
    width = e.data.width;
    height = e.data.height;
    run();
}

function placeShape(...args) {
    _placeShape(...args);
    boardChanged();
}

function clearShape(...args) {
    _clearShape(...args);
    boardChanged();
}

function boardChanged() {
    if (++i < 10) return;
    i = 0;
    postMessage(board);
}

function search(initial) {
    // if (initial === undefined)
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

function removeOne() {
    clearShape(...dropsMade.pop());
}

function init() {
    // create empty board
    for (let x = 0; x < width; x++) {
        board.push([]);
        for (let y = 0; y < height; y++) {
            board[x].push('');
        }
    }

    postMessage(board);

    for (let s of shapes) {
        // goodDrops[s] = [];
        for (let o in orientations[s]) {
            // goodDrops[s][o] = allDrops.filter(d => d[0] == s && d[1] == o);
            allCombinations.push([s, o]);
        }
    }
}

function iter() {
    addOne();

    if (globalStop && dropsMade.length < width * height / 4) {
        for (let i = 0; i < numToRemove && dropsMade.length > 0; i++) removeOne();
        globalStop = false;
        numToRemove++;
    }
}

function run() {
    initRandom();
    init();
    for (let i = 0; i < 100; i++) iter();
}