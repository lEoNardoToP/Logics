var n = 0;
function sendPacket (computer1, computer2){
  $('#centro').prepend('<svg id="containerball'+n+'" width="2000" height="4000"><circle fill="rgb('+Math.floor(Math.random()*255 + 1)+','+Math.floor(Math.random()*255 + 1)+','+Math.floor(Math.random()*255 + 1)+')" id="ball'+n+'" cx="'+Math.round(computer1.position().left +80)+'" cy="'+Math.round(computer1.position().top +65)+'" r="25" /></svg>')
  var target = $("#ball" + n)
  var container = $("#containerball" + n)
  n = n + 1;
  target.animate({cx : computer2.position().left + 80, cy : computer2.position().top + 65}, 3000, function (){target.remove();container.remove()})
}
$("#commentiPiubassi").children().each(function (){
  $(this).css({"top" : parseInt($(this).offset().top) + 300 + "px"})
});

setInterval(function(){
  var MAX = -Infinity;
  for (var i = 1; i < 6; i++){
    var newTopDifference = Math.floor(Math.random() * 200 - 100);
    $('#computer' + i).css({"left": (parseInt($('#computer' + i).css("left")) + Math.floor(Math.random() * 200 - 100)) + "px"});
    if ($("#computer"+i).offset().top + newTopDifference > $("#elettrocardiogramma").offset().bottom && $('#computer'+i).offset().top + parseInt($('#computer'+i).height()) > $("#commentiPiubassi:first-child").offset().top + 50) {
    $('#computer'+i).css({"top" : (parseInt($('#computer'+i).css("top")) + newTopDifference + "px")});
    }
  }
  sendPacket($('#computer' + Math.floor(Math.random() * 5 + 1)), $('#computer' + Math.floor(Math.random() * 5 + 1)));
  }, 3500)
