let bubbleContainer = document.querySelectorAll(".bubble-container")
var arrayOfClassObjects  = Array.from(bubbleContainer);
/*
var array  = Array.from(classobject);
for (var i = 0; i < array.length; i++){
  classobject[i].style.top = getComputedStyle(classobject[i]).top;
  classobject[i].style.left = getComputedStyle(classobject[i]).left;
}
  var moving = setInterval(()=>{
    var array  = Array.from(classobject);
    for (var i = 0; i < classobject.length; i++){
      var array  = Array.from(classobject);
      if (parseInt(classobject[i].style.top) < this.newq[i==0?1:i*2-1]){
        classobject[i].style.top = parseInt(classobject[i].style.top) + 1 + "px"
      } else if (parseInt(classobject[i].style.top) > this.newq[i==0?1:i*2-1]){
        classobject[i].style.top = parseInt(classobject[i].style.top) - 1 + "px"
      } else {
        this.newq = makeNewPosition(array.length);
      }
      if (parseInt(classobject[i].style.left) < this.newq[i*2]){
        classobject[i].style.left = parseInt(classobject[i].style.left) + 1 + "px"
      } else if (parseInt(classobject[i].style.left) > this.newq[i*2]){
        classobject[i].style.left = parseInt(classobject[i].style.left) - 1 + "px"
      }  else {
        this.newq = makeNewPosition(array.length);
      }
      var xi = classobject[i].getBoundingClientRect().right;
      var yi = classobject[i].getBoundingClientRect().top;
      var ri = parseInt(getComputedStyle(classobject[i]).width)/2;
      array.splice(i,1);
      for (var j = 0; j < array.length; j++){
        console.log(array[j])
        var xj = array[j].getBoundingClientRect().right;
        var yj = array[j].getBoundingClientRect().top;
        var rj = parseInt(getComputedStyle(array[j]).width)/2;
        var dx = Math.abs(xi - xj);
        var dy = Math.abs(yi - yj);
        var dist = Math.sqrt(dx**2 + dy**2);
        console.log(dist, rj, ri)
        if (dist <= rj + ri) {
          this.newq = makeNewPosition(array.length);
        }
      }
    }
  },20)


animateBubble(bubbleContainer)


function makeNewPosition(num){

    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 200;
    var w = $(window).width() - 200;
    var arr = [];
    for (var i = 0; i<=num; i++){
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    arr.push(nh);arr.push(nw);
  }
    return arr;

}

async function animateBubble(classobject){
    for (var i = 0; i < classobject.length; i++){
      var np = makeNewPosition(1);
      $(classobject[i]).animate({top:np[0], left:np[1]}, 5000)
    }
    animateBubble(classobject)
};
*/
/*
var VIEW = {};
VIEW.SAFE_WIDTH = 100;
VIEW.SAFE_HEIGHT = 100;
VIEW.scale = Math.min(window.innerWidth / VIEW.SAFE_WIDTH, window.innerHeight / VIEW.SAFE_HEIGHT);
VIEW.width = window.innerWidth / VIEW.scale;
VIEW.height = window.innerHeight / VIEW.scale;
VIEW.centerX = VIEW.width / 2;
VIEW.centerY = VIEW.height / 2;
VIEW.offsetX = (VIEW.width - VIEW.SAFE_WIDTH) / 2 / VIEW.scale;
VIEW.offsetY = (VIEW.height - VIEW.SAFE_HEIGHT) / 2 / VIEW.scale;

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var runner = Runner.create();
var engine = Engine.create();

var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: parseInt(getComputedStyle(document.body).width),
    height: 2200,
    // background: '#fafafa',
    // wireframeBackground: '#222',
    // hasBounds: false,
    // enabled: true,
    wireframes: false,
    // showSleeping: true,
    // showDebug: false,
    // showBroadphase: false,
    // showBounds: false,
    // showVelocity: false,
    // showCollisions: false,
    // showAxes: false,
    // showPositions: false,
    // showAngleIndicator: false,
    // showIds: false,
    // showShadows: false
  }
});
var world = engine.world;

options = { isStatic: true, render: {fillStyle : "red", strokeStyle : "red", lineWidth : 10}}
//x pos, y pos, width, height, options
const topWall = Bodies.rectangle(parseInt(getComputedStyle(document.body).width)/2, 0, parseInt(getComputedStyle(document.body).width), 20, options);
const leftWall = Bodies.rectangle(78, 2200/2, 20, 2200, options);
const rightWall = Bodies.rectangle(parseInt(getComputedStyle(document.body).width), 2200/2, 20, 2200, options);
const bottomWall = Bodies.rectangle(parseInt(getComputedStyle(document.body).width)/2, 2200, parseInt(getComputedStyle(document.body).width), 20, options);

Composite.add(world, [topWall, leftWall, rightWall, bottomWall]);

engine.world.gravity.y = 0;

Runner.run(runner, engine);
Render.run(render)

var bodies = [];

for (var i = 0, l = bubbleContainer.length; i < l; i++) {
    var body = Bodies.circle(
        parseInt(getComputedStyle(document.body).width)/2,
        200,
        100,
    );
	bubbleContainer[i].id = body.id;
    bodies.push(body);
}
Composite.add(world, bodies);


window.requestAnimationFrame(update);
function update() {
  bubbleContainer = document.querySelectorAll(".bubble-container")
    for (var i = 0, l = bubbleContainer.length; i < l; i++) {
        var bodyDom = bubbleContainer[i];
        var body = null;
    	for (var j = 0, k = bodies.length; j < k; j++) {
        	if ( bodies[j].id == bodyDom.id ) {
                body = bodies[j];
                break;
            }
        }

        if ( body === null ) continue;

        bodyDom.style.transform = "translate( "
            + ((VIEW.offsetX + body.position.x) * VIEW.scale - bodyDom.offsetWidth/2 )
            + "px, "
            + (VIEW.offsetY *2 + ( body.position.y) * VIEW.scale - bodyDom.offsetHeight/2)
            + "px )";
        bodyDom.style.transform += "rotate( " + body.angle + "rad )";

    }
    window.requestAnimationFrame(update);
}


setInterval(
  ()=>{
    for (var i = 0; i<this.bodies.length; i++){
      Matter.Body.applyForce(this.bodies[i],{x: this.bodies[i].x ,y:this.bodies[i].y}, {x: Math.random() > 0.5 ? Math.random() *0.1 : -Math.random() *0.1,y:  Math.random() > 0.5 ? Math.random() *0.1 : -Math.random() *0.1} )
    }
  }
  ,1000)
*/
var VIEW = {};
VIEW.SAFE_WIDTH = 100;
VIEW.SAFE_HEIGHT = 100;
VIEW.scale = Math.min(window.innerWidth / VIEW.SAFE_WIDTH, window.innerHeight / VIEW.SAFE_HEIGHT);
VIEW.width = window.innerWidth / VIEW.scale;
VIEW.height = window.innerHeight / VIEW.scale;
VIEW.centerX = VIEW.width / 2;
VIEW.centerY = VIEW.height / 2;
VIEW.offsetX = (VIEW.width - VIEW.SAFE_WIDTH) / 2 / VIEW.scale;
VIEW.offsetY = (VIEW.height - VIEW.SAFE_HEIGHT) / 2 / VIEW.scale;

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;
  Composite = Matter.Composite;

