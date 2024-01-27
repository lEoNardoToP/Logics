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

function changeBrightness (factor, sprite)  {
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500);
    var imgData = context.getImageData(0, 0, 500, 500);
    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = imgData.data[i] * factor;
        imgData.data[i + 1] = imgData.data[i + 1] * factor;
        imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }
    context.putImageData(imgData, 0, 0);
    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
}

function displayVictoryMess (moves) {
    document.getElementById("moves").innerHTML = "You Moved " + moves + Steps + ".";
    toggleVisablity ("Message-Container");
}

function toggleVisibility(id) {
    if (document.getElementById(id).style.visibility == "visible") {
        document.getElementById(id).style.visibility = "hidden";
    } else {
        document.getElementById(id).style.visibility = "visible";
    }
}

var percorso = []
features = document.getElementById("featuresCanvas");
ctx2 = features.getContext("2d");
var line = document.getElementById("line")
var ctx3 = line.getContext("2d")
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
        var n = 0;
        var reached  = false;
        var isComp = false;
        var move = false;
        var cellVisited = 1;
        var numLoops = 0;
        var maxLoops = 0;
        var pos = {
            x: startcoords.x,
            y: startcoords.y
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
                var nx = pos.x + modDir[direction].x;//la nuova x
                var ny = pos.y + modDir[direction].y;//la nuova y
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    //check per vedere se la casella è stata visitata
                    if (!mazeMap[nx][ny].visited) {
                        //scolpisci i muri da questa tessera alla successiva
                        mazeMap[pos.x][pos.y][direction] = true;//la positione è stata visitata
                        mazeMap[nx][ny][modDir[direction].o] = true;//la posizione precedente è stata visitata
                        if (!reached) {
                            percorso.push([pos.x, pos.y])
                            if (endcoords.x == pos.x && endcoords.y == pos.y) {
                                reached = true;
                            }
                        }
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
                if (!reached) {
                    percorso.pop()
                }
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
            case 2:
                startcoords = {
                    x: height - 1,
                    y: 0
                }
                endcoords = {
                    x: 0,
                    y: width - 1
                }
                break
            case 3:
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

function DrawMaze(Maze, ctx, cellsize, endSprite = null){
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    mazeCanvas.style.background = "green"
    ctx.strokeStyle = "yellow"
    ctx.lineWidth = cellSize / 40;
    ctx2.strokeStyle = "yellow"
    ctx2.lineWidth = cellSize / 40;
    this.redrawMaze = function (size){
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        drawMap();
        drawEndMethod();
    };
    function drawCircle (x, y) {
        if (rand(100) % 10 == 0){
            ctx2.beginPath()
            ctx2.moveTo(x,y)
            ctx2.fillStyle = "yellow"
            ctx2.arc(x, y, 100/difficulty, 0, 2*Math.PI);
            ctx2.fill()
        }
    }
    function drawCell(xCord, yCord, cell){
        var x = xCord * cellSize;
        var y = yCord * cellSize;
        if (cell.n === false){
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
            drawCircle (x + cellSize, y)
        }
        if (cell.s === false){
            ctx.beginPath();
            ctx.moveTo(x,y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
            drawCircle (x + cellSize, y + cellSize)
        }
        if (cell.e === false){
            ctx.beginPath();
            ctx.moveTo(x + cellSize,y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
            drawCircle (x, y)
        }
        if (cell.w === false){
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
            drawCircle (x, y + cellSize)
        }
    }
    function drawMap (){
        for (x=0; x < map.length; x++){
           for (y=0; y < map.length; y++){
            drawCell(x, y, map[x][y])
            }
        }
    }
    function drawEndFlag(){
        var coords = Maze.endCoords()
        var gridSize = 4;
        var fraction = cellSize / gridSize - 2;
        var colorSwap = true;
        for (let y = 0; y < gridSize; y++) {
            if (gridSize % 2 == 0) {
                colorSwap = !colorSwap;
            }
            for (let x = 0; x < gridSize; x++) {
                ctx.beginPath();
                ctx.rect(
                    coords.x * cellSize + x * fraction + 4.5,
                    coords.y * cellSize + y * fraction + 4.5,
                    fraction,
                    fraction
                );
                if (colorSwap) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                } else {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                }
                ctx.fill();
                colorSwap = !colorSwap;
            }
        }
    }
    function drawEndSprite() {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        var coord = Maze.endCoords();
        ctx.drawImage(
            endSprite,
            2,
            2,
            endSprite.width,
            endSprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }
    function clear() {
        var canvasSize = cellSize * map.length;
        ctx.clearRect(0, 0, canvasSize, canvasSize);
    }
    if (endSprite != null) {
        drawEndMethod = drawEndSprite;
    } else {
        drawEndMethod = drawEndFlag;
    }
    clear();
    drawMap();
    drawEndMethod();

}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var ctx = c.getContext("2d");
    var drawSprite;
    var moves = 0;
    drawSprite = drawSpriteCircle;
    if (sprite != null) {
        drawSprite = drawSpriteImg;
    }
    var player = this;
    var map = maze.map();
    var cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    };
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;
    this.redrawPlayer = function (_cellsize) {
        cellSize = _cellsize;
        drawSpriteImg(cellCoords);
    };

    function drawSpriteCircle(coord) {
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(
            (coord.x + 1) * cellSizehalfCellSize,
            (coord.y + 1) * cellSizehalfCellSize,
            halfCellSize - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();
        if (coord.x === maze.endCoords().x && coord.y === maze.endCoords().y)
        {
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function drawSpriteImg(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.drawImage(
            sprite,
            0,
            0,
            sprite.width,
            sprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
        if (coord.x === maze.endCoords().x && coord.y === maze.endCoords().y)
        {
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function removeSprite(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.clearRect(
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }
    function check(e) {
        var cell = map [cellCoords.x] [cellCoords.y];
        switch (e.keyCode) {
            case 65:
            case 37:// west
                if (cell.w === true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x - 1,
                        y: cellCoords.y
                    };
                    drawSprite(cellCoords);
                    moves++;
                }
                break;
            case 87:
            case 38: // north
                if (cell.n === true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x,
                        y: cellCoords.y - 1
                    };
                    drawSprite(cellCoords);
                    moves++;
                }
                break;
            case 68:
            case 39: // east
                if (cell.e === true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x + 1,
                        y: cellCoords.y
                    };
                    drawSprite(cellCoords);
                    moves++;
                }
                break;
            case 83 :
            case 40 : // south
                if (cell.s === true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x,
                        y: cellCoords.y + 1
                    };
                    drawSprite(cellCoords);
                    moves++;
                }
                break;
        }
    }

    this.bindKeyDown = function () {
            window.addEventListener("keydown", check, false);
            $("#view").on("swipe", {
                swipe: function (
                    event,
                    direction,
                    distance,
                    duration,
                    fingerCount,
                    fingerData
                ) {
                    console.log(direction);
                    switch (direction) {
                        case "up":
                            check({
                                keyCode: 38
                            });
                            break;
                        case "down":
                            check({
                                keyCode: 40
                            });
                            break;
                        case "left":
                            check({
                                keyCode: 37
                            });
                            break;
                        case "right":
                            check({
                                keyCode: 39
                            });
                            break;
                    }
                },
                threshold: 0,
            });
        };
    this.unbindKeyDown = function () {
            window.removeEventListener("keydown", check, false);
            $("#view").off("swipe");
    }
    drawSprite(maze.startCoord());
    this.bindKeyDown();
}
var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;
window.onload = function () {
    let windowWidth = $("#view").width;
    let windowHeight = $("#view").height;
    if (windowHeight < windowWidth) {
        ctx.canvas.width = windowHeight - windowHeight / 100;
        ctx.canvas.height = windowHeight - windowHeight / 100;
        ctx2.canvas.width = windowHeight - windowHeight / 100;
        ctx2.canvas.height = windowHeight - windowHeight / 100;
        ctx3.canvas.width = windowHeight - windowHeight / 100;
        ctx3.canvas.height = windowHeight - windowHeight / 100;
    } else {
        ctx.canvas.width = windowWidth - windowWidth / 100;
        ctx.canvas.height = windowWidth - windowWidth / 100;
        ctx2.canvas.width = windowWidth - windowWidth / 100;
        ctx2.canvas.height = windowWidth - windowWidth / 100;
        ctx3.canvas.width = windowWidth - windowWidth / 100;
        ctx3.canvas.height = windowWidth - windowWidth / 100;
    }
    var completeOne = false;
    var completeTwo = false;
    var isCompleted = () => {
        if (completeTwo === true && completeOne === true) {
            console.log("RUNS");
            setTimeout(function () {
                makeMaze();
            }, 500);
        }
    }
    sprite = new Image();
    sprite.src = "assets/elettrone.png"
    sprite.setAttribute("crossOrigin", " ");
    sprite.onload = function (){
        changeBrightness(1.2, sprite);
        completeOne = true;
        console.log(completeOne);
        isCompleted();
    };
};
window.onresize = function () {
    let viewWidth =  $("#view").width();
    let viewHeight =  $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
        ctx2.canvas.width = viewHeight - viewHeight / 100;
        ctx2.canvas.height = viewHeight - viewHeight / 100;
        ctx3.canvas.width = viewHeight - viewHeight / 100;
        ctx3.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
        ctx2.canvas.width = viewWidth - viewWidth / 100;
        ctx2.canvas.height = viewWidth - viewWidth / 100;
        ctx3.canvas.width = viewWidth - viewWidth / 100;
        ctx3.canvas.height = viewWidth - viewWidth / 100;
    }
    cellSize = mazeCanvas.width / difficulty;
    if (player != null){
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize)
    }
}
function  makeMaze () {
    showedsolution = false;
    percorso = []
    if (player != undefined) {
        player.unbindKeyDown();
        player = null;
    }
    var e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value;
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
        ctx2.canvas.width = viewHeight - viewHeight / 100;
        ctx2.canvas.height = viewHeight - viewHeight / 100;
        ctx3.canvas.width = viewHeight - viewHeight / 100;
        ctx3.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
        ctx2.canvas.width = viewWidth - viewWidth / 100;
        ctx2.canvas.height = viewWidth - viewWidth / 100;
        ctx3.canvas.width = viewWidth - viewWidth / 100;
        ctx3.canvas.height = viewWidth - viewWidth / 100;
    }
    cellSize = mazeCanvas.width / difficulty;
    console.log(cellSize)
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    if (document.getElementById("mazeContainer").style.opacity < 100){
        document.getElementById("mazeContainer").style.opacity = "100"
    }
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite)
}
var showedsolution = false
function showSolution(){
    if (! showedsolution) {
        ctx3.beginPath();
        ctx3.lineWidth = cellSize / 40;
        ctx3.strokeStyle = "blue"
        ctx3.moveTo(percorso[0][0] * cellSize + cellSize / 2, percorso[0][1] * cellSize + cellSize / 2)
        for (var i = 1; i < percorso.length; i++) {
            ctx3.lineTo(percorso[i][0] * cellSize + cellSize / 2, percorso[i][1] * cellSize + cellSize / 2)
            ctx3.stroke()
        }
        showedsolution = true;
    } else {
        ctx3.clearRect(0,0,line.width, line.height);
        showedsolution = false;
    }
}


window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
