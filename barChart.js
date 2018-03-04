/*var margin = {top: 20, right: 20, bottom: 40, left: 150},
	width = 600 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;*/

var bar_x_scale = d3.scale.linear().rangeRound([0, width]);
var bar_y_scale =  d3.scale.ordinal().rangeRoundBands([0, height], .1, .5);

var bar_x_axis = d3.svg.axis()
	.scale(bar_x_scale)
	.orient("top");

var bar_y_axis = d3.svg.axis()
	.scale(bar_y_scale)
	.orient("left");

var colors = d3.scale.category10();

var bar_svg = d3.select("#barChart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function(error, data) {
	data = data.filter(function(d) { return d.Split === "May"; });
	data.forEach(function(d) {
		d.BA = +d.BA;
		if (error) throw error;
		
	});
	
	data.sort(function(a, b) { return b.BA - a.BA; });
	
	bar_x_scale.domain([0, d3.max(data, function(d) { return d.BA; })]);
	bar_y_scale.domain(data.map(function(d) { return d.Player; }));
	
	bar_svg.append("g")
		.attr("class", "x axis")
		//.attr("transform", "translate(0," + 0 + ")")
		.call(bar_x_axis);
	
	bar_svg.append("g")
		.attr("class", "y axis")
		//.attr("transform", "translate(0," + 0	 + ")")
		.call(bar_y_axis)
	  
	
	bar_svg.selectAll(".bar")
		.data(data)
	  .enter().append("rect")
		.attr("class", "bar")
	 	.attr("height", bar_y_scale.rangeBand())
		.attr("x", 0)
		.attr("y", function(d) { return bar_y_scale(d.Player); })
		.attr("width", function(d) { return bar_x_scale(d.BA); })
		.attr("fill", function(d, i) { return colors(i); });
	
});

function updateBar(month) {
	d3.csv("data.csv", function(error, data) {
	data = data.filter(function(d) { return d.Split === month; });
	data.forEach(function(d) {
		d.BA = +d.BA;
		if (error) throw error;
		
	});
	
	data.sort(function(a, b) { return b.BA - a.BA; });
	
	bar_x_scale.domain([0, d3.max(data, function(d) { return d.BA; })]);
	bar_y_scale.domain(data.map(function(d) { return d.Player; }));

	 var bars = bar_svg.selectAll(".bar").data(data, function(d) { return d.Player; })
	  bars.exit()
    .transition()
      .duration(700)
    .attr("y", bar_y_scale(0))
    .attr("height", height -  bar_y_scale(0))
    .style('fill-opacity', 1e-6)
    .remove();

  // data that needs DOM = enter() (a set/selection, not an event!)
	bars.enter().append("rect")
    .attr("class", "bar")
    .attr("y",  bar_y_scale(0))
    .attr("height", height - bar_y_scale(0));

  // the "UPDATE" set:
  	bars.transition().duration(700).ease("cubic")
	.attr("x", 0) // (d) is one item from the data array, x is the scale object from above
    .attr("width", function(d) { return bar_x_scale(d.BA); }) // constant, so no callback function(d) here
    .attr("y", function(d) { return bar_y_scale(d.Player); })
    .attr("height", bar_y_scale.rangeBand());

});
}

