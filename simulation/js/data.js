cwidth = canv.offsetWidth
cheight = canv.offsetHeight


var heuristics = [];

var graphs = [
    function () {
        cwidth = canv.offsetWidth
        cheight = canv.offsetHeight

        heuristics = [0, 176, 100, 193, 253];

        // Make an array of coordinates
        cities = [
            [650 / 791 * cwidth, 450 / 500 * cheight], // Bucharest
            [350 / 791 * cwidth, 100 / 500 * cheight], // Fagaras
            [400 / 791 * cwidth, 320 / 500 * cheight], // Pitesti
            [150 / 791 * cwidth, 250 / 500 * cheight], // Rimnicu_Vilcea
            [100 / 791 * cwidth, 50 / 500 * cheight] // Sibiu
        ]

        citiesGraph = [
            [0, 1, 211],
            [0, 2, 101],
            [1, 4, 99],
            [2, 3, 97],
            [3, 4, 80],
        ]

        for (var i = 0; i < cities.length; i++) {
            nodes.push(cities[i]);
            edges[i] = [];
        }

        for (var i = 0; i < citiesGraph.length; i++) {
            edges[citiesGraph[i][0]].push([citiesGraph[i][1], citiesGraph[i][2]]);
            edges[citiesGraph[i][1]].push([citiesGraph[i][0], citiesGraph[i][2]]);
        }

        for (n = 0; n < nodes.length; n++) {
            exist.push(true);
            parent.push(null);
        }
        n--;
    }
    ,
    function () {
        cwidth = canv.offsetWidth
        cheight = canv.offsetHeight
        cities = [
            [586/791 * cwidth, 23/500 * cheight],
        ];
        
        citiesGraph = [

        ]

        for (var i = 0; i < cities.length; i++) {
            nodes.push(cities[i]);
            edges[i] = [];
        }

        for (var i = 0; i < citiesGraph.length; i++) {
            edges[citiesGraph[i][0]].push([citiesGraph[i][1], citiesGraph[i][2]]);
            edges[citiesGraph[i][1]].push([citiesGraph[i][0], citiesGraph[i][2]]);

            d = dist(nodes[citiesGraph[i][0]][0], nodes[citiesGraph[i][0]][1], nodes[citiesGraph[i][1]][0], nodes[citiesGraph[i][1]][1])/8;
            d = Math.ceil(d);
            console.log("distance from ", citiesGraph[i][0], "to", citiesGraph[i][1], "is", d);
        }

        for (n = 0; n < nodes.length; n++) {
            exist.push(true);
            parent.push(null);
        }
        n--;
    }
    , 
    function () {
        cities = [
            [159/791 * cwidth, 155/500 * cheight],
            [359/791 * cwidth, 95/500 * cheight],
            [586/791 * cwidth, 131/500 * cheight],
            [264/791 * cwidth, 254/500 * cheight],
            [452/791 * cwidth, 232/500 * cheight],
            [252/791 * cwidth, 412/500 * cheight],
            [546/791 * cwidth, 402/500 * cheight],
        ]

        citiesGraph = [
            [0, 1, 5],
            [0, 3, 3],
            [1, 2, 1],
            [1, 4, 4],
            [2, 4, 6],
            [2, 6, 8],
            [3, 4, 2],
            [3, 5, 2],
            [3, 6, 8],
            [4, 6, 4],
            [5, 6, 3],
        ]

        for (var i = 0; i < cities.length; i++) {
            nodes.push(cities[i]);
            edges[i] = [];
        }

        for (var i = 0; i < citiesGraph.length; i++) {
            edges[citiesGraph[i][0]].push([citiesGraph[i][1], citiesGraph[i][2]]);
            edges[citiesGraph[i][1]].push([citiesGraph[i][0], citiesGraph[i][2]]);
        }

        for (n = 0; n < nodes.length; n++) {
            exist.push(true);
            parent.push(null);
        }
        n--;
    }
]
