let btn = $("#menu_button")
let sidebar = $(".sidebar")[0]
let login = $("#loginButton")
let register = $("#registerButton")
let loginForm = $("#loginForm")
let registerForm = $("#registerForm")
let noAccount = $("#noAccount")
let alreadyAccount = $("#alreadyAccount")
let logout = $("#logout")
let bellNotification = new Audio('assets/mixkit-bell-notification-933.wav');

btn.click(function () {
  sidebar.classList.toggle("active")
});

function toggleLogin() {
 if (loginForm.css("opacity") == 0) {
   loginForm.css("opacity",  1)
   loginForm.css("pointer-events", "auto")
   registerForm.css("opacity",  0)
   registerForm.css("pointer-events", "none")
   $("#PasswordDimenticataForm").css("opacity",  0)
   $("#PasswordDimenticataForm").css("pointer-events", "none")
 } else {
     loginForm.css("opacity",  0)
     loginForm.css("pointer-events", "none")
   }
}

function toggleRegister () {
  if (registerForm.css("opacity") == 0) {
    registerForm.css("opacity",  1)
    registerForm.css("pointer-events", "auto")
    loginForm.css("opacity",  0)
    loginForm.css("pointer-events", "none")
    $("#PasswordDimenticataForm").css("opacity",  0)
    $("#PasswordDimenticataForm").css("pointer-events", "none")
  } else {
      registerForm.css("opacity",  0)
      registerForm.css("pointer-events", "none")

    }
}

$(".fa-eye1").click( function () {
  var passwfield = $("#passwordL")
  if (passwfield.attr("type") == "password") {
    passwfield.attr("type", "text")
    $(".fa-eye1").removeClass("active")
  } else {
    passwfield.attr("type", "password")
    $(".fa-eye1").addClass("active")
  }
} )

$(".fa-eye2").click( function () {
  var passwfield = $("#passwordR")
  if (passwfield.attr("type") == "password") {
    passwfield.attr("type", "text")
    $(".fa-eye2").removeClass("active")
  } else {
    passwfield.attr("type", "password")
    $(".fa-eye2").addClass("active")
  }
} )

$(".fa-eye3").click( function () {
  var passwfield = $("#passwordAgainR")
  if (passwfield.attr("type") == "password") {
    passwfield.attr("type", "text")
    $(".fa-eye3").removeClass("active")
  } else {
    passwfield.attr("type", "password")
    $(".fa-eye3").addClass("active")
  }
} )

$(".fa-eye4").click( function () {
  var passwfield = $("#passwordPD")
  if (passwfield.attr("type") == "password") {
    passwfield.attr("type", "text")
    $(".fa-eye4").removeClass("active")
  } else {
    passwfield.attr("type", "password")
    $(".fa-eye4").addClass("active")
  }
} )

const getAncestors = el => {
  let ancestors = [];
  while (el) {
    ancestors.unshift(el);
    el = el.parentNode;
  }
  return ancestors;
};

window.onclick = function(event){
  ancestors = getAncestors(event.target)
  if (event.target.parentElement){
    if (!( event.target.matches(".box") || event.target.parentElement.matches(".box") || event.target.matches(".loginRegisterButtons") ) ){
      registerForm.css("opacity",  0)
      registerForm.css("pointer-events", "none")
      loginForm.css("opacity",  0)
      loginForm.css("pointer-events", "none")
      $("#PasswordDimenticataForm").css("opacity",0)
      $("#PasswordDimenticataForm").css("pointer-events", "none")
      $("#messageR").text("")
      $("#messageR").css("height", "0")
      $("#messageR").css("background-color", "transparent")
      $("#messageL").text("")
      $("#messageL").css("height", "0")
      $("#messageL").css("background-color", "transparent")

  }
} else if (!( event.target.matches(".box") ||  event.target.matches(".loginRegisterButtons"))) {
  registerForm.css("opacity",  0)
  registerForm.css("pointer-events", "none")
  loginForm.css("opacity",  0)
  loginForm.css("pointer-events", "none")
}
 if (!(event.target.matches("#show-messages") || event.target.matches(".wrapper") || ancestors.includes($(".wrapper").eq(0)[0]) || ancestors.includes($(".wrapper").eq(1)[0]) )) {
   $(".wrapper").css("display", "none")
   $(".wrapper").css("pointer-events", "none")
 }
}


