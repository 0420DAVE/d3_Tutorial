
// Data are organized in following format (in csv)
/*//
date contextWord1 contextWord2 contextWord3 contextWord4....

No index column is allowed

variable cities defined below reconstruct the data for d3 to plot the graph easier. 


/*/
var margin = {top: 20, right: 10, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom

var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



//var parseTime = d3.timeParse("%y"); parseTime  = d3.timeParse("%Y%m%d"); 

var x = d3.scaleLinear().range([20, width-100]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });


d3.csv("data/co_occurence.csv", type,function(error, data) {

  // data are organized following column sequence: year, contextWord1, contextWord2......
  // var.slice(1,4) select iterm 2,3,4. var.slice(1) delete the first item (delete 'date' from column name). 
  // .map apply function to every item in the object, which is column names except 'date'
  var cities = data.columns.slice(1).map(function(id) { 
    return {
      id: id, 
      values: data.map(function(d) { return {date: d.date, value: d[id]} }) // id here refers to column names other than date
  };
  });

   //console.log(data.columns)
   //console.log(data.columns.length)

   

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    //-->  to understand following to lines, you need to know the data srtucture of cities
    // I don't fully understand the code
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.value; }); }) 
  ]);
  //console.log(cities[1].values);
  //console.log(cities[1].values[200].value);


  z.domain(cities.map(function(c) { return c.id; }));


  svg.append("g")
      .attr("class", "x axis") // use this to replace 'x axis' if you want axis line to disappear: axis axis--y 
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append('text')
      .text("Year")
      .style("font-size", "14px")
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .attr("x",width-80) 

  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y)
      .tickFormat(d3.format(".1e")))
    .append("text")
      .attr("transform", "rotate(-90)")
      .style("font-size", "14px")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Co-occurence frequency");

  var city = svg.selectAll(".city")
    .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });

  city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "15px sans-serif")
      .text(function(d) { return d.id; });
});

function type(d, _, columns) {
  //d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}