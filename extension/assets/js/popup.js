/**
 *	Javascript for the popup
 */

// once document is loaded...
$(document).ready(function() {

	// add a click listener
	$(".increaseClicksBtn").click(function(e) {
		// store button value
		let val = Number($(this).val());
		// make sure val is real
		if (val < 1) return;
		// send update to background
		sendMessageToBackground(val);
	});
});

function sendMessageToBackground(val) {
	// make sure val received
	if (!val) return;
	// create message object
	let msg = {
		message: "btn clicked in popup",
		sender: "popup",
		value: val
	};
	// send message to background
	chrome.runtime.sendMessage(msg, function(response) {
		// callback with response
		confirmResponse(response);
	});
}

function confirmResponse(response) {
	// display the response object as a string
	$("#responseField").val(JSON.stringify(response));
}
