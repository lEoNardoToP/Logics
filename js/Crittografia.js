function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!£$%&/()=?^';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += "<span class=\"hash hash"+counter+"\">" + characters.charAt(Math.floor(Math.random() * charactersLength)) + "</span>";
      counter += 1;
    }
    return result;
}
links = ["http://localhost/Logics/Homepage.html"];
for (link of links) {
  var hash = makeid(link.length);
  modifiedlink = ""
  for (var h in link){
    modifiedlink += "<span class=\"hiddenlink hiddenlink"+h+"\">" + link[h] + "</span>"
  }
  $("#hashes").append("<p href=\""+link+"\">"+hash+"</p>")
  $("#hiddenlinks").append("<a href=\""+link+"\">"+modifiedlink+"</a>")
}

document.addEventListener('DOMContentLoaded', () => {
    let mousePosX = 0,
        mousePosY = 0,
        mouseCircle = document.getElementById('mouse-circle');

    document.onmousemove = (e) => {
        mousePosX = e.pageX - 110;
        mousePosY = e.pageY - 110;
        for (var link of document.querySelectorAll(".hiddenlink")){
          pos = link.getBoundingClientRect();
          console.log(link.style.height);
          if (Math.sqrt((pos.top - e.pageY + pos.height/2)**2 + (pos.left - e.pageX + pos.width/2)**2) <= 160){
            link.style.visibility = "visible";
          } else {
            link.style.visibility = "hidden";
          }
        }
        for (var link of document.querySelectorAll(".hash")){
          pos = link.getBoundingClientRect();
          if (Math.sqrt((pos.top - e.pageY + pos.height/2)**2 + (pos.left - e.pageX + pos.width/2)**2) <= 160){
            link.style.visibility = "hidden";
          } else {
            link.style.visibility = "visible";
          }
        }
    }

    let delay = 6,
        revisedMousePosX = 0,
        revisedMousePosY = 0;

    function delayMouseFollow() {
        requestAnimationFrame(delayMouseFollow);

        revisedMousePosX += (mousePosX - revisedMousePosX) / delay;
        revisedMousePosY += (mousePosY - revisedMousePosY) / delay;

        mouseCircle.style.top = revisedMousePosY + 'px';
        mouseCircle.style.left = revisedMousePosX + 'px';
    }
    delayMouseFollow();
});
