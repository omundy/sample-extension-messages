/**
 *	Javascript for the popup
 */

// once document has loaded...
$(document).ready(function() {

	// get data on load
	chrome.runtime.sendMessage({
		sender: "popup",
		action: "getData",
	}, function(response) {
		// invoke callback with response
		displayResponse(response);
	});

	// add a click listener
	$(".incrementBtn").click(function(e) {
		// when button clicked, store value
		let val = Number($(this).val());
		// make sure val is real number > 0
		if (val < 1) return;
		// create message object
		let msg = {
			sender: "popup",
			action: "increment", // what we want the background to do
			field: "popupClicks",
			data: val
		};
		// send message to background
		chrome.runtime.sendMessage(msg, function(response) {
			// invoke callback with response
			displayResponse(response);
		});
	});

	// click listener for reset button
	$(".resetBtn").click(function(e) {
		// when button clicked, send message to background
		chrome.runtime.sendMessage({
			sender: "popup",
			action: "reset", // what we want the background to do
		}, function(response) {
			// invoke callback with response
			displayResponse(response);
		});
	});

	// click listener for fail button
	$(".failBtn").click(function(e) {
		chrome.runtime.sendMessage({
			sender: "popup",
			action: "", // oops, did we forget something?
		}, function(response) {
			displayResponse(response);
		});
	});

});
// called after response from background
function displayResponse(response) {
	// display the response object as a string
	$("#responseField").val(JSON.stringify(response, null, 2));
}
