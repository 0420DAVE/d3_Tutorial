// Version 4

///////////////////////////////// Part 1: Subup canvas, axis, scale //////////////////////////////////////////////////////////////////////////////

// set real space and plot space and margin (the discrepency between the two)
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup 4 x-related variables 
var xValue = function(d) { return d.xValue;},        // data -> value;           a function to get x-axis value from csv file 
    xScale = d3.scaleLinear().range([15, width-50]), // value -> display pixels; a function to map to fit the plot space scale, without specifying any data
    xMap = function(d) { return xScale(xValue(d));}, // data -> display;         a wrapper function to get tranformed data, which is pixels.
    xAxis = d3.axisBottom().scale(xScale)            // define xAxis,            make it fit the xScale by .scale(xScale)

// setup y
var yValue = function(d) { return d.yValue;}, // data -> value
    yScale = d3.scaleLinear().range([height-15, 15]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale)

// setup fill color
var cValue = function(d) { return d.color;},
    color = d3.scaleOrdinal(d3.schemeCategory10);


// add a "svg" (graph canvas) to the "body" of the html page, labelled by the <body> section in html
var svg = d3.select("svg").append("svg") // select <body> section in html page
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    //move the origin from the top-left corner of REAL space to the top-left corner of PLOT space
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

// add the tooltip area to the webpage (don't know what it is)
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

///////////////////////////////// Part 2: Load data and drawing plot //////////////////////////////////////////////////////////////////////////////

// load data
d3.csv("data/semanticDrift.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.xValue = +d.xValue; // transform data from string to numeric by using +
    d.yValue = +d.yValue;
  });

    // code below: scale the range of the data
    // .domain function is designed to let D3 know what the scope of the data will be. This is what is then passed to the scale function
    // y.domain([0, d3.max(data, function(d) { return d.close; })]);
    // .extent function that finds the maximum and minimum values in the array and then...
    // .domain function which returns those maximum and minimum values to D3 as the range for the x axis.
    // In the end, xy axis, accordin to data domain, have correct mapping to the pixels/Scale. 
  xScale.domain(d3.extent(data, xValue)) // within bracket: apply data/csv file to xValue, return with x-axis value
  yScale.domain(d3.extent(data, yValue))
  //xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);

  // add title
  svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0  )
        .attr("text-anchor", "middle")
        .style("font", "15px helvetica")
        .style("text-decoration","underline")
        .text("Semantic Drift of 'Risk'");

  // x-axis
  svg.append("g")
      .attr("class", "x axis") //plot axis
      .attr("transform", "translate(0," + height + ")")
      .style("font", "10px times") 
      .call(xAxis)
    .append("text")
      .attr("class", "label") // plot axis label
      .attr("x", width-50)
      .attr("y", -6)
      .style("text-anchor", "end")
      .style("font", "12px times")
      .text("PC 1");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .style("font", "10px times") 
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -15)
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font", "12px times")
      .text("PC 2");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
       .attr("class", "dot")
         .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("r", 8)
      //.style("fill-opacity", function(d) { return d.opacity-0.1;}) // set the fill opacity 
      .style("fill-opacity", d => d.alpha -0.1) // set the fill opacity 
      .style("stroke", "white") // set the line colour 
      //.style("fill", "green"); // set the fill colour
      .style("fill", function(d) { return color(cValue(d));})

  // annotations
  var annotation = window.annotation = d3.annotate()
        // .show((d) => d.species !== "versicolor") // .show(true)
        //.show((d, ndx) => ndx % 12 === 0)
        .text((d) => `${d.label}`)
        .attr('x', (d) => d.box.x + d.box.width)
        .attr('dy', 4) // dy and dx controls the distance of label to the dotes
        .attr('dx', 3)
        .attr('text-anchor', 'start')
        //.style("font", "18px times")
        .container(svg.append('g'));

  svg.selectAll('.dot').call(annotation);
   // Add the valueline path.
    

});



