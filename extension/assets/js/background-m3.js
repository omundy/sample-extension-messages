const welcome = `
===================================================
============ sample-extension-messages ============
===================================================
`;

let defaultObj = {
		pageClicks: 0,
		contentScrolled: 0,
		popupClicks: 0
	},
	storageKey = "extensionData";



// Service Workers are terminated when not in use, and restarted when needed.
// Thus, we must register all listeners immediately (in the global scope) to access them later.
// https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/

chrome.runtime.onInstalled.addListener((details) => {
	console.log(welcome);
	// console.log("onInstalled() => details =", JSON.stringify(details));
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("onMessage() => request =", JSON.stringify(request));

	// determine which action to take
	if (request.action === "getData") {
		// get, return data
		getData(request).then(sendResponse)
			.catch(sendResponse);
	} else if (request.action === "reset") {
		// reset, return data
		chrome.storage.local.set({
			[storageKey]: defaultObj
		}, () => {
			getData(request).then(sendResponse)
				.catch(sendResponse);
		});
	} else if (request.action === "increment") {
		// save, then return data
		setData(request).then(sendResponse)
			.catch(sendResponse);
	} else if (request.action === "delete") {
		// delete, then send empty data
		deleteAllFromLocalStorage();
		sendResponse({});
	} else if (request.action === "all") {
		// return all stored data
		chrome.storage.local.get(null, result => {
			sendResponse(result);
		});
	}

	return true; // required to be able to send an async response
});


/**
 *	Get extension data, substituting default schema if needed
 */
async function getData(req) {
	try {
		// attempt to get data
		let result = await getStorageData(storageKey);
		// console.log("getData() [1] => result", JSON.stringify(result));
		// if empty assign default object
		if (!result)
			result = defaultObj;
		else if (Object.keys(result).length === 0)
			Object.assign(result, defaultObj);
		// console.log("getData() [2] => result", JSON.stringify(result));
		return result;
	} catch (err) {
		// log warning and return default
		console.warn(err);
		return defaultObj;
	}
}
async function setData(req) {
	try {
		// console.log("setData() [1] => req", JSON.stringify(req));
		let result = await getData(storageKey);
		// increment using request.field
		result[req.field] += Number(req.data);
		// console.log("setData() [2] => result", JSON.stringify(result));

		// set data
		await setStorageData(storageKey, result);
		// get updated data
		return await getData(storageKey);
	} catch (err) {
		// return default
		return defaultObj;
	}
}




// ===================================================
// ==================== FUNCTIONS ====================
// ===================================================


/**
 *	Get / Set data by key from chrome.storage.local
 *	credit: https://stackoverflow.com/a/54261558/441878
 */
const getStorageData = key =>
	new Promise((resolve, reject) =>
		chrome.storage.local.get([key], result => {
			// console.log("getStorageData() [1] result =", JSON.stringify(result));
			if (chrome.runtime.lastError)
				reject(Error(chrome.runtime.lastError.message));
			else resolve(result[key]);
		})
	);
const setStorageData = (key, data) =>
	new Promise((resolve, reject) =>
		chrome.storage.local.set({
			[key]: data
		}, () => {
			// console.log("setStorageData() [1] key, data =", key, JSON.stringify(data));
			if (chrome.runtime.lastError)
				reject(Error(chrome.runtime.lastError.message));
			else resolve();
		})
	);






// ===================================================
// ============ CHROME.STORAGE EXAMPLES ==============
// ===================================================
// https://dev.to/paulasantamaria/chrome-extensions-local-storage-1b34
// https://dev.to/milandhar/chrome-local-storage-in-extensions-4k9m
// https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea

/**
 *	Log everything this extension has stored
 *	Paste into DevTools console in service worker for this extension:
 *	chrome.storage.local.get(console.log)
 */
function logAllLocalStorage() {
	// using null gets everything from chrome.storage.local or .sync
	chrome.storage.local.get(null, function(data) {
		console.log("logAllLocalStorage()", data);
	});
}
/* Remove data from chrome.storage by {key} */
function deleteFromLocalStorage(key) {
	chrome.storage.local.remove(key, function() {
		console.log(`deleteFromLocalStorage(${key})`);
	});
}
/* Remove ALL data from chrome.storage */
function deleteAllFromLocalStorage() {
	chrome.storage.local.clear(function() {
		console.log(`deleteAllFromLocalStorage()`);
		var error = chrome.runtime.lastError;
		if (error) console.error(error);
	});
}


// ===================================================
// ================= OTHER METHODS ===================
// ===================================================
// https://web.dev/storage-for-the-web/
// https://css-tricks.com/a-primer-on-the-different-types-of-browser-storage/

let example = {
	greeting: "Hello world!"
};


// BROWSER.STORAGE
// - method for using chrome.storage in FF
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities
// https://stackoverflow.com/questions/48024801/cross-browser-extension-storage-chrome-storage-or-browser-storage-or
// https://github.com/mozilla/webextension-polyfill


// LOCALSTORAGE
// - synchronous, works with all browsers
// - NOT available for browser extension using Manifest 3 (or any service workers)
// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
// set and get
// localStorage.setItem('test', example);
// console.log("localStorage", localStorage.getItem('test'));
