/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright (c) 2015, Jeff Dyer, Art Compiler LLC */
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
      if (typeof element === "object" && element.tree && typeof element.tree === "object" && element.graphtype === "icicle") {
        graphs = graphs.concat(element);
      }
    });
    //just make one work for now.
    //partition looks for children arrays starting from root and positions and scales based on number of children and their values.
    var svgd = d3.select(el)
    svgd.selectAll("g")
      .remove();//clear each time
    var svg = svgd.append("g");
    function styles(selection, these){
      these.forEach(function (p){
        selection
          .style(p.key, p.val);
      });
    }
    var ypos = 0;
    var xpos = 0;
    for(var counter = 0; counter < graphs.length; counter++){
      var color = d3.scale.category20();
      //in perfect honesty I don't know how color works, but it works for them.
      var root = graphs[counter].tree;
      if(graphs[counter].orientation === "vertical"){
        var loc = ['x', 'y', 'dx', 'dy', 'width', 'height', ")rotate(90)"];
      } else if(graphs[counter].orientation === "horizontal"){
        var loc = ['y', 'x', 'dy', 'dx', 'height', 'width', ")"];
      }

      var partition = d3.layout.partition()
        .children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
        .size([graphs[counter][loc[4]], graphs[counter][loc[5]]])
        .value(function(d) { return d.value; });

      var nodes = partition(d3.entries(root)[0]);

      svg.selectAll(".node")
        .data(nodes)
        .enter().append("rect")//this creates a rectangle for every piece of data the partition feels relevant.
        .attr("class", "node")
        .attr("x", function(d) { return d[loc[0]]; })
        .attr("y", function(d) { return d[loc[1]] + ypos; })
        .attr("width", function(d) { return d[loc[2]]; })
        .attr("height", function(d) { return d[loc[3]]; })
        .attr("fill", function(d) { return color((d.children ? d : d.parent).key); })
        .attr("stroke", '#fff');

      svg.selectAll(".label")
        .data(nodes.filter(function(d) { return d.dx > 6; }))
        .enter().append("text") //all entities large enough get a label
        .attr("class", "label")
        .attr("dy", ".35em")
        .attr("transform", function(d) { return "translate(" + (d[loc[0]] + d[loc[2]] / 2) + "," + (ypos + d[loc[1]] + d[loc[3]] / 2) + loc[6]; })
        .text(function(d) { return d.key })
        .style("font-size", 10+"px")
        .call(styles, graphs[counter].style);

      ypos += graphs[counter].height;
      xpos = (graphs[counter].width > xpos) ? graphs[counter].width : xpos;
    }
    svgd
      .attr("width", xpos)
      .attr("height", ypos);
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

