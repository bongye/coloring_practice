function background_render(canvas, img)
{
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawimage(img, canvas.width, canvas.height);
}
