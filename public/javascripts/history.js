JSON.clone = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

History = function () {
  var items = [];

  return {
    removeAllOfId: function(id) {
      items = JSLINQ(items).Where(function(item) { return items.id != id }).ToArray();
      return items;
    },
    addAction: function(action) {
      items.push(action);
      return items;
    },
    removeUndoId: function(id) {
      items = JSLINQ(items).Where(function(item) { return item.id == id && item.undo == true }).ToArray();
      return items;
    },
    undo: function(id) {
      var last = JSLINQ(items).Last(function(item) { return item.id == id && item.undo == false; });
      if (last)
        last.undo = true;
      return last;
    },
    hasUndo: function(id) {
      var last = JSLINQ(items).Last(function(item) { return item.id == id && item.undo == false; });
      return last != null;
    },
    redo: function(id) {
      var last = JSLINQ(items).First(function(item) { return item.id == id && item.undo == true; });
      if (last)
        last.undo = false;
      return last;
    },
    hasRedo: function(id) {
      var last = JSLINQ(items).First(function(item) { return item.id == id && item.undo == true; });
      return last != null;
    },
    getItems: function() {
      return items;
    }
  }
}();
