Draw = function() {
  var color = '#000000';
  var lineWidth = 1;
  var canvas = null;
  var context = null;
  var tool = null;
  var actionData = null;

  var PencilAction = {
    onStart: function(x, y) {
      context.strokeStyle = color;
      context.lineWidth = lineWidth;

      actionData = {
        id: Client.getMyId(),
        action: 'pencil',
        lineWidth: lineWidth,
        color: color,
        undo: false,
        data:[{x:x, y:y}]
      };
      
      context.beginPath();
      context.moveTo(x, y);
    },

    onMove: function(x, y) {
      context.lineTo(x, y);
      context.stroke();

      actionData.data.push({x:x, y:y});
    },
    onEnd: function(x, y) {
      context.closePath();
      actionData.data.push({x:x, y:y});

      History.addAction(actionData);
      actionData = null;
    },
    drawItem: function(item) {
      drawLines(item.color, item.lineWidth, item.data);
    }
  };

  var EraseAction = {
    onStart: function(x, y) {
      context.globalCompositeOperation = "copy";
      context.strokeStyle = 'rgba(255, 255, 255, 0.0)';
      context.lineWidth = lineWidth;

      actionData = {
        id: Client.getMyId(),
        action: 'erase',
        lineWidth: lineWidth,
        color: 'rgba(255, 255, 255, 0.0)',
        undo: false,
        data:[{x:x, y:y}]
      };
      context.beginPath();
      context.moveTo(x, y);
    },
    onMove: function(x, y) {
      context.lineTo(x, y);
      context.stroke();

      actionData.data.push({x: x, y: y});
    },
    onEnd: function(x, y) {
      context.closePath();
      context.globalCompositeOperation = "source-over";
      actionData.data.push({x:x, y:y});

      History.addAction(actionData);
      actionData = null;
    },
    drawItem: function(item) {
      removeLines(item.lineWidth, item.data);
    }
  };

  var TOOLS = [
    ['pencil', PencilAction],
    ['erase', EraseAction]
  ];
  
  function onMouseCanvas(ev) {
    if (ev.layerX || ev.layerX == 0) {
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) {
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;
    }

    var func = tool[ev.type];
    if (func) {
      func(ev);
    }
  }

  function onTouchCanvas(ev) {
    ev.preventDefault();
    var touch = ev.touches[0];

    var func = tool[ev.type];
    if (func) {
      func(touch);
    }
  }

  function ActionListener(action) {
    var listener = this;
    this.started = false;

    this.mousedown = function(ev) {
      listener.started = true;
      action.onStart(ev._x, ev._y);
    };
    this.mousemove = function(ev) {
      if (listener.started) {
        action.onMove(ev._x, ev._y);
      }
    };
    this.mouseup = function(ev) {
      if (listener.started) {
        action.onEnd(ev._x, ev._y);
        listener.started = false;
      }
    };
    this.touchstart = function(ev) {
      listener.started = true;
      action.onStart(ev.pageX, ev.pageY);
    };
    this.touchmove = function(ev) {
      if (listener.started) {
        action.onMove(ev.pageX, ev.pageY);
      }
    };
    this.touchend = function(ev) {
      if (listener.started) {
        action.onEnd(ev.pageX, ev.pageY);
        listener.started = false;
      }
    };
  }

  function drawLines(color, lineWidth, data) {
    if (data.length > 0) {
      var preLineWidth = context.lineWidth;
      var preColor = context.strokeStyle;

      context.beginPath();
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
      context.moveTo(data[0].x, data[0].y);
      for (var i=1; i<data.length; i++) {
        context.lineTo(data[i].x, data[i].y);
        context.stroke();
      }
      context.closePath();

      context.lineWidth = preLineWidth;
      context.strokeStyle = preColor;
    }
  }

  function removeLines(lineWidth, data) {
    if (data.length > 0) {
      var preLineWidth = context.lineWidth;
      var preColor = context.strokeStyle;
      var preGlobalCompositeOperation = context.globalCompositeOperation;

      context.globalCompositeOperation = "copy";
      context.beginPath();
      context.lineWidth = lineWidth;
      context.strokeStyle = "rgba(0, 0, 0, 0)";
      context.moveTo(data[0].x, data[0].y);
      for (var i=1; i<data.length; i++) {
        context.lineTo(data[i].x, data[i].y);
        context.stroke();
      }
      context.closePath();
      
      context.globalCompositeOperation = preGlobalCompositeOperation;
      context.lineWidth = preLineWidth;
      context.strokeStyle = preColor;
    }
  }

  return {
    initialize: function(imageData) {
      canvas = document.getElementById('draw-canvas');
      if (!canvas) {
        alert('Cannot find Canvas object.');
        return;
      }
      if (!canvas.getContext) {
        alert('Cannot find Drawing Context.');
        return;
      }
      context = canvas.getContext('2d');
      if (!context) {
        alert('Cannot call getContext() of Canvas.');
        return;
      }

      Draw.changeTool('pencil');

      canvas.addEventListener('mousedown', onMouseCanvas, false);
      canvas.addEventListener('mousemove', onMouseCanvas, false);
      canvas.addEventListener('mouseup', onMouseCanvas, false);

      canvas.addEventListener('touchstart', onTouchCanvas, false);
      canvas.addEventListener('touchmove', onTouchCanvas, false);
      canvas.addEventListener('touchend', onTouchCanvas, false);
    },
    changeColor: function(hexColor) {
      color = hexColor;
    },
    getColor: function() {
      return color;
    },
    changeLineWidth: function(width) {
      lineWidth = width;
      context.lineWidth = width;
    },
    changeTool: function(toolName) {
      var selectedTool = null;
      for (var i in TOOLS) {
        if (TOOLS[i][0] == toolName) {
          selectedTool = TOOLS[i][1];
          break;
        }
      }

      if (selectedTool != null){
        tool = new ActionListener(selectedTool);
      }
      return selectedTool != null;
    },
    draw: function(item) {
      var drawFunction = null;
      for (var i in TOOLS) {
        if (TOOLS[i][0] == item.action) {
          drawFunction = TOOLS[i][1].drawItem;
          break;
        }
      }

      if (drawFunction != null) {
        drawFunction(item);
      }
    },
    drawAll: function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      var items = History.getItems();
      for (var i in items){
        if (items[i].undo == false)
          Draw.draw(items[i]);
      }
    }
  };
}();
