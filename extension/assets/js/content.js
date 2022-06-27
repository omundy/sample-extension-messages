/**
 *	Javascript for the content script
 */

var active = 0;

// called after response from background
function displayResponse(response) {
	// log the response object
	console.log(response);
	setTimeout(() => {
		displayActiveOff();
	}, 1000);
}

function displayActive() {
	active++;
	if (active <= 1) {
		// console.log("displayActive() active =", active);
		$('.messagesButtonOnPage').fadeTo(200, 1);
	}
}

function displayActiveOff() {
	// console.log("❌ displayActiveOff() active =", active);
	active = 0;
	$('.messagesButtonOnPage').fadeTo(400, 0.5);
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

	// create string and append it to page
	let btn = "<div class='messagesButtonOnPage'><a href='#'>🐥</a></div>";
	document.body.insertAdjacentHTML('beforeEnd', btn);

	// add listener
	document.querySelector(".messagesButtonOnPage a").addEventListener('click', (event) => {
		// console.log(".messagesButtonOnPage clicked");

		event.preventDefault();

		// show active
		displayActive();

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
		// console.log('scroll detected', scrollDistance);

		// show active
		displayActive();

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
