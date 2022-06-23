chrome.runtime.onInstalled.addListener((details) => {
	console.log("onInstalled details =", details);
	reset();
});


function reset(){
	// the object to keep all our data
	let obj = {
		contentClicks: 0,
		contentScrolled: 0,
		popupClicks: 0,
	};
	// serialize and save the json the object in localStorage
	localStorage.setItem('score', JSON.stringify(obj));
}



/**
 * 	Listen for messages from content or popup scripts, run the callback
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	// test
	console.log("request =", request);

	// get current values
	const obj = JSON.parse(localStorage.getItem('score')); // get and deserialize score obj

	// use request.action to determine what we do
	if (request.action === "increment") {

		// use request.field to determine which number to increment
		if (request.field === "contentClicks")
			obj.contentClicks += Number(request.data);
		else if (request.field === "contentScrolled")
			obj.contentScrolled += Number(request.data);
		else if (request.field === "popupClicks")
			obj.popupClicks += Number(request.data);

		// save data and send response
		localStorage.setItem('score', JSON.stringify(obj));
		// send response
		sendResponse({
			message: "success",
			action: request.action,
			data: JSON.parse(localStorage.getItem('score')) // get and deserialize updated values
		});
	}
	// if the action is to getData
	else if (request.action === "getData") {
		// send response
		sendResponse({
			message: "success",
			action: request.action,
			data: JSON.parse(localStorage.getItem('score')) // get and deserialize updated values
		});
	}
	// if the action is to reset
	else if (request.action === "reset") {
		// reset
		reset();
		// send response
		sendResponse({
			message: "success",
			action: request.action,
			data: JSON.parse(localStorage.getItem('score')) // get and deserialize updated values
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

	console.log("score =", JSON.parse(localStorage.getItem('score')));
	return true;
});
