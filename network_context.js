// Version 4
// draggable element was referred to by https://bl.ocks.org/shimizu/e6209de87cdddde38dadbb746feaf3a3
/////////////////////// Part 1: Subup canvas, axis, scale ///////////////////////////////////

/*// 
two forces are making the network 
1: the gravity that make each dots repel each other
2. the link strength, or force that pull linked dots together. 


*/
var gravity_para = -200 //width*height/16
    alpha_para = 0.55

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    radius = 6;

var svg = d3.select("svg").append("svg")     // select <svg> element from HTML file. This is where canvas was created: create an SVG element and append it to the DOM
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform","translate("+margin.left+","+margin.top+")");

/*///////////////////// Part 2: Visualization set-up ///////////////////////////////////
//color, size, thickness of link (weight), simulation*/

var color = d3.scaleOrdinal(d3.schemeCategory20) // get color 
  .range(["#e91e56", "#00965f", "#00bcd4", "#3f51b5", "#9c27b0", "#ff5722", "#cddc39", "#607d8b", "#8bc34a"]);

var rescale_node = d3.scaleLinear().range([3,10]) // scale for nodesize
var rescale_weight_stroke_width = d3.scaleLinear().range([0.5,3.5]) // scale for stroke-width
var weightScale = d3.scaleLinear().range([0, 1]) // scale for link distance => notworking

/*
The default linkStrength value is 1.0, which maintains the full effect of linkDistance. 
By setting the value of linkStrength less than 1, though, the distance constraint can be relaxed.
Therefore, the weight input is normalized to 1
*/

//var attractForce = d3.forceManyBody().strength(50).distanceMax(400).distanceMin(60);
//var repelForce = d3.forceManyBody().strength(gravity_para).distanceMax(800).distanceMin(60);
var collisionForce = d3.forceCollide(12).strength(0.9).iterations(100); // collide(12) 12 is radius. Strength vari from 0-1

var simulation = d3.forceSimulation().alphaDecay(0.03) //using velocity Verlet integration to simulate forces of physical particles
    //.force('link', d3.forceLink().distance(d => rescale_weight_stroke_width( d.weight ))) //The distance and strength of the linked elements
    //.force('link', d3.forceLink().strength(d => weightScale(d.weight)))//
    .force("link", d3.forceLink().id( d => d.id ))// set
    //.force('link', d3.forceLink().distance(function(d){return 30}))//
    .force("charge", d3.forceManyBody().strength(gravity_para).distanceMax([600]).distanceMin(10) )   //for making elements attract or repel one another
    .force("center", d3.forceCenter(width / 2, height / 2))//for setting the center of gravity of the system
    .force("y", d3.forceY(height/2 ))
    .force("x", d3.forceX(width/2 ))
    .force('collision', collisionForce)// this is working Makeing nodes apart

//////////////////////////////Part 3: Plot! ////////////////////////////////////////
d3.json("data/nuclearNetwork.json", function(error, graph) { // call out json data graph
  if (error) throw error;
  //# set domain all doesn't work here don't know why
  //weightScale.domain(d3.extent(graph, d =>  d.weight )) //rescale_weight_stroke_width.domain(d3.extent(graph, d => d.weight))//rescale_node.domain(d3.extent(graph, d => d.nodeSize))

  var tick = function() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
            //.attr("cx", d => d.x)
            //.attr("cy", d => d.y);
            //.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        makeAnnotations.annotations()
          .forEach((d, i) => {
            d.position = nonOtherNodes[i]
          })
      }
    // This is on how to make dots draggable 
  var node_drag = d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended);//*/

  // Define Link and node
  var link = svg.append("g") // get links
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)       // set link = graph.links, define its class, select all line css attribution
    .enter().append("line")
        //.attr("stroke-width", 2)
        //.attr("stroke-width", d => d.weight*5 );//
        .attr("stroke-width", d => rescale_weight_stroke_width( d.weight ));//

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      //.attr("r", radius-0.75) 
      .attr("r", d => rescale_node(d.nodeSize) )  
      .style("fill", d => d3.hsl(color(d.group)).darker())
      .style("fill-opacity", alpha_para)
      .call(node_drag)

  node.append("title") 
      .text(d => d.id);

  window.collide = d3.bboxCollide((a) => {
    return [[a.offsetCornerX - 5, a.offsetCornerY - 10],[a.offsetCornerX + a.width + 5, a.offsetCornerY + a.height+ 5]]
  })
 .strength(0.5)
 .iterations(1)

  window.yScale = d3.scaleLinear().range()
  window.xScale = d3.scaleLinear().range()


  simulation
      .nodes(graph.nodes)
      .on("tick", tick)
      
      // .on('end'....) make annotations. And make sure annotations go with the dots
      .on("end", function() {
        const noteBoxes = makeAnnotations.collection().noteNodes

         window.labelForce = d3.forceSimulation(noteBoxes)
          .force("x", d3.forceX(a => a.positionX).strength(a => Math.max(0.25, Math.min(3, Math.abs(a.x - a.positionX) / 20))))
          .force("y", d3.forceY(a => a.positionY).strength(a => Math.max(0.25, Math.min(3, Math.abs(a.x - a.positionX) / 20))))
        .force("collision", window.collide) //######################### This is step using bboxCollide to prevent overlapping
          .alpha(0.5)
          .on('tick', d => {
              makeAnnotations.annotations()
              .forEach((d, i) => {
                const match = noteBoxes[i]  
                      //d.dx = match.x - match.positionX
                      //d.dy = match.y - match.positionY
              })
            
              makeAnnotations.update()
          })
        
      })
  
  const nonOtherNodes = graph.nodes//.filter(d => d.type !== "other")

  simulation.force("link")
      .links(graph.links);

  function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
  function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }
  
  function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
  } 

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Work on aesthetics

  window.makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(nonOtherNodes
    .map((d,i) => {
      return {
        data: {x: d.x, y: d.y, group: d.group},
        note: { label: d.id,
          align: "middle",
          orientation: "fixed" },
        connector: { type: "elbow"},
        className: d.type
      }
    }))
    .accessors({ x: d => d.x , y: d => d.y})

  svg.append("g")
    .attr("class", "annotation")
    .call(makeAnnotations)

svg.selectAll(".annotation-note text")
    .style("fill", d => d3.hsl(color(d.data.group)).darker().darker().darker().darker())//d => color(d.data.group))//.darker().darker()
    .attr("x", (width / 2)+10)
    .attr("y", 10)
    //.style("fill", d => 'SlateGray')
    //.style("font", "12px calibri")

  //svg.selectAll(".annotation-note text")
   // .style("fill", d => d3.hsl(color(d.data.group)).darker().darker().darker().darker())//d => color(d.data.group))//.darker().darker()
    //.style("fill", d => 'SlateGray')
    //.style("font", "12px calibri")

  //svg.selectAll(".annotation-connector > path")
  //  .style("stroke", (d,i) => color(d.data.group))
  
});