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
      var textcheck = function(d) { return x(d[loc[2]]); };
    } else if(graphs.orientation === "horizontal"){
      var loc = ['y', 'x', 'dy', 'dx', 'height', 'width', ")"];
      var textcheck = function(d) { return y(d[loc[3]]); };
    }

    var partition = d3.layout.partition()
      .children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
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
        .attr("fill", function(d) { return color((d.children ? d : d.parent).key); })
        .attr("stroke", '#fff');

      if(graphs.leaf){
        rect.attr("fill", function(d) {
          var col = color((d.children ? d : d.parent).key);
          graphs.leaf.ranges.forEach(function (element, index, array) {//for each range
            if(+d.value >= +element[0] && +d.value <= +element[1]){//each has two values that give the range.
               col = graphs.leaf.colors[index];
            }//matches with the first.
          });
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
                yd = y.domain([d.y, 1]).range([d.y ? 20 : 0, height]),
                textch = function(d){ return xd(d[loc[0]] + d[loc[2]]) - xd(d[loc[0]]); };//return width
          } else if(test === "horizontal"){
            var xd = x.domain([d.y, 1]).range([d.y ? 20 : 0, width]),
                yd = y.domain([d.x, d.x + d.dx]),
                textch = function(d) { return yd(d[loc[1]] + d[loc[3]]) - yd(d[loc[1]]); };//return height              
          }
          
//if vertical we want this because it maps the width of the selected to the x domain
//if horizontal we want to map height instead.
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
                    .attr("opacity", function(d) {return ((textch(d) < 6) ? 0 : 1);})
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
            if(graphs.labelling[0]){lab += d.key+" ";}//space either doesn't matter or helps with value.
            if(graphs.labelling[1]){lab += d.value;}
            return lab;
          })
          .style("text-anchor", 'middle')
          .attr("opacity", function(d) {return ((textcheck(d) < 6) ? 0 : 1);})
          .style("font-size", 10+"px")
          .call(styles, graphs.style);
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
        .attr("stroke", '#fff')
        .style("fill", function(d) { return color((d.children ? d : d.parent).key); });
      if(graphs.leaf){
        path.style("fill", function(d) {
          var col = color((d.children ? d : d.parent).key);
          graphs.leaf.ranges.forEach(function (element, index, array) {//for each range
            if(+d.value >= +element[0] && +d.value <= +element[1]){//each has two values that give the range.
               col = graphs.leaf.colors[index];
            }//matches with the first.
          });
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
            if(graphs.labelling[0]){lab += d.key+" ";}//space either doesn't matter or helps with value.
            if(graphs.labelling[1]){lab += d.value;}
            return lab;
          })
          .style("font-size", function(d) { return ((x(d.dx) < 10/(Math.PI * 180)) ? 0 : 12)+"px";})
          .call(styles, graphs.style);
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

