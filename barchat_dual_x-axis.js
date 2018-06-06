

// width, height, margins and padding
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 600 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// scale
var adjust = 5/10
var xPos = d3.scaleLinear().range([0, width*(1-adjust)]),
    xNeg = d3.scaleLinear().range([0, width*adjust]),
    x = d3.scaleLinear().range([0, width]),
    y = d3.scaleBand().rangeRound([0, height]).padding(0.1);

    //xAxis = d3.axisBottom().scale(x).tickFormat(d3.format(".1e"));
    xAxisPos = d3.axisBottom().scale(xPos).tickFormat(d3.format(".1e")).ticks(4);
    xAxisNeg = d3.axisBottom().scale(xNeg).tickFormat(d3.format(".1e")).ticks(4);
    yAxis = d3.axisLeft().scale(y)
                          .tickSize(0)
                          .tickPadding(6);
            
function type(d) {d.value = +d.value; return d};

d3.csv("data/barchart_gay_1950_2000.csv",  type, function(data) {

  // it is important not to use extent. Instead use .domain([0,d3.max]) and .domain([d3.min, 0]) because you want to set 0 in the center
  xPos.domain([0, d3.max(data.filter(d => d.value>0), function(d) { return d.value; })]).nice();
  xNeg.domain([d3.min(data.filter(d => d.value<=0), function(d) { return d.value; }),0]).nice();
  //xPos.domain(d3.extent(data.filter(d => d.value>0), function(d) { return d.value; })).nice();
  //xNeg.domain(d3.extent(data.filter(d => d.value<0), function(d) { return d.value; })).nice();
  //x.domain(d3.extent(data, function(d) { return d.value; })).nice();
  y.domain(data.map(function(d) { return d.name; }));

  console.log(data.filter(d=>d.value>0))


  // create svg
  var svg = d3.select("#barchart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", function(d) { return "bar bar--" + (d.value > 0 ? "positive" : "negative"); })
      //.attr("x", function(d) { return x(Math.min(0, d.value)); })
      .attr("x", function(d) { return d.value >0 ? xPos(Math.min(0, d.value))+xNeg(0)  : xNeg(Math.min(0, d.value)) })
      .attr("y", function(d) { return y(d.name); })
      //.attr("width", function(d) { return Math.abs(x(d.value) - x(0)) })
      .attr("width", function(d) { return  d.value>0 ? Math.abs(xPos(d.value) - xPos(0)) : Math.abs(xNeg(d.value) - xNeg(0)) })
      .attr("height", y.bandwidth());

  svg.append("g")
      .attr("class", "x-axis-")
      .attr("transform", "translate(" +  xNeg(0)  +"," + height + ")")
      .call(xAxisPos);

  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisNeg);

  //g.append("g")
   //   .attr("class", "axis axis--y")
    //  .attr("transform", "translate(" + x(0) + ",0)")
     // .call(yAxis)

// add tickNegative
var tickNeg = svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + xNeg(0) + ",0)")
    .call(d3.axisLeft(y))
    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .selectAll(".tick")
  .filter(function(d, i) { return data[i].value <= 0; });

// bring negative tick and axix-label to the correct space.
tickNeg.select("line")
  .attr("x2", 6)

  
tickNeg.select("text")
  .attr("x", 9)
  .style("text-anchor", "start")
  //.style("font-size", "12px")


});