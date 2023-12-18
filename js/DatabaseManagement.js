let links = document.querySelectorAll("#links a");
var initialposition = []
for (i in links){
  initialposition.push(Math.random()*2300)
}
var velocities = []
for (var i = 0; i < links.length; i++){
  velocities.push(Math.random()%3)
}
for (link of links){
  link.style.left = 7 + Math.random() * 94 + "%"
}
function move () {
    for (var i = 0; i < links.length; i++){
        initialposition[i] = (initialposition[i] + velocities[i]) % 2290;
        links[i].style.top = initialposition[i] + "px"
    }
}
setInterval(move, 10)