$("body").on("click",".users-list",(e)=>{
  $(".users-layout").parent().css("display", "none")
  $(".users-layout").parent().css("pointer-events", "none")
  $(".chat-area").parent().css("display", "flex")
  $(".chat-area").parent().css("pointer-events", "auto")
  $("#CalledName").text($(e.target).find("span").text() == "" ? $(e.target).parents(".users-list").find("span").text() : $(e.target).find("span").text())
})

$("#show-messages").click(function () {
  var formData = {
    session_user : true
  }
  $.ajax({
    type: "POST",
    url: "PassingVariables.php",
    data: (formData),
    encode: true,
    error: function(xhr, status, error) {
      console.log(error);
    }
  }).done(function (data){
    console.log(data)
  if (data){
    if (data == "admin"){
      if ($(".users-layout").parent().css("display") == "none") {
        $(".users-layout").parent().css("display", "flex")
        $(".users-layout").parent().css("pointer-events", "auto")
      } else {
        $(".users-layout").parent().css("display", "none")
        $(".users-layout").parent().css("pointer-events", "none")
      }
  } else {
    $("#CalledName").text("admin");
    if ($(".chat-area").parent().css("display") == "none") {
      $(".chat-area").parent().css("display", "flex")
      $(".chat-area").parent().css("pointer-events", "auto")
    } else {
      $(".chat-area").parent().css("display", "none")
      $(".chat-area").parent().css("pointer-events", "none")
    }
  }
} else {
  alert("Devi essere loggato per messaggiarci")
}
})
  })

var get_users;

function users_get (){
  get_users = setInterval(()=>{
    $.ajax({
      type: "GET",
      url: "users-list.php",
      encode: true,
      error: function(xhr, status, error) {
        console.log(error);
      }
    }).done(function (data){
      $(".list-users").html(data)
    })
  },500)
}
users_get()

const searchBar = $(".users-layout .search input"),
      searchBtn = $(".users-layout .search button");
      usersList = $(".users-layout .users-list");

function hideShowUsersList () {
  clearInterval(get_users)
  $(".users-list-name").each((i, obj)=>{
    console.log($(obj))
    if (!$(obj).text().toLowerCase().includes(searchBar.val().toLowerCase())){
      $(obj).parent().parent().parent().parent().hide()
    } else {
      $(obj).parent().parent().parent().parent().show()
    }
  })
}
searchBtn.click( function () {
  searchBtn.toggleClass("active")
  searchBar.toggleClass("active")
  searchBar.focus()
  if (!searchBar.hasClass("active")){
    $(".users-list").show()
    users_get()
  } else {
    hideShowUsersList()
  }
})


searchBar.on("keyup", ()=>{
  if (searchBar.val() != "") {
    hideShowUsersList()
} else {
  users_get()
  $(".users-list").show()
}
})

$(function(){

    $('*').hover(function(){
        $(this).data('hover',1); //store in that element that the mouse is over it
    },
    function(){
        $(this).data('hover',0); //store in that element that the mouse is no longer over it
    });


    window.isHovering = function (selector) {
        return $(selector).data('hover')?true:false; //check element for hover property
    }
});

var target = document.querySelector('.chat-box');
var mouse;
document.querySelector("body").addEventListener("mouseenter", (event) => {mouse = true});
document.querySelector("body").addEventListener("mouseleave", (event) => {mouse = false});
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(added_node) {
          if([... added_node.classList].includes('incoming')) {
            if (!mouse){
            bellNotification.play();
          }
          }
        });
      });
        });

    // configuration of the observer:
    var config = {childList: true, characterData: false, subtree : true}

    // pass in the target node, as well as the observer options
    observer.observe(target, config);


const formTypingArea = $(".typing-area"),
      inputField = $(".typing-area .input-field"),
      sendBtn = $(".typing-area button")
      chatBox = $(".chat-box");

setInterval(()=>{
  var formData = {
    outgoing_username : $("#CalledName").text()
  }
  $.ajax({
    type: "POST",
    url: "get-chat.php",
    data : formData,
    encode: true,
    error: function(xhr, status, error) {
      console.log(error);
    }
  }).done(function (data){
    if (chatBox.html() != data){
      chatBox.html(data)
      if(!chatBox.hasClass("active")){
      scrollToBottom()
    }
  }

  })
},500)


formTypingArea.on("submit", (e) => {
  e.preventDefault();
})

chatBox.on("mouseenter", ()=> {
  chatBox.addClass("active")
})

