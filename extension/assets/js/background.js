chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		if (request.greeting == "hello")
			sendResponse({
				farewell: "goodbye"
			});



localStorage.setItem('myCat', 'Tom');


		console.log("request =", request);
		sendResponse({
			message: "data saved in background!",

		});


	}
);
