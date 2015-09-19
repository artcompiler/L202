/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright (c) 2015, Jeff Dyer, Art Compiler LLC */
// This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).


window.exports.viewer = (function () {
  function update(el, obj, src, pool) {
    obj = JSON.parse(obj);
    var str;
    var graphs = [];//array of graph objects, rather than a single object full of arrays.
    //in this case I can do this because icicle makes sure all parameters have defaults.
    if (obj.error && obj.error.length > 0) {
      str = "ERROR";
    } else {
      data = obj.data;
      if(!(obj.data instanceof(Array))){
        obj.data = [obj.data];
      }//edge case for a single object because the parser likes to unwrap arrays.
    }
    obj.data.forEach(function (element, index, array) {
      if (typeof element === "object" && element.tree && typeof element.tree === "object") {
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
      var loc = ['x', 'y', 'dx', 'dy', 'width', 'height', ")rotate(90)"];
    } else if(graphs.orientation === "horizontal"){
      var loc = ['y', 'x', 'dy', 'dx', 'height', 'width', ")"];
    }
    var textcheck = function(d) {
      return x(d[loc[2]]) > (d[loc[5]]+2) && y(d[loc[3]]) > (d[loc[4]]+2);
    };//bar width > bbox width && bar height > bbox height, though in the horizontal case it's in the reverse order.

    var partition = d3.layout.partition()
      .children(function(d) {//use this to check for metadata. It'll be a little slower but it beats an entire different loop.
        if(isNaN(d.value)){
          var temp = d3.entries(d.value);
          var ch = [];
          temp.forEach(function (element, index) {
            if(element.key === '_'){//the designated metadata definer.
              d.title = element.value.title;//value is an object, even though 'value' may be part of it.
              d.value = element.value.value;
              d.name = element.value.name;
            } else {//add it to the array only if it isn't metadata.
              ch.push(element);
            }
          });
          return ch;
        } else {
          return null;
        }
      })
      .value(function(d) { return d.value; });
    var nodes = partition(d3.entries(root)[0]);
    var svg = svgd.selectAll("g")
      .data(nodes)
      .enter().append("g");//let's try something new.
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
        .on("mouseover", function (d){
          if(d.title && !d.tooltip){
            d.tooltip = d3.select("body")
              .append("div")
              .style("position", "absolute")
              .style("z-index", "10")
              .style("visibility", "visible")
              .text(d.title);
          } else if (d.tooltip){
            d.tooltip
              .style("visibility", "visible");
          }
        })
        .on("mousemove", function (d){
          if(d.tooltip){
            d.tooltip
              .style("top", (d3.event.pageY-10)+"px")
              .style("left",(d3.event.pageX+10)+"px");
          }
        })
        .on("mouseout", function (d) {
          if(d.tooltip){
            d.tooltip
              .style("visibility", "hidden");
          }
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
      if(graphs.zoom){
        rect.on("click", clicked);
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
          if(text){
            text.transition().attr("opacity", 0);
          }

          rect.transition()
              .duration(750)
              .attr("x", function(d) { return xd(d[loc[0]]); })
              .attr("y", function(d) { return yd(d[loc[1]]); })
              .attr("width", function(d) { return xd(d[loc[0]] + d[loc[2]]) - xd(d[loc[0]]); })
              .attr("height", function(d) { return yd(d[loc[1]] + d[loc[3]]) - yd(d[loc[1]]); })
              .each("end", function(e, i) {
                if(e.x >= d.x && e.x < (d.x + d.dx)) {
                  var arcText = d3.select(this.parentNode).select("text");
                  arcText.transition().duration(750)
                    .attr("opacity", function(d) {
                      return textch(d) ? 1 : 0;
                    })
                    .attr("transform", function(d) { return "translate(" + (xd(d[loc[0]]) + (xd(d[loc[0]] + d[loc[2]]) - xd(d[loc[0]]))/2) + "," + (yd(d[loc[1]]) + (yd(d[loc[1]] + d[loc[3]]) - yd(d[loc[1]]))/2) + loc[6]; });
                }
              });
        }
      }
      if(graphs.labelling){
        var text = svg.append("text")
          .attr("dy", ".35em")
          .attr("transform", function(d) { return "translate(" + (x(d[loc[0]]) + x(d[loc[2]]) / 2) + "," + (ypos + y(d[loc[1]]) + y(d[loc[3]]) / 2) + loc[6]; })
          .text(function(d) {
            var lab = '';
            if(graphs.labelling[0]){lab += d.name ? d.name+" " : d.key+" ";}//space either doesn't matter or helps with value.
            if(graphs.labelling[1]){lab += d.value;}
            return lab;
          })
          .style("text-anchor", 'middle')
          .style("font-size", 10+"px")
          .call(styles, graphs.style)
          .each(function (d) {
            d.width = this.getBBox().width;
            d.height = this.getBBox().height;
          });
        text
          .attr("opacity", function (d) {
            return textcheck(d) ? 1 : 0;//if it's true the box is larger than the text in both directions
          });
      }
    } else if(graphs.graphtype === "sunburst"){
      //needed differences: scaling, radius, translation to center, arc and path instead of rect
      var radius = Math.min(graphs.width, graphs.height)/2;
      var x = d3.scale.linear()
        .range([0, 2*Math.PI]);
      var y = d3.scale.sqrt()
        .range([0, radius]);
      svg
        .attr("transform", "translate(" + graphs.width/2 + "," + (graphs.height/2 + 10) + ")rotate("+ graphs.rotation +")");
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
        .on("mouseover", function (d){
          if(d.title && !d.tooltip){
            d.tooltip = d3.select("body")
              .append("div")
              .style("position", "absolute")
              .style("z-index", "10")
              .style("visibility", "visible")
              .text(d.title);
          } else if (d.tooltip){
            d.tooltip
              .style("visibility", "visible");
          }
        })
        .on("mousemove", function (d){
          if(d.tooltip){
            d.tooltip
              .style("top", (d3.event.pageY-10)+"px")
              .style("left",(d3.event.pageX+10)+"px");
          }
        })
        .on("mouseout", function (d) {
          if(d.tooltip){
            d.tooltip
              .style("visibility", "hidden");
          }
        });
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
      if(graphs.zoom){
        path.on("click", click);
        function click(d) {
          if(text){
            text.transition().attr("opacity", 0);
          }
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
              if(e.x >= d.x && e.x < (d.x + d.dx)) {//grab all the text
                var arcText = d3.select(this.parentNode).select("text");
                arcText.transition().duration(750)
                  .attr("opacity", 1)
                  .attr("opacity", function(d) {return ((x(d.x+d.dx)-x(d.x) < 4*Math.PI/180) ? 0 : 1);})
                  .attr("transform", function() { return "rotate(" + ((x(e.x + e.dx / 2) - Math.PI / 2) / Math.PI * 180) + ")"})
                  .attr("x", function(d) { return y(d.y); });
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
            if(graphs.labelling[0]){lab += d.name ? d.name+" " : d.key+" ";}//space either doesn't matter or helps with value.
            if(graphs.labelling[1]){lab += d.value;}
            return lab;
          })
          .attr("opacity", function(d) {return ((x(d.x+d.dx)-x(d.x) < 4*Math.PI/180) ? 0 : 1);})
          .call(styles, graphs.style)
          .each(function (d) {
            d.width = this.getBBox().width;
            d.height = this.getBBox().height;
          });
      }
    }
    svgd
      .attr("width", graphs.width)
      .attr("height", graphs.height);
  }
  function capture(el) {
    var mySVG = $(el).html();
    return mySVG;
  }
  return {
    update: update,
    capture: capture,
  };
})();