chatBox.on("mouseleave", ()=> {
  chatBox.removeClass("active")
})

sendBtn.on("click", ()=> {
  var formData = {
    message : inputField.val(),
    outgoing_username : $("#CalledName").text()
  };
  console.log(formData)
  $.ajax({
    type: "POST",
    url: "insert-chat.php",
    data: (formData),
    encode: true,
    error: function(xhr, status, error) {
      console.log(error);
    }
  }).done(function (data){
    if (data != ""){
      alert(data)
    }
    inputField.val("");
})
})

function scrollToBottom () {
  chatBox.scrollTop(chatBox.prop("scrollHeight"))
}

$("#PasswordDimenticataForm").on("submit", (event)=> {
  event.preventDefault();
  var formData = {
    email : $("#emailPD").val(),
    password : $("#passwordPD").val()
  };
  $.ajax({
    type: "POST",
    url: "PasswordDimenticata.php",
    data: (formData),
    dataType : "json",
    encode: true,
    error: function(xhr, status, error) {
      console.log(error);
    }
  }).done(function (data){
    var failedEmail = data["failedEmail"];
    if (failedEmail == ""){
      alert("Ti abbiamo mandato un email")
  } else {
    $("#failedEmailPD").html(data["failedEmail"])
  }
})
})

$("#goBackToSearch").click(()=>{
  $(".chat-area").parent().css("display", "none")
  $(".chat-area").parent().css("pointer-events", "none")
  $(".users-layout").parent().css("display", "flex")
  $(".users-layout").parent().css("pointer-events", "auto")
})

login.click(toggleLogin);
register.click(toggleRegister);
noAccount.click(toggleRegister);
alreadyAccount.click(toggleLogin);

logout.click(function(){
  var formData = {
    logout : "true",
  };
  $.ajax({
    type: "POST",
    url: "login.php",
    data: (formData),
    encode: true,
    error: function(xhr, status, error) {
      console.log(error);
    }
  }).done(function (data){
      $(".name").html("")
  })
})

let commentWriter = $('#commentWriter')

if (commentWriter.text() == ""){
  $("#commentMaker").hide()
}

$('body').on('keydown input', '#commentWriter', function() {
  //Auto-expanding textarea
  this.style.removeProperty('height');
  this.style.height = (this.scrollHeight+2) + 'px';
  $("#underline").css("top", (2500 + this.scrollHeight) + 'px')
  if (commentWriter.text() == ""){
    $("#commentMaker").hide()
  } else {
    $("#commentMaker").show()
  }
}).on('mousedown focus', 'textarea[data-expandable]', function() {
  //Do this on focus, to allow textarea to animate to height...
  this.style.removeProperty('height');
  this.style.height = (this.scrollHeight+2) + 'px';
});


commentWriter.on("focus", function(){
     $("#placeholder").hide();
     $("#focusedUnderline").animate({"width" :"100%"}, 1000)
});
commentWriter.on("blur", function(){
     if(String($(this).text()) == "") {
         $("#placeholder").show();
         $("#focusedUnderline").animate({"width" :"0%"}, 1000)
     }
});

function loadComments () {
  var formData = {
    loadComments : "true",
  };
  $.ajax({
    type: "POST",
    url: "comments.php",
    data: (formData),
    dataType: "json",
    encode: true,
    error: function(xhr, status, error) {
      console.log(error);
    }
  }).done(function (data) {
    console.log(data)
    $("#commentsContainer").html("")
    for (comment of (data.reverse())) {
    var thingToAppend = '<div class="comment" id=comment"'+comment["cid"]+'"><span class="uid">'+comment["uid"]+'</span><span class="time">'+comment["date"]+'</span><span class="stars-container" style="width : 57%; position : absolute"'
    for (var i = 0; i<=comment["stars"];i++){
      thingToAppend += '<label class="fas fa-star line"></label>'
    }
    thingToAppend += '</span ><div class="commentText">'+comment["message"]+'</div></div>'
    console.log($("#commentsContainer").text())
    $("#commentsContainer").append(thingToAppend)
    console.log($("#commentsContainer").text())
  }
  $("#commentsContainer").children().each(function () {
  var randomColor = "#"+((1<<24)*Math.random()|0).toString(16);
  while (randomColor == "#ffffff" || randomColor == "#272830"){
    randomColor = "#"+((1<<24)*Math.random()|0).toString(16)
  }
  $(this).css("background-color", randomColor)
})
})
};

