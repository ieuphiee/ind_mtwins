var margin = {top: 20, right: 20, bottom: 40, left: 50},
	width = 600 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1);
var y = d3.scale.linear().rangeRound([height, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var line = d3.svg.line()
	.x(function(d) { return x(d.Split);})
	.y(function(d) {return y(d.BA)})

var tooltip = d3.select("#lineChart")
			.append("div")
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("opacity", 0); 

var svg = d3.select("#lineChart").append("svg")
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

	x.domain(data.map(function(d) { return d.Split; }));
	y.domain([0, d3.max(data, function(d) { return d.BA; })]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	  .append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -6)
		.attr("dy", "1.2em")
		.attr("text-anchor", "end")
		.text("Batting Average");

	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);

	svg.selectAll(".dot")
		.data(data)
	  .enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.Split); })
		.attr("cy", function(d) { return y(d.BA); })
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

	x.domain(data.map(function(d) { return d.Split; }));
	y.domain([0, d3.max(data, function(d) { return d.BA; })]);
	
	
	var svg = d3.select("#lineChart").transition();
	
	svg.select(".line") 
		.duration(750)
		.attr("d", line(data));
	
	svg.select(".x.axis")
		.duration(750)
		.call(xAxis);
	
	svg.select(".y.axis")
		.duration(750)
		.call(yAxis);
		
	d3.selectAll(".dot")
		.data(data)
		.transition()
		.duration(750)
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.Split); })
		.attr("cy", function(d) { return y(d.BA); });
		
	
	
});
}