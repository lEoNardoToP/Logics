var counterForImages = 1
let leo = $("#Leo")
async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise(resolve => setTimeout(resolve, ms));
}

async function lol (fun) {
  var fadingIn = window.setInterval(function(){
    leo.css("opacity", Number(leo.css("opacity"))+0.02)
    if (leo.css("opacity") == 1) {
      clearInterval(fadingIn)
    }
  }, 50)
  await delay(5000)
  var fadingOut = window.setInterval(function(){
    leo.css("opacity", Number(leo.css("opacity"))-0.02)
    if (leo.css("opacity") == 0) {
      clearInterval(fadingOut)
    }
  }, 50)
  await delay(5000)
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
  fun(lol)
}

lol(lol)
