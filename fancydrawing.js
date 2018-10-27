// [base, outline, highlight]
const colorsDark = {
    i: ['#006064', '#003032', '#4dd0e1'],
    j: ['#0d47a1', '#072451', '#64b5f6'],
    l: ['#e65100', '#732900', '#ffb74d'],
    o: ['#f57f17', '#7b400c', '#fff176'],
    s: ['#1b5e20', '#0e2f10', '#81c784'],
    t: ['#311b92', '#190e49', '#9575cd'],
    z: ['#b71c1c', '#5c0e0e', '#e57373']
};

const colorsNeon = {
    i: ['#000000', '#000000', '#']
};

const colors = colorsDark,
    // rows/cols in grid that exists within cell
    drawingGridCells = 5,
    drawingCellSize = scale / drawingGridCells;

let shapesRaw,
    shapeData = {};

function parseShapeData() {
    let currentShape = null,
        currentOrientation = null,
        currentData = [];

    for (let s of shapes) {
        shapeData[s] = [];
    }

    for (let l of shapesRaw) {
        if (shapes.includes(l[0])) {
            if (currentShape !== null) {
                shapeData[currentShape][currentOrientation] = currentData;
                currentData = [];
            }

            currentShape = l[0];
            currentOrientation = parseInt(l[1]);
            continue;
        }

        currentData.push(l.split('').map(c => ({
            ' ': -1,
            '.': 0,
            'o': 1,
            '#': 2
        })[c]));
    }

    shapeData[currentShape][currentOrientation] = currentData;
}

// gx, gy are board coordinates
function drawShape(gx, gy, shape, o) {
    for (let y = 0; y < shapeData[shape][o].length; y++) {
        let row = shapeData[shape][o][y];
        for (let x = 0; x < row.length; x++) {
            let val = row[x];
            if (val == -1) {
                // empty
                continue;
            }

            fill(colors[shape][val]);

            // first calculate absolute position on the drawing grid
            // then convert to screen coordinates
            let ax = ((gx + spriteOffsets[shape][o][0]) * drawingGridCells) + x,
                ay = ((gy + spriteOffsets[shape][o][1]) * drawingGridCells) + y,
                sx = ax * drawingCellSize,
                sy = ay * drawingCellSize;
            rect(sx, sy, drawingCellSize, drawingCellSize);
        }
    }
}
