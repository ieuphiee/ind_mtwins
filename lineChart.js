// Set up dimensions and margins of the svg 
var margin = {top: 20, right: 20, bottom: 60, left: 150},
	width = 600 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

// Set up x and y scale for line chart
var line_x_scale = d3.scale.ordinal().rangePoints([0, width], 1); 
var line_y_scale = d3.scale.linear().rangeRound([height, 0]);

// Set up x-axis (bottom)
var line_x_axis = d3.svg.axis()
	.scale(line_x_scale)
	.orient("bottom");

// Set up y-axis (left)
var line_y_axis = d3.svg.axis()
	.scale(line_y_scale)
	.orient("left");

// Set up x and y coordinates of the line
var line = d3.svg.line()
	.x(function(d) { return line_x_scale(d.Split);})
	.y(function(d) { return line_y_scale(d.BA)});

// Set up tooltip
var tooltip = d3.select("#lineChart")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0); 

// Append svg element to dom
var line_svg = d3.select("#lineChart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data.csv", function(error, data) {
	
	data = data.filter(function(d) { return d.Player === "Joe Mauer"; }); // Page loads with JM's profile
	data.forEach(function(d) {
		d.BA = +d.BA; // Convert string to number
		if (error) throw error;
	});
	
	// Set up x and y domains
	line_x_scale.domain(data.map(function(d) { return d.Split; }));
	line_y_scale.domain([0, d3.max(data, function(d) { return d.BA; })]);
	
	// Append x axis to svg
	line_svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(line_x_axis);
	
	// Append title (player's name) to svg
	line_svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", height + margin.top) 
		.attr("dy", 30)
        .attr("text-anchor", "middle")
		.style("font-size", "11pt")
		.style("font-weight", "bold")
		.attr("class", "player")
        .text("Joe Mauer");
	
	// Append y axis to svg
	line_svg.append("g")
		.attr("class", "y axis")
		.call(line_y_axis)
	  .append("text") // Also append y-axis label
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left/2.5)
		.attr("x", 0 - height/2)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("fill", "black")
		.text("Batting Average");      
	
	// Append line to svg
	line_svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);

	// Plot points to svg
	line_svg.selectAll(".dot")
		.data(data)
	  .enter().append("circle")
		.attr("class", "dot")
		.attr("r", 4)
		.attr("cx", function(d) { return line_x_scale(d.Split); })
		.attr("cy", function(d) { return line_y_scale(d.BA); })
	  .on("mouseover", function (d) { // Display tooltips on hover
		tooltip.transition()
		 .duration(200)
		 .style("opacity", 1);
		tooltip.html("<strong>Batting Average: </strong>" + "\<font color=\"red\"\>" +d.BA)
		 .style("left", (d3.event.pageX) + "px")
		 .style("top", (d3.event.pageY) + "px"); })
	 .on("mouseout", function (d) {
		tooltip.transition()
		 .duration(300)
		 .style("opacity", 0);
		});
	
});


/*******************************************************************************/
/** This function updates the line chart when a different player is selected **/
/*******************************************************************************/
function updateLine(player) {
	
	d3.csv("data.csv", function(error, data) {
		
		data = data.filter(function(d) { return d.Player === player; }); // Filter out other players
		data.forEach(function(d) {
			d.BA = +d.BA; // Convert string to number
			if (error) throw error;
		});

		// Set up x and y domains
		line_x_scale.domain(data.map(function(d) { return d.Split; }));
		line_y_scale.domain([0, d3.max(data, function(d) { return d.BA; })]);

		var line_svg = d3.select("#lineChart").transition();

		// Update line
		line_svg.select(".line") 
			.duration(750)
			.attr("d", line(data));

		// Update x axis
		line_svg.select(".x.axis")
			.duration(750)
			.call(line_x_axis);

		// Update y axis
		line_svg.select(".y.axis")
			.duration(750)
			.call(line_y_axis);

		// Update title
		line_svg.select(".player")
			.text(player);

		// Redraw points
		d3.selectAll(".dot")
			.data(data)
			.transition()
			.duration(750)
			.attr("r", 4)
			.attr("cx", function(d) { return line_x_scale(d.Split); })
			.attr("cy", function(d) { return line_y_scale(d.BA); });

	});
}