// listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener(
	// callback
	function(request, sender, sendResponse) {

		// test
		console.log("request =", request);

		// get current value of clicks
		const clicks = localStorage.getItem('clicks');

		// if the request action tells us to increment
		if (request.action === "increment") {
			// increment and save
			localStorage.setItem('clicks',  Number(clicks) +  Number(request.data));
			// send response to content or popup
			sendResponse({
				message: "success",
				action: request.action,
				// get updated value
				data: localStorage.getItem('clicks')
			});
		}
		// else the action is to reset
		else if (request.action === "reset") {
			// reset
			localStorage.setItem('clicks', 0);
			// send response to content or popup
			sendResponse({
				message: "success",
				action: request.action,
				data: localStorage.getItem('clicks') // get latest state
			});
		}
		// in case we forgot something in the code
		else {
			// send response
			sendResponse({
				message: "fail",
				action: request.action
			});
		}


	}
);
