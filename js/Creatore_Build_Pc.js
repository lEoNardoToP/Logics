function rand (max){
    return Math.floor(Math.random() * max);
}

function shuffle (a){
    for (var i = a.length -1; i > 0; i--){
        const j = rand(i+1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startcoords, endcoords;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
        n: {
            y: -1,
            x: 0,
            o: "s"
        },
        s: {
            y: 1,
            x: 0,
            o: "n"
        },
        e: {
            y: 0,
            x: 1,
            o: "w"
        },
        w: {
            y: 0,
            x: -1,
            o: "e"
        }

    }
    this.map = function () {
        return mazeMap;
    }
    this.startCoord = function () {
        return startcoords;
    }
    this.endCoords = function () {
        return endcoords;
    }

    function genMap() {
        mazeMap = new Array(height);
        for (y = 0; y < height; y++) {
            mazeMap[y] = new Array(width);
            for (x = 0; x < width; x++) {
                mazeMap[y][x] = {
                    n: false,
                    s: false,
                    e: false,
                    w: false,
                    visited: false,
                    priorPos: null
                }
            }
        }
    }

    function defineMaze() {
        var isComp = false;
        var move = false;
        var cellVisited = 1;
        var numLoops = 0;
        var maxLoops = 0;
        var pos = {
            x: 0,
            y: 0
        }
        var numCells = width * height;
        while (!isComp) {
            move = false;
            mazeMap[pos.x][pos.y].visited = true;
            if (numLoops >= maxLoops) {
                shuffle(dirs);
                maxLoops = Math.round(rand(height / 8));
                numLoops = 0;
            }
            numLoops++;
            for (index = 0; index < dirs.length; index++) {
                var direction = dirs[index];
                var nx = pos.x + modDir[direciton].x;//la nuova x
                var ny = pos.y + modDir[direciton].y;//la nuova y
                if (nx >= 0 && nx <= width && ny >= 0 && ny < height) {
                    //check per vedere se la casella è stata visitata
                    if (!mazeMap[nx][ny].visited) {
                        //scolpisci i muri da questa tessera alla successiva
                        mazeMap[pos.x][pos.y][direction] = true;//la positione è stata visitata
                        mazeMap[nx][ny][modDir[direction].o] = true;//la posizione precedente è stata visitata

                        //setta questa cella come quella precedente
                        mazeMap[nx][ny].priorPos = pos;

                        pos = {
                            x: nx,
                            y: ny
                        };
                        cellVisited++;
                        //ricorsivamente chiama questo metodo sulla prossima cella
                        move = true;
                        break;
                    }
                }
            }
            if (!move) {
                //se ha fallito a trovare una direzione,
                //muovi la currentPosition indietro alla precedente e richiama il metodo
                pos = mazeMap[pos.x][pos.y].priorPos;
            }
            if (numCells == cellVisited) {
                isComp = true;
            }
        }
    }

    function defineStartEnd() {
        switch ((rand(4))) {
            case 0:
                startcoords = {
                    x: 0,
                    y: 0
                }
                endcoords = {
                    x: height - 1,
                    y: width - 1
                }
                break
            case 1:
                startcoords = {
                    x: 0,
                    y: width - 1
                }
                endcoords = {
                    x: height - 1,
                    y: 0
                }
                break
            case 0:
                startcoords = {
                    x: height - 1,
                    y: 0
                }
                endcoords = {
                    x: 0,
                    y: width - 1
                }
                break
            case 0:
                startcoords = {
                    x: height - 1,
                    y: width - 1
                }
                endcoords = {
                    x: 0,
                    y: 0
                }
                break
        }
    }
    genMap();
    defineStartEnd();
    defineMaze();
}


