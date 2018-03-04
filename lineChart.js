var margin = {top: 20, right: 20, bottom: 40, left: 150},
	width = 600 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

var line_x_scale = d3.scale.ordinal().rangePoints([0, width], 1);
var line_y_scale = d3.scale.linear().rangeRound([height, 0]);

var line_x_axis = d3.svg.axis()
	.scale(line_x_scale)
	.orient("bottom");

var line_y_axis = d3.svg.axis()
	.scale(line_y_scale)
	.orient("left");

var line = d3.svg.line()
	.x(function(d) { return line_x_scale(d.Split);})
	.y(function(d) { return line_y_scale(d.BA)});

var tooltip = d3.select("#lineChart")
			.append("div")
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("opacity", 0); 

var line_svg = d3.select("#lineChart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data.csv", function(error, data) {
	data = data.filter(function(d) {return d.Player === "Joe Mauer";});
	data.forEach(function(d) {
		d.BA = +d.BA;
		if (error) throw error;
	});

	line_x_scale.domain(data.map(function(d) { return d.Split; }));
	line_y_scale.domain([0, d3.max(data, function(d) { return d.BA; })]);

	line_svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(line_x_axis);

	line_svg.append("g")
		.attr("class", "y axis")
		.style("fill", "white")
		.call(line_y_axis)
	  .append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -6)
		.attr("dy", "1.2em")
		.attr("text-anchor", "end")
		.text("Batting Average");
		
	

	line_svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);

	line_svg.selectAll(".dot")
		.data(data)
	  .enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return line_x_scale(d.Split); })
		.attr("cy", function(d) { return line_y_scale(d.BA); })
	.on("mouseover", function (d) {
		tooltip.transition()
			.duration(200)
			.style("opacity", 1);
		tooltip.html("Batting Average: " + d.BA)
			//.style("font-size", "80%")
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY) + "px");
		}) 
	.on("mouseout", function (d) {
		tooltip.transition()
			.duration(300)
			.style("opacity", 0);
		});


});


function updateLine(player) {
	d3.csv("data.csv", function(error, data) {
	data = data.filter(function(d) {return d.Player === player;});
	data.forEach(function(d) {
		d.BA = +d.BA;
		if (error) throw error;
	});

	line_x_scale.domain(data.map(function(d) { return d.Split; }));
	line_y_scale.domain([0, d3.max(data, function(d) { return d.BA; })]);
	
	var line_svg = d3.select("#lineChart").transition();
	
	line_svg.select(".line") 
		.duration(750)
		.attr("d", line(data));
	
	line_svg.select(".x.axis")
		.duration(750)
		.call(line_x_axis);
	
	line_svg.select(".y.axis")
		.duration(750)
		.call(line_y_axis);
		
	d3.selectAll(".dot")
		.data(data)
		.transition()
		.duration(750)
		.attr("r", 3.5)
		.attr("cx", function(d) { return line_x_scale(d.Split); })
		.attr("cy", function(d) { return line_y_scale(d.BA); });
		
	
	
});
}