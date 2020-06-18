currentHeight = $("#today-data").outerHeight();
container_height = $("#second_row").outerHeight();
var set_todo_height = container_height - currentHeight;
$("#todo_container").css({ height: set_todo_height + "px" });
function tmpmobile(value) {
  $("#mobileList").append("<option value=" + value + ">");
}
$(".ui.dropdown").dropdown();
$(".circular.right.floated.basic.button").popup();
$(".popup").popup();
$("#dashboard-preloader").fadeOut(400);
$(".sidebar-menu-toggler").click(function () {
  $(".ui.sidebar")
    .sidebar("setting", "transition", "overlay")
    .sidebar("toggle");
});
$(".ui.checkbox").checkbox();
$(".ui.radio.checkbox").checkbox();
$('.top.menu .item').tab();
 
$('.special.cards .image').dimmer({
  on: 'hover'
});
$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;
