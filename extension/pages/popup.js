/**
 *	Javascript for the popup
 */

// when the popup loads...
$(document).ready(function() {

	// get data on load
	chrome.runtime.sendMessage({
		sender: "popup",
		action: "getData",
	}, function(response) {
		// alert(response);
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
			// show response
			displayResponse(response);
		});
	});

	// more click listeners
	$(".getBtn").click(function(e) {
		chrome.runtime.sendMessage({
			sender: "popup",
			action: "getData",
		}, displayResponse);
	});
	$(".resetBtn").click(function(e) {
		chrome.runtime.sendMessage({
			sender: "popup",
			action: "reset",
		}, displayResponse);
	});
	$(".deleteBtn").click(function(e) {
		chrome.runtime.sendMessage({
			sender: "popup",
			action: "delete",
		}, displayResponse);
	});
	$(".allDataBtn").click(function(e) {
		chrome.runtime.sendMessage({
			sender: "popup",
			action: "all",
		}, displayResponse);
	});

});
// called after response from background
function displayResponse(response) {
	// display the response object as a string
	$("#responseField").val(JSON.stringify(response, null, 2));
}
