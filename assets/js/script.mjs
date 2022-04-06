// Convert decimal Unix epoch to base64
function epochToBase64() {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	let time = Math.floor((Date.now() / 1000)).toString();
	let output = '';

	// Encode as base64
	let i = 0;
	do {
		let chr1 = time.charCodeAt(i++);
		let chr2 = time.charCodeAt(i++);
		let chr3 = time.charCodeAt(i++);

		let enc1 = chr1 >> 2;
		let enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		let enc4 = chr3 & 63;

		if (isNaN(chr2))
			enc3 = enc4 = 64;
		else if (isNaN(chr3))
			enc4 = 64;
		
		// Add chars to result
		output += alphabet.charAt(enc1)
			+ alphabet.charAt(enc2)
			+ alphabet.charAt(enc3)
			+ alphabet.charAt(enc4);

	} while (i < time.length);

	return output;
}

// Set output element value with base64 encoded Unix epoch
function generateTempMail() {
	const target = document.getElementById("email");
	let domain = document.getElementById("domain");

	// Default to victorwesterlund.com
	domain = domain.value ? domain.value : "victorwesterlund.com";

	target.value = `${epochToBase64()}@${domain}`;
}

// Bind new temp mail button
document.getElementById("tempmail").addEventListener("submit", event => {
	event.preventDefault();
	generateTempMail();
});

// Select all text on focus of output element
document.getElementById("email").addEventListener("focus", event => event.target.select());

// Bind copy button
document.getElementById("copy").addEventListener("click", event => {
	const target = document.getElementById("email");

	// Focus output element if Clipboard API is unavailable
	if (navigator.hasOwnProperty("clipboard")) {
		return target.focus();
	}

	// Attempt to copy to clipboard or focus output elemet if failed
	navigator.clipboard.writeText(target.value)
	.then(() => {
		const cache = event.target.innerText;
		event.target.innerText = "Copied!";

		setTimeout(() => event.target.innerText = cache, 1500);
	})
	.catch(() => target.focus());
});

generateTempMail();