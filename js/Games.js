let pezzi = ["L_alcontrario_tetris", "I_tetris", "quadrato_tetris", "z_tetris", "Z_alcontrario_tetris", "T_tetris", "L_tetris"];
var svg = []
var pezzoattivo = null;
var difficulty = false
$("#change").on("click", ()=>{
  difficulty = !difficulty;
})
function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}
addEventListener("keydown", (k)=>{
  if (pezzoattivo != null){
    var dim = pezzoattivo.elm.getBoundingClientRect();
    if (event.keycode === "ArrowLeft" || event.which === 37){
      if (dim.left - 100 > 0){
      var io = true;
      pezzoattivo.updatePolygon(-10, 0);
      for (pezzo of pezziingioco){
        if (intersect(pezzoattivo.polygon, pezzo.polygon)){
          io = false;
        }
      }
      if (io){
      pezzoattivo.elm.style.left = parseInt(pezzoattivo.elm.style.left) - (10) + "px";
      pezzoattivo.posizione.left = pezzoattivo.elm.style.left;
    } else {
      pezzoattivo.updatePolygon(10, 0);
    }
    }
  } else if (event.keycode === "ArrowRight" || event.which === 39){
      if (dim.right + 10 < window.innerWidth){
        var io = true;
        pezzoattivo.updatePolygon(10, 0);
        for (pezzo of pezziingioco){
          if (intersect(pezzoattivo.polygon, pezzo.polygon)){
            io = false;
          }
        }
      if (io){
      pezzoattivo.elm.style.left = parseInt(pezzoattivo.elm.style.left) + (10) + "px";
      pezzoattivo.posizione.left = pezzoattivo.elm.style.left;
    } else {
      pezzoattivo.updatePolygon(-10, 0);
    }
    }
  }
}
});
function ray_casting(point, polygon){
    var n=polygon.length,
        is_in=false,
        x=point[0],
        y=point[1],
        x1,x2,y1,y2;

    for(var i=0; i < n; ++i){
        x1=polygon[i][0];
        x2=polygon[(i+1)%n][0];
        y1=polygon[i][1];
        y2=polygon[(i+1)%n][1];

        if(y < y1 != y < y2 && x < (x2-x1) * (y-y1) / (y2-y1) + x1){
            is_in=!is_in;
        }
    }

    return is_in;
}

function intersect(polygon1, polygon2){
  for (point of polygon1){
    if (ray_casting(point, polygon2)){
      return true;
    }
  }
  for (point of polygon2){
    if (ray_casting(point, polygon1)){
      return true;
    }
  }
  return false;
}

