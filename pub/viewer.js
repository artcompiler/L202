/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright (c) 2015, Jeff Dyer, Art Compiler LLC */
// This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).


window.exports.viewer = (function () {
  function update(el, obj, src, pool) {
    obj = JSON.parse(obj);
    var str;
    var graphs = [];//array of graph objects, rather than a single object full of arrays.
    if (obj.error && obj.error.length > 0) {
      str = "ERROR";
    } else {
      data = obj.data;
      if(!(obj.data instanceof(Array))){
        obj.data = [obj.data];
      }//edge case for a single object because the parser likes to unwrap arrays.
    }
    obj.data.forEach(function (element, index, array) {
      if (typeof element === "object" && element.tree && typeof element.tree === "string") {
        element.tree = JSON.parse(element.tree);
        graphs = element;
      }
    });
    //partition looks for children arrays starting from root and positions and scales based on number of children and their values.
    var svgd = d3.select(el)
    svgd.selectAll("g")
      .remove();//clear each time
    function styles(selection, these){
      these.forEach(function (p){
        selection
          .style(p.key, p.val);
      });
    }
    var ypos = 0;
    var xpos = 0;
    var color = d3.scale.ordinal()
      .range(graphs.color);
    var root = graphs.tree;
    if(graphs.orientation === "vertical"){
      var loc = ['x', 'y', 'dx', 'dy', 'width', 'height', "rotate(90)"];
    } else if(graphs.orientation === "horizontal"){
      var loc = ['y', 'x', 'dy', 'dx', 'height', 'width', "rotate(0)"];
    }
    var textcheck = function(d) {
      return x(d[loc[2]]) > (d[loc[5]]+2) && y(d[loc[3]]) > (d[loc[4]]+2);
    };//bar width > bbox width && bar height > bbox height, though in the horizontal case it's in the reverse order.

    var partition = d3.layout.partition()
      .children(function(d) {//use this to check for metadata. It'll be a little slower but it beats an entire different loop.
        var ch = null;
        if(d.value !== null && typeof d.value === 'object'){//typical case, for objects
          var temp = d3.entries(d.value);
          ch = [];
          temp.forEach(function (element, index) {
            d.title = "";
            d.link = "";
            if(element.key === '_'){//the designated metadata definer.
              d.title = element.value.title;//value is an object, even though 'value' may be part of it.
              d.value = element.value.value;
              d.name = element.value.name;
              d.link = element.value.link;
              d.image = element.value.image ? element.value.image
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, "'") : null;
            } else {//add it to the array only if it isn't metadata.
              ch.push(element);
            }
          });
          return ch;
        } else if(d.value && d.value.constructor === Array){//note that unless this is an array OF OBJECTS it's invalid.
          ch = [];
          var temp = {
            key: null,
            value: null,
          };
          d.value.forEach(function (element, index) {
            temp.key = index.toString();//give it it's index as a name.
            temp.value = element;//technically works even if it's, say, an index of numbers (in which case they'll be leaves)
            ch.push(temp);
          });
        } else if(isNaN(d.value) || (graphs.valuetype && d.value !== 1)){//not an array, object, or number
          ch = [{
            key: d.value,
            value: 1,
          }];
        }
        return ch;
      })
      .value(function(d) { return d.value; });
    var nodes = root.constructor === Array ? partition(d3.entries({A: root})[0]) : partition(d3.entries(root)[0]);
    var svg = svgd.selectAll("g")
      .data(nodes)
      .enter().append("g");//let's try something new.
    function getWidth(str){
      var unit = 1;
      var begin = str.indexOf("width=") + 7;  // width="
      str = str.substring(begin);
      var end = str.indexOf("px");
      if (end < 0) {
        end = str.indexOf("ex");
        unit = 6;
      }
      str = str.substring(0, end);
      return +str * unit;
    };
    function getHeight(str) {
      var unit = 1;
      var begin = str.indexOf("height") + 8;  // height="
      str = str.substring(begin);
      var end = str.indexOf("px");
      if (end < 0) {
        end = str.indexOf("ex");
        unit = 6;
      }
      str = str.substring(0, end);
      return +str * unit;
    };
    if(graphs.graphtype === "icicle"){
      var x = d3.scale.linear()
        .range([0, graphs.width]);
      var y = d3.scale.linear()
        .range([0, graphs.height]);

      var rect = svg.append("rect")//this creates a rectangle for every piece of data the partition feels relevant.
        .attr("x", function(d) { return x(d[loc[0]]); })
        .attr("y", function(d) { return y(d[loc[1]]) + ypos; })
        .attr("width", function(d) { return x(d[loc[2]]); })
        .attr("height", function(d) { return y(d[loc[3]]); })
        .attr("fill", function(d) {
          var tt = color((d.children ? d : d.parent).key);
          if(isNaN(tt.a)){tt.a = graphs.opacity;}
          return "rgba("+tt.r+","+tt.g+","+tt.b+","+tt.a+")";
        })
        .attr("stroke", "rgba("+graphs.bcolor.r+","+graphs.bcolor.g+","+graphs.bcolor.b+","+graphs.bcolor.a+")")
        .on("click", function (d) {
          if(d.link){
            window.open(d.link, "L202-target");
          } else if(graphs.zoom){
            return clicked(d);
          }
          return;
        });
      if(graphs.leaf){
        var ltest = function(d){return true;};
        if(graphs.leaf.parts !== 'all'){
          ltest = (graphs.leaf.parts === 'leaf') ? function(d){return !d.children;} : function(d){return d.children;};
        }//if leaf, we only highlight if it has no children (is a leaf), otherwise we highlight only ones that DO have children.
        rect.attr("fill", function(d) {
          var tt = color((d.children ? d : d.parent).key);
          if(isNaN(tt.a)){tt.a = graphs.opacity;}
          var col = "rgba("+tt.r+","+tt.g+","+tt.b+","+tt.a+")";
          if(ltest(d)){
            graphs.leaf.ranges.forEach(function (element, index, array) {//for each range
              if(+d.value >= +element[0] && +d.value <= +element[1]){//each has two values that give the range.
                 tt = graphs.leaf.colors[index];
                 if(isNaN(tt.a)){tt.a = graphs.opacity;}
                 col = "rgba("+tt.r+","+tt.g+","+tt.b+","+tt.a+")";
              }//matches with the first.
            });
          }
          return col;
        });
      }
      rect.append("svg:title")
        .text(function (d){
          if(!d.children){
            return d.link + "\n" + d.title;
          } else {
            return "";
          }
        });

      if(graphs.zoom){
        var height = graphs.height;
        var width = graphs.width;
        var test = graphs.orientation;
        var sty = graphs.style;
        function clicked(d){
          if(test === "vertical"){
            var xd = x.domain([d.x, d.x + d.dx]),
                yd = y.domain([d.y, 1]).range([d.y ? 20 : 0, height]);
          } else if(test === "horizontal"){
            var xd = x.domain([d.y, 1]).range([d.y ? 20 : 0, width]),
                yd = y.domain([d.x, d.x + d.dx]);          
          }
          var textch = function(d) {//text width/height doesn't change from this
            return (xd(d[loc[0]] + d[loc[2]]) - xd(d[loc[0]])) > (d[loc[5]]+2) && (yd(d[loc[1]] + d[loc[3]]) - yd(d[loc[1]])) > (d[loc[4]]+2);
          };
          rect.transition()
              .duration(750)
              .attr("x", function(d) { return xd(d[loc[0]]); })
              .attr("y", function(d) { return yd(d[loc[1]]); })
              .attr("width", function(d) { return xd(d[loc[0]] + d[loc[2]]) - xd(d[loc[0]]); })
              .attr("height", function(d) { return yd(d[loc[1]] + d[loc[3]]) - yd(d[loc[1]]); })
              .each(function(e, i) {
                var arcText = d3.select(this.parentNode).select("text");
                var arcImg = d3.select(this.parentNode).select("image");
                arcText.transition().duration(750)
                  .attr(loc[0], function (d) {
                    var j = graphs.orientation == 'horizontal' ? (yd(d[loc[1]] + d[loc[3]]) - yd(d[loc[1]]))/2 : 4; return yd(d[loc[1]]) + j;
                  })
                  .attr(loc[1], function (d) {
                    return graphs.orientation == 'horizontal' ? xd(d[loc[0]]) + 4: -xd(d[loc[0]]) - (xd(d[loc[0]] + d[loc[2]]) - xd(d[loc[0]]))/2;
                  });
                arcImg.transition().duration(750)
                  .attr(loc[0], function (d) {
                    var j = graphs.orientation == 'horizontal' ? (yd(d[loc[1]] + d[loc[3]]) - yd(d[loc[1]]) - d.imgheight)/2 : 4; return yd(d[loc[1]]) + j;
                  })
                  .attr(loc[1], function (d) {
                    return graphs.orientation == 'horizontal' ? xd(d[loc[0]]) + 4: -xd(d[loc[0]]) - (xd(d[loc[0]] + d[loc[2]]) - xd(d[loc[0]]) + d.imgheight)/2;
                  })
                if(e.x >= d.x && e.x < (d.x + d.dx)) {
                  arcText.attr("opacity", function (d){ return textch(d) ? 1 : 0;});
                  arcImg.style("opacity", function (d){ return ((xd(d[loc[0]] + d[loc[2]]) - xd(d[loc[0]])) > (d['img'+loc[5]]+2) && (yd(d[loc[1]] + d[loc[3]]) - yd(d[loc[1]])) > (d['img'+loc[4]]+2)) ? 1 : 0;});
                }
              });
        }
      }
      if(graphs.labelling){
        var text = svg.append("text")
          .attr("dy", ".35em")
          .attr("transform", function(d) { return loc[6]; })
          .attr(loc[0], function(d) {var j = graphs.orientation == 'horizontal' ? y(d[loc[3]])/2 : 4; return y(d[loc[1]]) + j;})
          .attr(loc[1], function(d) {return graphs.orientation == 'horizontal' ? x(d[loc[0]]) + 4 : -x(d[loc[0]]) - x(d[loc[2]])/2;})
          .text(function(d) {
            var lab = '';
            if(!d.image || !graphs.labelling[2]){//if images are off or this lacks one
              if(graphs.labelling[0]){lab += d.name ? d.name+" " : d.key+" ";}//space either doesn't matter or helps with value.
              if(graphs.labelling[1]){lab += d.value;}
            }
            return lab;
          })
          .style("text-anchor", 'start')
          .style("font-size", 10+"px")
          .call(styles, graphs.style)
          .each(function (d) {
            d.width = this.getBBox().width;
            d.height = this.getBBox().height;
          })
          .attr("opacity", function (d) {
            return textcheck(d) ? 1 : 0;//if it's true the box is larger than the text in both directions
          })
          .on("click", function (d) {
            if(d.link){
              window.open(d.link, "L202-target");
            } else if(graphs.zoom){
              return clicked(d);
            }
            return;
          })
          .append("svg:title")
            .text(function (d){
              if(!d.children){
                return d.link + "\n" + d.title;
              } else {
                return "";
              }
            });
        if(graphs.labelling[2]){
          var img = svg.append("image")
            .attr("width", function (d) {
              if(d.image){
                return (d.imgwidth = getWidth(d.image));
              } else {
                return d.imgwidth = 0;
              }
            })
            .attr("height", function (d) {
              if(d.image){
                return (d.imgheight = getHeight(d.image));
              } else {
                return d.imgheight = 0;
              }
            })
            .attr("transform", function(d) { return loc[6]; })
            .attr(loc[0], function(d) {
              var j = graphs.orientation == 'horizontal' ? (y(d[loc[3]]) - d.imgheight)/2: 4; return y(d[loc[1]]) + j;
            })
            .attr(loc[1], function(d) {
              return graphs.orientation == 'horizontal' ? x(d[loc[0]]) + 4 : -x(d[loc[0]]) - (x(d[loc[2]]) + d.imgheight)/2;
            })
            .style("opacity", function (d) {
              return ((x(d[loc[2]]) > d['img'+loc[5]]+2) && (y(d[loc[3]]) > (d['img'+loc[4]]+2))) ? 1 : 0;
            })
            .attr("xlink:href", function (d) {
              return "data:image/svg+xml;utf8," + d.image;
            })
            .on("click", function (d) {
              if(d.link){
                window.open(d.link, "L202-target");
              } else if(graphs.zoom){
                return clicked(d);
              }
              return;
            })
            .append("svg:title")
              .text(function (d){
                if(!d.children){
                  return d.link + "\n" + d.title;
                } else {
                  return "";
                }
              });
        }
      }
    } else if(graphs.graphtype === "sunburst"){
      var radius = Math.min(graphs.width, graphs.height)/2;
      var x = d3.scale.linear()
        .range([0, 2*Math.PI]);
      var y = d3.scale.sqrt()
        .range([0, radius]);
      var angle = isNaN(graphs.rotation) ? 0 : graphs.rotation;
      svg
        .attr("transform", "translate(" + graphs.width/2 + "," + (graphs.height/2) + ")rotate("+ angle +")");
      var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

      var path = svg.append("path")
        .attr("d", arc)
        .attr("stroke", "rgba("+graphs.bcolor.r+","+graphs.bcolor.g+","+graphs.bcolor.b+","+graphs.bcolor.a+")")
        .style("fill", function(d) {
          var tt = color((d.children ? d : d.parent).key);
          if(isNaN(tt.a)){tt.a = graphs.opacity;}
          return "rgba("+tt.r+","+tt.g+","+tt.b+","+tt.a+")";
        })
        .on("click", function (d) {
          if(d.link){
            window.open(d.link, "L202-target");
          } else if(graphs.zoom){
            return click(d);
          }
          return;
        });

      if(graphs.rotation === 'free'){
        path.on("wheel", function (d) {
          d3.event.preventDefault();
          var delta = Math.max(-1, Math.min(1, (d3.event.wheelDelta || -d3.event.detail)));
          angle += delta;//just find a good constant.
          svg
            .attr("transform", "translate(" + graphs.width/2 + "," + (graphs.height/2) + ")rotate("+ angle +")");
        });
      }
      if(graphs.leaf){
        var ltest = function(d){return true;};
        if(graphs.leaf.parts !== 'all'){
          ltest = (graphs.leaf.parts === 'leaf') ? function(d){return !d.children;} : function(d){return d.children;};
        }
        path.style("fill", function(d) {
          var tt = color((d.children ? d : d.parent).key);
          if(isNaN(tt.a)){tt.a = graphs.opacity;}
          var col = "rgba("+tt.r+","+tt.g+","+tt.b+","+tt.a+")";
          if(ltest(d)){
            graphs.leaf.ranges.forEach(function (element, index, array) {//for each range
              if(+d.value >= +element[0] && +d.value <= +element[1]){//each has two values that give the range.
                 tt = graphs.leaf.colors[index];
                 if(isNaN(tt.a)){tt.a = graphs.opacity;}
                 col = "rgba("+tt.r+","+tt.g+","+tt.b+","+tt.a+")";
              }//matches with the first.
            });
          }
          return col;
        });
      }
      path.append("svg:title")
        .text(function (d){
          if(!d.children){
            return d.link + "\n" + d.title;
          } else {
            return "";
          }
        });
      if(graphs.zoom){
        function click(d) {
          function tw(d){
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
            return function(d, i){
              return i
                  ? function (t) { return arc(d); }
                  : function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
            };
          }
          path.transition()
            .duration(750)
            .attrTween("d", tw(d))
            .each("end", function(e, i){//when the transition ends
              var arcText = d3.select(this.parentNode).select("text");
              var arcImg = d3.select(this.parentNode).select("image");
              if(e.x >= d.x && e.x < (d.x + d.dx)) {//grab all the text
                arcText.transition().duration(0)
                  .attr("opacity", 1)
                  .attr("opacity", function(d) {return ((x(d.x+d.dx)-x(d.x) < 4*Math.PI/180) ? 0 : 1);})
                  .attr("transform", function() { return "rotate(" + ((x(e.x + e.dx / 2) - Math.PI / 2) / Math.PI * 180) + ")"})
                  .attr("x", function(d) { return y(d.y); });
                arcImg.transition().duration(0)
                  .style("opacity", 1)
                  .attr("transform", function() { return "rotate(" + ((x(e.x + e.dx / 2) - Math.PI / 2) / Math.PI * 180) + ")"})
                  .attr("x", function(d) { return y(d.y+d.dy/2)-d.imgwidth; })
                  .attr("y", function(d) { return -d.imgheight/2;});
              } else {
                arcText.attr("opacity", 0);
                arcImg.style("opacity", 0);
              }
            });
        }
      }
      if(graphs.labelling){
        var text = svg.append("text")
          .attr("transform", function(d) { return "rotate(" + ((x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180) + ")";})
          .attr("x", function(d) { return y(d.y); })
          .attr("dx", "6")
          .attr("dy", ".35em")
          .text(function(d) {
            var lab = '';
            if(!d.image || !graphs.labelling[2]){//if images are off or this lacks one
              if(graphs.labelling[0]){lab += d.name ? d.name+" " : d.key+" ";}//space either doesn't matter or helps with value.
              if(graphs.labelling[1]){lab += d.value;}
            }
            return lab;
          })
          .call(styles, graphs.style)
          .each(function (d) {
            d.width = this.getBBox().width;
            d.height = this.getBBox().height;
          })
          .attr("opacity", function(d) {return ((x(d.x+d.dx)-x(d.x) < 4*Math.PI/180) ? 0 : 1);})
          .on("click", function (d) {
            if(d.link){
              window.open(d.link, "L202-target");
            } else if(graphs.zoom){
              return click(d);
            }
            return;
          })
          .append("svg:title")
            .text(function (d){
              if(!d.children){
                return d.link + "\n" + d.title;
              } else {
                return "";
              }
            });
        if(graphs.labelling[2]){
          var img = svg.append("image")
            .attr("width", function (d) {
              if(d.image){
                return (d.imgwidth = getWidth(d.image));
              } else {
                return d.imgwidth = 0;
              }
            })
            .attr("height", function (d) {
              if(d.image){
                return (d.imgheight = getHeight(d.image));
              } else {
                return d.imgheight = 0;
              }
            })
            .attr("transform", function (d){
              return "rotate(" + ((x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180) + ")";
            })
            .attr("x", function(d) { return y(d.y+d.dy/2)-d.imgwidth; })
            .attr("y", function(d) { return -d.imgheight/2;})
            .style("opacity", function (d) {
              return 1;
              //return ((x(d[loc[2]]) > d['img'+loc[5]]+2) && (y(d[loc[3]]) > (d['img'+loc[4]]+2))) ? 1 : 1;
            })
            .attr("xlink:href", function (d) {
              return "data:image/svg+xml;utf8," + d.image;
            })
            .on("click", function (d) {
              if(d.link){
                window.open(d.link, "L202-target");
              } else if(graphs.zoom){
                return click(d);
              }
              return;
            })
            .append("svg:title")
              .text(function (d){
                if(!d.children){
                  return d.link + "\n" + d.title;
                } else {
                  return "";
                }
              });
        }
        if(graphs.rotation === 'free'){
          text.on("wheel", function (d) {
            d3.event.preventDefault();
            var delta = Math.max(-1, Math.min(1, (d3.event.wheelDelta || -d3.event.detail)));
            angle += delta;//just find a good constant.
            svg
              .attr("transform", "translate(" + graphs.width/2 + "," + (graphs.height/2) + ")rotate("+ angle +")");
          });
        }
      }
    }
    svgd
      .attr("width", graphs.width)
      .attr("height", graphs.height);
  }
  function capture(el) {
    //var mySVG = $(el).html();
    return null;//mySVG;
  }
  return {
    update: update,
    capture: capture,
  };
})();

