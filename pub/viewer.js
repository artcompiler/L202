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
      if (typeof element === "object" && element.tree && typeof element.tree === "object") {
        graphs = graphs.concat(element);
      }
    });
    //just make one work for now.
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
    for(var counter = 0; counter < graphs.length; counter++){
      var color = d3.scale.category20c();
      var root = graphs[counter].tree;
      if(graphs[counter].orientation === "vertical"){
        var loc = ['x', 'y', 'dx', 'dy', 'width', 'height', ")rotate(90)"];
      } else if(graphs[counter].orientation === "horizontal"){
        var loc = ['y', 'x', 'dy', 'dx', 'height', 'width', ")"];
      }

      var partition = d3.layout.partition()
        .children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
        .value(function(d) { return d.value; });//or it breaks sunburst (and probably ruins rect) or takes two calls

      var nodes = partition(d3.entries(root)[0]);
      var svg = svgd.selectAll("g")
        .data(nodes)
        .enter().append("g");//let's try something new.
      if(graphs[counter].graphtype === "icicle"){
        var x = d3.scale.linear()
          .range([0, graphs[counter].width]);
        var y = d3.scale.linear()
          .range([0, graphs[counter].height]);

        var rect = svg.append("rect")//this creates a rectangle for every piece of data the partition feels relevant.
          .attr("x", function(d) { return x(d[loc[0]]); })
          .attr("y", function(d) { return y(d[loc[1]]) + ypos; })
          .attr("width", function(d) { return x(d[loc[2]]); })
          .attr("height", function(d) { return y(d[loc[3]]); })
          .attr("fill", function(d) { return color((d.children ? d : d.parent).key); })
          .attr("stroke", '#fff');
          //.on("click", clicked);
        if(graphs[counter].labelling){
          var text = svg.append("text")
            .attr("dy", ".35em")
            .attr("transform", function(d) { return "translate(" + (x(d[loc[0]]) + x(d[loc[2]]) / 2) + "," + (ypos + y(d[loc[1]]) + y(d[loc[3]]) / 2) + loc[6]; })
            .text(function(d) { return d.key })
            .style("text-anchor", 'middle')
            .style("font-size", function(d) { return ((x(d.dx) < 6) ? 0 : 10)+"px";})
            .call(styles, graphs[counter].style);
        }
      } else if(graphs[counter].graphtype === "sunburst"){
        //needed differences: scaling, radius, translation to center, arc and path instead of rect
        var radius = Math.min(graphs[counter].width, graphs[counter].height)/2;
        var x = d3.scale.linear()
          .range([0, 2*Math.PI]);
        var y = d3.scale.sqrt()
          .range([0, radius]);
        svg
          .attr("transform", "translate(" + graphs[counter].width/2 + "," + (graphs[counter].height/2 + 10) + ")");
        var arc = d3.svg.arc()
          .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
          .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
          .innerRadius(function(d) { return Math.max(0, y(d.y)); })
          .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

        var path = svg.append("path")
          .attr("d", arc)
          .attr("stroke", '#fff')
          .style("fill", function(d) { return color((d.children ? d : d.parent).key); });
        if(graphs[counter].labelling){
          var text = svg.append("text")
            .attr("transform", function(d) { return "rotate(" + ((x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180) + ")";})
            .attr("x", function(d) { return y(d.y); })
            .attr("dx", "6")
            .attr("dy", ".35em")
            .text(function(d) { return d.key; })
            .style("font-size", function(d) { return ((x(d.dx) < 10/(Math.PI * 180)) ? 0 : 12)+"px";})
            .call(styles, graphs[counter].style);
        }
      }
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
  /*function clicked(d) {
    x.domain([d.x, d.x + d.dx]);//see if you need to flip this for horizontal
    y.domain([d.y, 1]).range([d.y ? 20 : 0, height]);

    rect.transition()
      .duration(750)
      .attr("x", function(d) { return x(d.x);})
  }*/
  return {
    update: update,
    capture: capture,
  };
})();