const rotatePoint = (point, center, angle) => {
  const dx = point[0] - center[0];
  const dy = point[1] - center[1];
  const fromAngle = Math.atan2(dy, dx);
  const toAngle = fromAngle + angle;
  const radius = Math.hypot(dx, dy);
  const x = center[0] + radius * Math.cos(toAngle);
  const y = center[1] + radius * Math.sin(toAngle);
  return [x, y];
};
class tetrispiece {
  pezzo;
  elm;
  dimensioni;
  gradi;
  posizione;
  polygon = [];
  constructor (elm, pezzo, gradi, posizione){
    this.pezzo = pezzo;
    this.elm = elm;
    this.dimensioni = {width : this.elm.getBoundingClientRect().width, height : this.elm.getBoundingClientRect().height}
    this.gradi = gradi;
    this.posizione = posizione;
    switch (this.pezzo){
      case "L_alcontrario_tetris" :
        this.polygon = [[this.dimensioni.width*2/3,0],[this.dimensioni.width,0],[this.dimensioni.width, this.dimensioni.height], [0, this.dimensioni.height], [0, this.dimensioni.height/2], [this.dimensioni.width*2/3, this.dimensioni.height/2]]
      break;
      case "I_tetris" :
        this.polygon = [[0,0],[this.dimensioni.width, 0], [this.dimensioni.width, this.dimensioni.height], [0,this.dimensioni.height]]
      break;
      case "quadrato_tetris" :
        this.polygon = [[0,0],[this.dimensioni.width, 0], [this.dimensioni.width, this.dimensioni.height], [0,this.dimensioni.height]]
      break;
      case "z_tetris":
        this.polygon = [[this.dimensioni.width/3, 0], [this.dimensioni.width, 0], [this.dimensioni.width, this.dimensioni.height/2], [this.dimensioni.width*2/3,this.dimensioni.height/2], [this.dimensioni.width*2/3,this.dimensioni.height], [0,this.dimensioni.height], [0,this.dimensioni.height/2], [this.dimensioni.width/3,this.dimensioni.height/2]]
        break;
      case "Z_alcontrario_tetris" :
        this.polygon = [[0,0], [this.dimensioni.width*2/3,0], [this.dimensioni.width*2/3, this.dimensioni.height/2], [this.dimensioni.width, this.dimensioni.height/2],[this.dimensioni.width, this.dimensioni.height], [this.dimensioni.width/3, this.dimensioni.height], [this.dimensioni.width/3, this.dimensioni.height/2], [0, this.dimensioni.height/2]]
      break;
      case "T_tetris" :
        this.polygon = [[this.dimensioni.width/3,0], [this.dimensioni.width*2/3,0], [this.dimensioni.width*2/3,this.dimensioni.height/2], [this.dimensioni.width,this.dimensioni.height/2], [this.dimensioni.width,this.dimensioni.height], [0,this.dimensioni.height], [0, this.dimensioni.height/2], [this.dimensioni.width/3,this.dimensioni.height/2]]
      break;
      case "L_tetris" :
        this.polygon = [[0,0],[this.dimensioni.width/3,0],[this.dimensioni.width/3, this.dimensioni.height/2],[this.dimensioni.width,this.dimensioni.height/2], [this.dimensioni.width,this.dimensioni.height], [0,this.dimensioni.height]]
      break;
    }
    this.polygon = this.polygon.map(p => rotatePoint(p,[this.dimensioni.width/2, this.dimensioni.height/2],gradi))
    for (var i = 0; i < this.polygon.length; i++){
      var coords = getCoords(this.elm)
      this.polygon[i][0] += coords.left
      this.polygon[i][1] += coords.top
    }
  }
  updatePolygon (x, y) {
    for (var i = 0; i < this.polygon.length; i++){
      this.polygon[i][0] += x
      this.polygon[i][1] += y
    }
  }
}
let tetris = document.querySelector("#tetris");
var base = document.querySelector("#base");
var pezziingioco = [new tetrispiece(document.getElementById("base"), "I_tetris", 0, {left : 0, top : 0})];
pezziingioco[0].updatePolygon(pezziingioco[0].posizione.left, pezziingioco[0].posizione.top);
let degrees = [0, Math.PI/2, Math.PI, Math.PI*3/2]
var altezza = 0;
async function game (){
  while (true){
    if(pezzoattivo == null){
      altezza = 0;
      var i = Math.floor(Math.random()*7);
      tetris.innerHTML += '<img class="'+pezzi[i]+'" src="assets/'+ pezzi[i] +'.png" alt="" />'
      await new Promise(r => setTimeout(r, 50));
      pezzoattivo = new tetrispiece(tetris.lastElementChild, pezzi[i], degrees[Math.floor(Math.random()*4)], {left : tetris.lastElementChild.getBoundingClientRect().left, top : 0});
      pezzoattivo.elm.style.rotate = pezzoattivo.gradi + "rad";
      pezzoattivo.elm.style.left = Math.floor(window.innerWidth/2) + "px"
    } else {
      altezza += 1;
      var cango = true;
      for (pezzo of pezziingioco){
        if (intersect(pezzoattivo.polygon, pezzo.polygon)){
          console.log(pezzoattivo, pezzo)
          cango = false;
          break;
        }
      }
      if (cango) {
        pezzoattivo.elm.style.top = altezza + "px";
        pezzoattivo.posizione.top = altezza;
        pezzoattivo.updatePolygon(0, 1);
        /*
        var string = ""
        for (l of pezzoattivo.polygon){
          string += l[0] + ", " + (l[1]) + " "
        }
        s = ""
        for (i of pezziingioco){
          s += ' <polygon points="'
          for (j of i.polygon){
            s += j[0] + ", " + (j[1]) + " "
          }
          s += '" style="fill:lime;stroke:purple;stroke-width:1" />'
        }
        document.querySelector("#platform").innerHTML = s + ' <polygon points="'+string+'" style="fill:lime;stroke:purple;stroke-width:1" />'
        */
        await new Promise(r => setTimeout(r, 2));
      } else {
        pezziingioco.push(pezzoattivo);
        if (pezzoattivo.posizione.top <= 0) {
          tetris.innerHTML = '<img src="assets/I_tetris.png" id="base">'
          pezziingioco = [new tetrispiece(document.getElementById("base"), "I_tetris", 0, {left : 0, top : 0})];
          pezziingioco[0].updatePolygon(pezziingioco[0].posizione.left, pezziingioco[0].posizione.top);
        }
        pezzoattivo = null;
      }
    }

  }
}
game();
