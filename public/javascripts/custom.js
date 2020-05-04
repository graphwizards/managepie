
 currentHeight = $("#today-data").outerHeight();
 container_height = $("#second_row").outerHeight();
 var set_todo_height = container_height - currentHeight;
 $("#todo_container").css({"height" : set_todo_height+"px"});
 
$(document).ready(function () {
    $(".ui.dropdown").dropdown();
    $(".circular.right.floated.basic.button")  .popup();
    $("#dashboard-preloader").fadeOut(400);
    $(".sidebar-menu-toggler").click(function () {
        $('.ui.sidebar')
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle')
      ;
    });
});
