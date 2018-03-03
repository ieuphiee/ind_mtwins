var arr = ["April/March", "May", "June", "July", "August", "Sept/Oct"];
var i = 3;
document.getElementById("next").addEventListener("click", nextMonth);
document.getElementById("previous").addEventListener("click", prevMonth);

function nextMonth() {
	if (i >= arr.length-1) { i = 0; }
	else { i++; }
	document.getElementById("currMonth").innerHTML = arr[i];
	updateBar(arr[i]);
}

function prevMonth() {
	if (i <= 0) { i = arr.length-1; }
	else { i--; }
	document.getElementById("currMonth").innerHTML = arr[i];
	updateBar(arr[i]);
}