Client = function() {
  var entities = {'<':'&lt;', '>':'&gt', '&':'&amp;', '"':'&quot;'};
  var myId = 'bongye';

  var handlers = {
    'pencil': function(message) {
      onDrawMessage(message);
    },
    'erase': function(message) {
      onDrawMessage(message);
    },
    'undo': function(message) {
      History.undo(message.id);
      Draw.drawAll();
    },
    'redo': function(message){
      var last = History.redo(message.id);
      if (last != null)
        Draw.draw(last)
    }
  };

  function onDrawMessage(message) {
    if (History.hasRedo(message.id))
      History.removeUndid(message.id)
    History.addAction(message);
    Draw.draw(message);
  }

  function escapeString(s) {
    return s.replace(/[<>&"]/g, function (m) { return entities[m]; });
  }

  function handleMessage(message) {
    var handler = handlers[message.action];
    if (handler) {
      handler(message);
    } else {
    }
  }

  return {
    initialize: function(data){
      
    },
    getMyId: function() {
      return myId;
    },
    undo: function() {
      if(History.hasUndo(myId)){
        History.undo(myId);
        Draw.drawAll();
      }
    },
    redo: function() {
      if(History.hasRedo(myId)){
        var last = History.redo(myId);
        Draw.draw(last);
      }
    }
  };
}();