var runner = Runner.create();
var engine = Engine.create();

var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: parseInt(getComputedStyle(document.body).width),
    height: 2200,
    background: 'transparent',
    hasBounds: false,
    enabled: true,
    wireframes: false,
    showSleeping: true,
    showDebug: false,
    showBroadphase: false,
    showBounds: false,
    showVelocity: false,
    showCollisions: false,
    showAxes: false,
    showPositions: false,
    showAngleIndicator: false,
    showIds: false,
    showShadows: false
  }
});
var world = engine.world;

options = { isStatic: true, render: {fillStyle : "transparent", strokeStyle : "transparent", lineWidth : 10}}
//x pos, y pos, width, height, options
const topWall = Bodies.rectangle(parseInt(getComputedStyle(document.body).width)/2, 0, parseInt(getComputedStyle(document.body).width), 20, options);
const leftWall = Bodies.rectangle(78, 2200/2, 20, 2200, options);
const rightWall = Bodies.rectangle(parseInt(getComputedStyle(document.body).width), 2200/2, 20, 2200, options);
const bottomWall = Bodies.rectangle(parseInt(getComputedStyle(document.body).width)/2, 2200, parseInt(getComputedStyle(document.body).width), 20, options);

engine.world.gravity.y = 0;

var bodies = [];

for (var i = 0, l = bubbleContainer.length; i < l; i++) {
    var body = Bodies.circle(
        parseInt(getComputedStyle(document.body).width)/2,
        200,
        90,
        {
    render: {
         fillStyle: 'transparent',
         strokeStyle: 'transparent',
    }
}
    );
	bubbleContainer[i].id = body.id;
    bodies.push(body);
}
Composite.add(world, bodies);


Composite.add(engine.world, [topWall, leftWall, rightWall, bottomWall]);

window.requestAnimationFrame(update);
function update() {
  bubbleContainer = document.querySelectorAll(".bubble-container")
    for (var i = 0, l = bubbleContainer.length; i < l; i++) {
        var bodyDom = bubbleContainer[i];
        var body = null;
    	for (var j = 0, k = bodies.length; j < k; j++) {
        	if ( bodies[j].id == bodyDom.id ) {
                body = bodies[j];
                break;
            }
        }

        if ( body === null ) continue;

        bodyDom.style.transform = "translate( "
            + body.position.x
            + "px, "
            + body.position.y
            + "px )";
        bodyDom.style.transform += "rotate( " + body.angle + "rad )";

    }
    window.requestAnimationFrame(update);
}

setInterval(
  ()=>{
    for (var i = 0; i<bodies.length; i++){
      Body.applyForce(bodies[i],{x: bodies[i].position.x ,y:bodies[i].position.y}, {x: Math.random() > 0.5 ? Math.random() *0.1 : -Math.random() *0.1,y:  Math.random() > 0.5 ? Math.random() *0.1 : -Math.random() *0.1} )
    }
  }
  ,1000)

Runner.run(runner,engine);

Render.run(render);
