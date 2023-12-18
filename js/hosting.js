var n = 0;
function sendPacket (computer1, computer2){
  $('body').prepend('<svg id="containerball'+n+'" width="2000" height="4000"><circle fill="rgb('+Math.floor(Math.random()*255 + 1)+','+Math.floor(Math.random()*255 + 1)+','+Math.floor(Math.random()*255 + 1)+')" id="ball'+n+'" cx="'+Math.round(computer1.position().left +80)+'" cy="'+Math.round(computer1.position().top +65)+'" r="25" /></svg>')
  var target = $("#ball" + n)
  var container = $("#containerball" + n)
  n = n + 1;
  target.animate({cx : computer2.position().left + 80, cy : computer2.position().top + 65}, 3000, function (){target.remove();container.remove()})
}

setInterval(function(){sendPacket($('#computer' + Math.floor(Math.random() * 5 + 1)), $('#computer' + Math.floor(Math.random() * 5 + 1)))}, 3500)
