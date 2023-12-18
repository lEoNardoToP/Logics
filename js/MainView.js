
let contenitoreAzzurroeRosa = $("#contenitoreAzzurroeRosa")
let consol = document.querySelector('#writerConsole')

var typewriter = new Typewriter(consol, {
  loop: true,
  delay: 75,
  cursor : "_",
});

typewriter
  .pauseFor(2500)
  .typeString('<p><span style="color:red;">console</span>.<span style="color:rgb(49, 203, 208)">log(</span><span style="color:lightgreen">"Logics"</span><span style="color:rgb(49, 203, 208)">)</span>;</p><p><span style="color:rgb(49, 203, 208)">print(</span><span style="color:lightgreen">"Logics"</span><span style="color:rgb(49, 203, 208)">)</span></p><p><span style="color:rgb(238, 221, 101)">System</span>.out.<span style="color:rgb(49, 203, 208)">println(</span><span style="color:lightgreen">"Logics"</span><span style="color:rgb(49, 203, 208)">)</span>;</p><p>fmt.<span style="color:rgb(49, 203, 208)">println</span>(<span style="color:lightgreen">"Logics"</span>)</p><p> <span style="color:rgb(49, 203, 208)">echo</span> <span style="color:lightgreen">"Logics"</span>;</p><p><span style="color:red;">System</span>.<span style="color:red;">Console</span>.<span style="color:rgb(49, 203, 208)">WriteLine</span>(<span style="color:lightgreen">"Logics"</span>);</p><p><span style="color:rgb(240, 99, 238);">cout</span> << <span style="color:lightgreen">"Logics"</span>;</p><p><span style="color:rgb(49, 203, 208)">printf</span>(<span style="color:lightgreen">"Logics"</span>);;</p><p>disp(<span style="color:rgb(240, 99, 238);">"Logics"</span>);</p><p><span style="color:rgb(235, 145, 11);">cat</span>(<span style="color:lightgreen">"Logics"</span>);</p>')
  .start()



var countGradient = 90;
var intervalId = window.setInterval(function(){
  contenitoreAzzurroeRosa.css("background-image", "linear-gradient("+countGradient+"deg, rgb(26, 240, 233), rgb(241, 27, 171))")
  countGradient++;
}, 500);

let leo = $("#Leo")
var counterForImages = 0

async function photoAnimation () {
  leo.delay(3000).animate({"opacity" : "1"}, 2500)
  setTimeout(() => {leo.delay(3000).animate({"opacity" : "0"}, 2500, photoAnimation)}, 3000)
  leo.attr("src", "assets/Leo" + counterForImages%3 + ".png")
  if (counterForImages%3 == 0) {
    leo.css("width", "200px")
    leo.css("left", "85%")
  } else if (counterForImages%3 == 1) {
    leo.css("width", "400px")
    leo.css("left", "80%")
  } else if (counterForImages%3 == 2) {
    leo.css("width", "180px")
    leo.css("left", "85%")
  }
    counterForImages++
}

photoAnimation()


var t = $(".stylize");
var pos = t.offset();
$(window).scroll(function () {
   var windowpos = $(window).scrollTop();
   t.css("opacity", String((windowpos-500)*2/pos.top));
});
