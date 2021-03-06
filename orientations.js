const orientations = {
    i: [
        [
            // ##
            // @@
            // ##
            // ##
            [0, -1], [0, 0], [0, 1], [0, 2]
        ],
        [
            // ## @@ ## ##
            [-1, 0], [0, 0], [1, 0], [2, 0]
        ]
    ],
    j: [
        [
            //    ##
            //    @@
            // ## ##
            [0, -1], [0, 0], [0, 1], [-1, 1]
        ],
        [
            // ##
            // ## @@ ##
            [-1, -1], [-1, 0], [0, 0], [1, 0]
        ],
        [
            // ## ##
            // @@
            // ##
            [0, -1], [1, -1], [0, 0], [0, 1]
        ],
        [
            // ## @@ ##
            //       ##
            [-1, 0], [0, 0], [1, 0], [1, 1]
        ]
    ],
    l: [
        [
            // ##
            // @@
            // ## ##
            [0, -1], [0, 0], [0, 1], [1, 1]
        ],
        [
            // ## @@ ##
            // ##
            [-1, 0], [-1, 1], [0, 0], [1, 0]
        ],
        [
            // ## ##
            //    @@
            //    ##
            [-1, -1], [0, -1], [0, 0], [0, 1]
        ],
        [
            //       ##
            // ## @@ ##
            [-1, 0], [0, 0], [1, 0], [1, -1]
        ]
    ],
    o: [
        [
            // @@ ##
            // ## ##
            [0, 0], [1, 0], [0, 1], [1, 1]
        ]
    ],
    s: [
        [
            //    @@ ##
            // ## ##
            [0, 0], [1, 0], [-1, 1], [0, 1]
        ],
        [
            // ##
            // ## @@
            //    ##
            [-1, -1], [-1, 0], [0, 0], [0, 1]
        ]
    ],
    t: [
        [
            //    ##
            // ## @@ ##
            [0, -1], [-1, 0], [0, 0], [1, 0]
        ],
        [
            // ##
            // @@ ##
            // ##
            [0, -1], [0, 0], [1, 0], [0, 1]
        ],
        [
            // ## @@ ##
            //    ##
            [-1, 0], [0, 0], [1, 0], [0, 1]
        ],
        [
            //    ##
            // ## @@
            //    ##
            [0, -1], [-1, 0], [0, 0], [0, 1]
        ]
    ],
    z: [
        [
            // ## @@
            //    ## ##
            [-1, 0], [0, 0], [0, 1], [1, 1]
        ],
        [
            //    ##
            // ## @@
            // ##
            [0, -1], [-1, 0], [0, 0], [-1, 1]
        ]
    ]
};

// board coordinates
const spriteOffsets = {
    i: [
        [0, -1],
        [-1, 0]
    ],
    j: [
        [-1, -1],
        [-1, -1],
        [0, -1],
        [-1, 0]
    ],
    l: [
        [0, -1],
        [-1, 0],
        [-1, -1],
        [-1, -1]
    ],
    o: [
        [0, 0]
    ],
    s: [
        [-1, 0],
        [-1, -1]
    ],
    t: [
        [-1, -1],
        [0, -1],
        [-1, 0],
        [-1, -1]
    ],
    z: [
        [-1, 0],
        [-1, -1]
    ]
};