loadComments()

$("#PasswordDimenticata").on("click", ()=>{
  $("#PasswordDimenticataForm").css("opacity", "1")
  $("#PasswordDimenticataForm").css("pointer-events", "auto")
  $("#loginForm").css("opacity", "0")
  $("#loginForm").css("pointer-events", "none")
})

  $("#registerForm").submit(function (event) {
    event.preventDefault()
    var formData = {
      logout : "true",
    };
    $.ajax({
      type: "POST",
      url: "login.php",
      data: (formData),
      encode: true,
      error: function(xhr, status, error) {
        console.log(error);
      }
    }).done(function (data){
        $(".name").html("")
    })
    var formData = {
      register : "true",
      username: $("#usernameR").val(),
      email: $("#emailR").val(),
      password: $("#passwordR").val(),
      passwordAgain: $("#passwordAgainR").val()
    };
    $.ajax({
      type: "POST",
      url: "registration.php",
      data: (formData),
      dataType: "json",
      encode: true,
      error: function(xhr, status, error) {
        console.log(error);
      }
    }).done(function (data) {
      console.log(data)
      $("#failedUsernameR").html(data["failedUsername"])
      $("#failedEmailR").html(data["failedEmail"])
      $("#failedPasswordR").html(data["failedPassword"])
      $("#failedPasswordAgainR").html(data["failedPasswordAgain"])
      $("#messageR").html(data["msg"])
      if ($("#messageR").text() == 'Username già in uso' || $("#messageR").text() == 'Problemi con l\'inserimento dei dati') {
        $("#messageR").css("background-color", "red")
        $("#messageR").css("height", "30px")
      } else if ($("#messageR").text() == 'Registrazione eseguita con successo, verifica il tuo account adesso') {
        var formData = {
          login : "true",
          username: $("#usernameR").val(),
          password: $("#passwordR").val(),
        };
        $.ajax({
          type: "POST",
          url: "login.php",
          data: (formData),
          dataType: "json",
          encode: true,
          error: function(xhr, status, error) {
            console.log(error);
          }
        })
        $("#messageR").css("height", "70px")
        $("#messageR").css("background-color", "green")
        $(".registerInput").val("")
      }
    });

    });
    $("#loginForm").submit(function (event) {
      event.preventDefault()
      event.preventDefault()
      var formData = {
        logout : "true"
      };
      $.ajax({
        type: "POST",
        url: "login.php",
        data: (formData),
        encode: true,
        error: function(xhr, status, error) {
          console.log(error);
        }
      }).done(function (data){
        console.log(data)
          $(".name").html("")
      var formData = {
        login : "true",
        username: $("#usernameL").val(),
        password: $("#passwordL").val()
      };
      $.ajax({
        type: "POST",
        url: "login.php",
        data: (formData),
        dataType: "json",
        encode: true,
        error: function(xhr, status, error) {
          console.log(error);
        }
      }).done(function (data) { console.log(data)
        console.log(data)
        $("#failedUsernameL").html(data["failedUsername"])
        $("#failedPasswordL").html(data["failedPassword"])
        $("#messageL").html(data["msg"])
        $("#messageL").css("height", "30px")
        if ($("#messageL").text() == 'Credenziali utente errate') {
          $("#messageL").css("background-color", "red")
        } else if ($("#messageL").text() == 'Login Effettuato') {
          $("#messageL").css("background-color", "green")
          $(".name").html(data["username"])
          $(".loginInput").val("")
        }
      })
      })
      })

      $("body").ready( function () {
        var formData = {
          reload : "true",
        };
        $.ajax({
          type: "POST",
          url: "login.php",
          data: (formData),
          dataType : "json",
          encode: true,
          error: function(xhr, status, error) {
            console.log(error);
          }
        }).done(function (data) {
            $(".name").html(data["username"])
          })
        });

      $("#commentMaker").click(function (event) {
        var rate = $("input[type=radio][name=rate]:checked").val()
        if (rate) {
          var formData = {
            submitComment : "true",
            message : commentWriter.text(),
            stars : rate
          };
          $.ajax({
            type: "POST",
            url: "comments.php",
            data: (formData),
            encode: true,
            error: function(xhr, status, error) {
              console.log(error);
            }
          }).done(function (data) {
            $("#Comment-error").text(data)
            loadComments()
            commentWriter.text("")
          });
        } else {
          $("#Comment-error").text("Per favore inserire un voto")
        }
      });
