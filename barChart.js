// Set up x and y scale for bar chart
var bar_x_scale = d3.scale.linear().rangeRound([0, width]); // Batting averages
var bar_y_scale =  d3.scale.ordinal().rangeRoundBands([0, height], .1, .5); // PLayers' names

// Set up x axis (left)
var bar_x_axis = d3.svg.axis()
	.scale(bar_x_scale)
	.orient("top")
	.ticks(6);

// Set up y axis
var bar_y_axis = d3.svg.axis()
	.scale(bar_y_scale)
	.orient("left")
	.ticks(6);

// Get color palette
var colors = d3.scale.category10();

// Append svg element to dom
var bar_svg = d3.select("#barChart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up tooltip
var tooltip2 = d3.select("#barChart")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0); 

d3.csv("data.csv", function(error, data) {
	
	data = data.filter(function(d) { return d.Split === "April/March"; }); // Page loads with April/March stats
	data.forEach(function(d) {
		d.BA = +d.BA; // Convert string to number
		if (error) throw error;
		
	});
	
	// Set up x and y domains
	bar_x_scale.domain([0, d3.max(data, function(d) { return d.BA; })]); 
	bar_y_scale.domain(data.map(function(d) { return d.Player; }));
	
	// Append x axis to svg
	bar_svg.append("g")
		.attr("class", "x axis")
		.call(bar_x_axis);
	
	// Append y axis to svg
	bar_svg.append("g")
		.attr("class", "y axis")
		.call(bar_y_axis);
	
	// Draw bars
	bar_svg.selectAll(".bar")
		.data(data)
	  .enter().append("rect")
		.attr("class", "bar")
	 	.attr("height", bar_y_scale.rangeBand())
		.attr("x", 0)
		.attr("y", function(d) { return bar_y_scale(d.Player); })
		.attr("width", function(d) { return bar_x_scale(d.BA); })
		.attr("fill", function(d, i) { return colors(i); }) // Assign random colors to bars
	  .on("mouseover", function (d) { // Display tooltips on hover
		tooltip2.transition()
			.duration(200)
			.style("opacity", 1);
		tooltip2.html("<strong>Batting Average: </strong>" + "\<font color=\"red\"\>" +d.BA)
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY) + "px"); }) 
	  .on("mouseout", function (d) {
		tooltip2.transition()
			.duration(300)
			.style("opacity", 0); });
	
});

/*******************************************************************************/
/** This function updates the bar chart when a different month is selected **/
/*******************************************************************************/
function updateBar(month) {
	
	d3.csv("data.csv", function(error, data) {
	data = data.filter(function(d) { return d.Split === month; }); // Filter out other months
	data.forEach(function(d) {
		d.BA = +d.BA;
		if (error) throw error;
		
	});
	
	// Set up x and y domains
	bar_x_scale.domain([0, d3.max(data, function(d) { return d.BA; })]);
	bar_y_scale.domain(data.map(function(d) { return d.Player; }));
	
	// Update x axis
	bar_svg.select('.x.axis')
		.transition()
		.duration(300)
		.call(bar_x_axis);
		
	// Update y axis
  	bar_svg.select(".y.axis")
		.transition()
		.duration(300)
		.call(bar_y_axis);
		
	var bars = bar_svg.selectAll(".bar")
		.data(data, function(d) { return d.Player; });
	
	// vvvv Update bars vvvvv //
		
	bars.exit()
    	.transition()
      	.duration(700)
    	.attr("y", bar_y_scale(0))
    	.attr("height", height -  bar_y_scale(0))
    	.style('fill-opacity', 1e-6)
    	.remove();

	bars.enter().append("rect")
    	.attr("class", "bar")
    	.attr("y",  bar_y_scale(0))
    	.attr("height", height - bar_y_scale(0));

  	bars.transition().duration(700).ease("cubic")
		.attr("x", 0) 
		.attr("width", function(d) { return bar_x_scale(d.BA); }) 
		.attr("y", function(d) { return bar_y_scale(d.Player); }) 
		.attr("height", bar_y_scale.rangeBand());

	});
}

/*******************************************************************************/
/************* Event listeners for previous and next buttons *******************/
/*******************************************************************************/

var arr = ["April/March", "May", "June", "July", "August", "Sept/Oct"]; // Contains only months in the given dataset
var i = 0; // Index for arr
// Add event listeners
document.getElementById("next").addEventListener("click", nextMonth);
document.getElementById("previous").addEventListener("click", prevMonth);

function nextMonth() {
	i++; // Increment index to point to next month in array
	if (i >= arr.length-1) {  document.getElementById("next").style.visibility = "hidden"; } // If at last element of the array, do not allow user to loop around
	else { document.getElementById("previous").style.visibility = "visible"; } 
	
	document.getElementById("monthSelector").innerHTML = arr[i]; // Change text in dom to show next month
	updateBar(arr[i]); // Update bar graph with next month's info
		
}

function prevMonth() {
	i--; // Decrement index to point to previous month in array
	if (i <= 0) { document.getElementById("previous").style.visibility = "hidden";  } 
	else { document.getElementById("next").style.visibility = "visible"; }
	
	document.getElementById("monthSelector").innerHTML = arr[i]; // Change text in dom to show previous month
	updateBar(arr[i]); // Update bar graph with previous month's info
		 
}
