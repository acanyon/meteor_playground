"use strict";

function lexo_ordering(inputs, ordering) {
  inputs = inputs || [];
  var order_map = {};
  for (var i = 0; i < ordering.length; i++) {
    order_map[ordering[i]] = i;
  }

  var is_fully_sorted = false;
  while (!is_fully_sorted) {
    is_fully_sorted = true;

    for (var i = 0; i < inputs.length - 1; i++) {
      var cur = inputs[i],
          next = inputs[i + 1];
      var _is_ordered = true;
      var _is_complete = false,
          j = 0;
      while (!_is_complete) {
        var c = cur[j], n = next[j];
        _is_complete = true;

        if (c === n) {
          _is_complete = false;
        } else {
          _is_complete = true;

          if (!c) {
            _is_ordered = true;
          } else if (!n) {
            _is_ordered = false;
          } else if (order_map[c] > order_map[n]) {
            _is_ordered = false;
          } else if (order_map[c] < order_map[n]) {
            _is_ordered = true;
          }
        }

        j = j + 1;
      }

      if (!_is_ordered) {
        is_fully_sorted = false;
        inputs[i] = next;
        inputs[i + 1] = cur;
      }
    }
  }

  return inputs;
}

// ["abc","acb","bca"]
lexo_ordering( ["acb", "abc", "bca"], "abc");
// ["bca", "acb", "abc"]
lexo_ordering( ["acb", "abc", "bca"], "cba");
// ["", "aa", "aaa"]
lexo_ordering( ["aaa","aa",""], "a");
