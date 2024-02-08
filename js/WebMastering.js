$(".schermo").siblings(".tv").bind("click", preventDefault)
function preventDefault(e) {
    e.preventDefault();
}
$("#computers .item .buttonONOFF").click(function(e){
    if ($(e.target).siblings(".tv").children(".schermo").css("display") == "none") {
        $(e.target).siblings(".tv").click(function (){
            $(this).unbind("click", preventDefault)
        })
        $(e.target).siblings(".tv").css("cursor", "pointer");
        $(e.target).siblings(".tv").children(".schermo").css("display", "block");
    } else {
        $(e.target).siblings(".tv").bind("click", preventDefault)
        $(e.target).siblings(".tv").css("cursor", "not-allowed");
        $(e.target).siblings(".tv").children(".schermo").css("display", "none");
    }
})