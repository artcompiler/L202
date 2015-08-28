/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright (c) 2015, Art Compiler LLC */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _assertJs = require("./assert.js");

var fs = require('fs');
var https = require('https');

(0, _assertJs.reserveCodeRange)(1000, 1999, "compile");
_assertJs.messages[1001] = "Node ID %1 not found in pool.";
_assertJs.messages[1002] = "Invalid tag in node with Node ID %1.";
_assertJs.messages[1003] = "No aync callback provided.";
_assertJs.messages[1004] = "No visitor method defined for '%1'.";

var translate = (function () {
  var nodePool = undefined;
  function translate(pool, resume) {
    console.log("pool=" + JSON.stringify(pool, null, 2));
    nodePool = pool;
    return visit(pool.root, {}, resume);
  }
  function error(str, nid) {
    return {
      str: str,
      nid: nid
    };
  }
  function visit(nid, options, resume) {
    (0, _assertJs.assert)(typeof resume === "function", (0, _assertJs.message)(1003));
    // Get the node from the pool of nodes.
    var node = nodePool[nid];
    (0, _assertJs.assert)(node, (0, _assertJs.message)(1001, [nid]));
    (0, _assertJs.assert)(node.tag, (0, _assertJs.message)(1001, [nid]));
    (0, _assertJs.assert)(typeof table[node.tag] === "function", (0, _assertJs.message)(1004, [node.tag]));
    return table[node.tag](node, options, resume);
  }
  // BEGIN VISITOR METHODS
  var edgesNode = undefined;
  function str(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  }
  function num(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  }
  function ident(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  }
  function bool(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  }
  function add(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      val1 = +val1;
      if (isNaN(val1)) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        val2 = +val2;
        if (isNaN(val2)) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), val1 + val2);
      });
    });
  };
  function set(node, options, resume, params) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val !== "object" || !val || !val.tree) {
        err = err.concat(error("Argument Data invalid.", node.elts[0]));
      } else {
        if (params.op && params.op === "default") {
          val[params.prop] = params.val;
          resume([].concat(err), val);
        } else if (params.op && params.op === "positive") {
          visit(node.elts[1], options, function (err2, val2) {
            if (isNaN(val2) || val2 < 0) {
              err2 = err2.concat(error("Argument must be a positive number.", node.elts[1]));
            }
            if (typeof val === "object" && val) {
              val[params.prop] = +val2;
            }
            resume([].concat(err).concat(err2), val);
          });
        } else {
          resume([].concat(err), val);
        }
      }
    });
  }
  function data(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val !== "string" && (typeof val !== "object" || !val)) {
        err = err.concat(error("Data must be an object or URL.", node.elts[0]));
      }
      resume([].concat(err), { tree: val });
    });
  }
  function width(node, options, resume) {
    var params = {
      op: "positive",
      prop: "width"
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  }
  function height(node, options, resume) {
    var params = {
      op: "positive",
      prop: "height"
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  }
  function horizontal(node, options, resume) {
    var params = {
      op: "default",
      prop: "orientation",
      val: "horizontal"
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  };
  function vertical(node, options, resume) {
    var params = {
      op: "default",
      prop: "orientation",
      val: "vertical"
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  };
  function labels(node, options, resume) {
    var params = {
      op: "default",
      prop: "labelling",
      val: true
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  };
  function zoom(node, options, resume) {
    var params = {
      op: "default",
      prop: "zoom",
      val: true
    };
    set(node, options, function (err, val) {
      resume([].concat(err), val);
    }, params);
  };
  var colors = {
    "yellow green": 'YlGn',
    "yellow green blue": 'YlGnBu',
    "green blue": 'GnBu',
    "blue green": 'BuGn',
    "purple blue green": 'PuBuGn',
    "purple blue": 'PuBu',
    "blue purple": 'BuPu',
    "red purple": 'RdPu',
    "purple red": 'PuRd',
    "orange red": 'OrRd',
    "yellow orange red": 'YlOrRd',
    "yellow orange brown": 'YlOrBr',
    "purple": 'Purples',
    "blue": 'Blues',
    "green": 'Greens',
    "orange": 'Oranges',
    "red": 'Reds',
    "grey": 'Greys',
    "purple orange": 'PuOr',
    "brown bluegreen": 'BrBG',
    "purple green": 'PRGn',
    "pink yellowgreen": 'PiYG',
    "red blue": 'RdBu',
    "red grey": 'RdGy',
    "red yellow blue": 'RdYlBu',
    "red yellow green": 'RdYlGn'
  };
  function color(node, options, resume) {
    //0 = data, 1 = colors
    visit(node.elts[1], options, function (err1, val1) {
      if (val1 instanceof Array) {
        val1 = val1.join(" ");
      }
      if (!colors[val1]) {
        err1 = err1.concat(error("Unrecognized color, please use lower case.", node.elts[1]));
      }
      var params = {
        op: "default",
        prop: "color",
        val: colors[val1]
      };
      set(node, options, function (err, val) {
        resume([].concat(err), val);
      }, params);
    });
  }
  function icicle(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val !== "object" || !val || !val.tree) {
        err = err.concat(error("Argument Data invalid.", node.elts[0]));
      } else {
        //have to make sure it's an object before you start assigning properties.
        if (typeof val.tree === "string") {
          /*var obj = JSON.parse(fs.readFileSync('readme.json', 'utf8'));
          if (obj.error && obj.error.length > 0) {
            err = err.concat(error("Attempt to check URL returned" + obj.error, node.elts[0]));
          } else {
            val.tree = obj;
          }*/
          https.get(val.tree, function (res) {
            var obj = '';

            res.on('data', function (d) {
              obj += d;
            });

            res.on('end', function () {
              var fin = JSON.parse(obj);
              val.tree = fin;
              if (fin) {
                if (fin.error && fin.error.length > 0) {
                  err = err.concat(error("Attempt to parse JSON returned" + fin.error), node.elts[0]);
                }
              }
              val.height = val.height ? val.height : 500;
              val.width = val.width ? val.width : 960;
              val.orientation = val.orientation ? val.orientation : 'vertical';
              val.style = val.style ? val.style : [];
              val.graphtype = 'icicle';
              val.color = val.color ? val.color : 'Pastel1';
              resume([].concat(err), val);
            });
          }).on('error', function (e) {
            err = err.concat(error("Attempt to get data returned" + e), node.elts[0]);
            resume([].concat(err), val);
          });
        } else {
          if (typeof val.tree !== "object") {
            err = err.concat(error("Data is not a tree.", node.elts[0]));
          } else {
            val.height = val.height ? val.height : 500;
            val.width = val.width ? val.width : 960;
            val.orientation = val.orientation ? val.orientation : 'vertical';
            val.style = val.style ? val.style : [];
            val.graphtype = 'icicle';
          }
          resume([].concat(err), val);
        }
      }
    });
  }
  function sunburst(node, options, resume) {
    icicle(node, options, function (err, val) {
      val.graphtype = 'sunburst'; //just overwrite this
      resume([].concat(err), val);
    });
  }
  function style(node, options, resume) {
    visit(node.elts[1], options, function (err2, val2) {
      var params = {
        op: "default",
        prop: "style",
        val: val2
      };
      set(node, options, function (err1, val1) {
        resume([].concat(err1).concat(err2), val1);
      }, params);
    });
  };
  function list(node, options, resume) {
    if (node.elts && node.elts.length) {
      visit(node.elts[0], options, function (err1, val1) {
        node.elts.shift();
        list(node, options, function (err2, val2) {
          val2.unshift(val1);
          resume([].concat(err1).concat(err2), val2);
        });
      });
    } else {
      resume([], []);
    }
  };
  function binding(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), { key: val1, val: val2 });
      });
    });
  };
  function record(node, options, resume) {
    if (node.elts && node.elts.length) {
      visit(node.elts[0], options, function (err1, val1) {
        node.elts.shift();
        record(node, options, function (err2, val2) {
          val2.unshift(val1);
          resume([].concat(err1).concat(err2), val2);
        });
      });
    } else {
      resume([], []);
    }
  };
  function exprs(node, options, resume) {
    if (node.elts && node.elts.length) {
      visit(node.elts[0], options, function (err1, val1) {
        node.elts.shift();
        exprs(node, options, function (err2, val2) {
          val2.unshift(val1);
          resume([].concat(err1).concat(err2), val2);
        });
      });
    } else {
      resume([], []);
    }
  };
  function program(node, options, resume) {
    if (!options) {
      options = {};
    }
    visit(node.elts[0], options, resume);
  }
  var table = {
    "PROG": program,
    "EXPRS": exprs,
    "STR": str,
    "NUM": num,
    "IDENT": ident,
    "BOOL": bool,
    "LIST": list,
    "RECORD": record,
    "BINDING": binding,
    "ADD": add,
    "STYLE": style,
    "DATA": data,
    "WIDTH": width,
    "HEIGHT": height,
    "HOR": horizontal,
    "VER": vertical,
    "ICICLE": icicle,
    "SUNBURST": sunburst,
    "LABELS": labels,
    "COLOR": color,
    "ZOOM": zoom
  };
  return translate;
})();
var render = (function () {
  function escapeXML(str) {
    return String(str).replace(/&(?!\w+;)/g, "&amp;").replace(/\n/g, " ").replace(/\\/g, "\\\\").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function render(val, resume) {
    // Do some rendering here.
    resume([], val);
  }
  return render;
})();
var compiler = (function () {
  exports.compile = function compile(pool, resume) {
    // Compiler takes an AST in the form of a node pool and translates it into
    // an object to be rendered on the client by the viewer for this language.
    try {
      translate(pool, function (err, val) {
        console.log("translate err=" + JSON.stringify(err, null, 2) + "\nval=" + JSON.stringify(val, null, 2));
        if (err.length) {
          resume(err, val);
        } else {
          render(val, function (err, val) {
            console.log("render err=" + JSON.stringify(err, null, 2) + "\nval=" + JSON.stringify(val, null, 2));
            resume(err, val);
          });
        }
      });
    } catch (x) {
      console.log("ERROR with code");
      console.log(x.stack);
      resume("Compiler error", {
        score: 0
      });
    }
  };
})();
exports.compiler = compiler;