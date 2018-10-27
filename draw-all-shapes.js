let scale = 20,
    width = 40,
    height = 40;

function preload() {
    shapesRaw = loadStrings('shapes.txt');
}

function setup() {
    parseShapeData();
    createCanvas(scale * width, scale * height);
    noStroke();

    let x = 2, y = 2;

    for (let s in orientations) {
        for (let o in orientations[s]) {
            try {
                drawShape(x, y, s, parseInt(o));
            } catch(e) { console.log(s, o, e); }
            x += 5;
            if (x > 30) {
                x = 2;
                y += 5;
            }
        }
    }
}
