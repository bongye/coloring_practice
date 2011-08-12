function selectColor(obj) {
  $("#colors").children().removeClass("sel");
  $(obj).addClass("sel");

  Draw.changeColor($(obj).css("background-color"));
 
  selectTool(document.getElementById('pencil'));
}

function selectTool(obj) {
  var newTool = obj.id;

  $("#container").attr("class", newTool);

  $('.tools').removeClass("sel");
  $(obj).addClass("sel");

  Draw.changeTool(newTool);
}

function selectSetting(obj, lineWidth) {
  $("#settings").children().removeClass("sel");
  $(obj).addClass("sel");

  Draw.changeLineWidth(lineWidth);
}

function resetTool(obj) {
  $('.tools').children().removeClass("sel");
}
