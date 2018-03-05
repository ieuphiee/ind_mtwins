var arr = ["April/March", "May", "June", "July", "August", "Sept/Oct"];
var i = 0;
document.getElementById("next").addEventListener("click", nextMonth);
document.getElementById("previous").addEventListener("click", prevMonth);

function nextMonth() {
	i++; 
	if (i >= arr.length-1) {  document.getElementById("next").style.visibility = "hidden"; }
	else { document.getElementById("previous").style.visibility = "visible"; }
	document.getElementById("currMonth").innerHTML = arr[i];
	updateBar(arr[i]);
		
}

function prevMonth() {
	i--;
	if (i <= 0) { document.getElementById("previous").style.visibility = "hidden";  }
	else { document.getElementById("next").style.visibility = "visible"; }
	document.getElementById("currMonth").innerHTML = arr[i];
	updateBar(arr[i]);
		 
}