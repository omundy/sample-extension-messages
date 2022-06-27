/**
 *	Javascript for the content script
 */


// called after response from background
function displayResponse(response) {
	// log the response object
	console.log(response);
	setTimeout(() => {
		$('.messagesButtonOnPage').removeClass("notify");
	}, 1000);
}

function getDoctype() {
	var node = document.doctype;

	if (node) {
		return "<!DOCTYPE " +
			node.name +
			(node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') +
			(!node.publicId && node.systemId ? ' SYSTEM' : '') +
			(node.systemId ? ' "' + node.systemId + '"' : '') +
			'>';
	} else {
		return "";
	}
}




$(document).ready(function() {

	if (!getDoctype().toLowerCase().includes("html")) {
		console.log("sample-extension-messages: only run on html pages", document.doctype);
		return;
	}

	// create button string and append it to page
	let btn = "<button class='messagesButtonOnPage'>🐥</button>";
	document.body.insertAdjacentHTML('beforeEnd', btn);

	// add button listener
	document.querySelector(".messagesButtonOnPage").addEventListener('click', () => {
		// console.log(".messagesButtonOnPage clicked");

		// show a temp border around the button
		$('.messagesButtonOnPage').addClass("notify");

		// create message object
		let msg = {
			sender: "content",
			action: "increment", // what we want the background to do
			field: "pageClicks",
			data: 1
		};
		// send message to background
		chrome.runtime.sendMessage(msg, (response) => {
			// invoke callback with response
			displayResponse(response);
		});
	}, false);




	let scrollDistance = 0, // total distance scrolled
		t, // timeout function
		d = (new Date()).getTime(), // previous date().getTime
		scrolling = false; // whether or not user is scrolling

	// on scroll
	$(window).scroll(function() {
		console.log('scroll detected', scrollDistance);


		// show a temp border around the button
		$('.messagesButtonOnPage').addClass("notify");

		// increase scroll distance
		scrollDistance++;
		// get current time
		let now = (new Date()).getTime();

		if (now - d > 400 && !scrolling) {
			$(this).trigger('scrollStart');
			d = now;
		}
		clearTimeout(t);
		t = setTimeout(function() {
			if (scrolling)
				$(window).trigger('scrollEnd');
		}, 300);
	});
	// trigger for scroll start
	$(window).bind('scrollStart', function() {
		// console.log('scrollStart');
		scrolling = true;
	});
	// trigger for scroll end
	$(window).bind('scrollEnd', function() {
		// console.log('scrollEnd');
		scrolling = false;
		// save
		// create message object
		let msg = {
			sender: "content",
			action: "increment", // what we want the background to do
			field: "contentScrolled",
			data: scrollDistance
		};
		// send message to background
		chrome.runtime.sendMessage(msg, function(response) {
			// reset scrollDistance after response
			scrollDistance = 0;
			// invoke callback with response
			displayResponse(response);
		});
	});
});
