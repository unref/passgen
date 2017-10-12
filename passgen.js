;(function(){
"use strict";

/*
	Name: passgen.
	Author: nixso.
	Description: Password generator.

	License: GNU GPLv3.
*/

/**
 * start global variables desriptions section 
*/

var defaultPasswordLength = 16;

var charsetString = "";

var charset = {
	"alpha-upper": {
		value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		checked: true },
	"alpha-low": { 
		value: "abcdefghijklmnopqrstuvwxyz",
		checked: true },
	"numbers": {
		value: "0123456789",
		checked: true }
};
/**
 * end global variables desriptions section 
*/


/**
 * start funstions desription section 
*/


//reset charset for set of items
var resetCharset = function(charset){
	for(var set in charset){
		charset[set].checked = true;
	};
};

//reset form to default values
var resetForm = function(form){
	for(var k = 0, lenOfForm = form.length; k < lenOfForm; k++) { 
		if(form[k].type === "checkbox" && !form[k].checked) {
			form[k].checked = true;
		}
	}
};

//get charset string for items that checked
var getCharsetString = function(charset){
	var res = "";
	for(var set in charset){
		if(charset[set].checked){
			res += charset[set].value;
		}
	};
	return res;
};

//generate password function
var generatePassword = function(string, length) {
	var result = "";
	for(var i = 0; i < length; i++) { 
		result += string.charAt(Math.floor(Math.random() * (string.length - 1)));
	}
	return result;
}

// checks whether the correct number of checkboxes set
var checkForm = function(elem, form, charset){
	var countSelectedCheckboxes = 0; 

	// counts number checked checkboxes
	for(var k = 0, lenOfForm = form.length; k < lenOfForm; k++) { 
		if(form[k].type === "checkbox" && form[k].checked){ 
			countSelectedCheckboxes += 1;
		}
	}

	// at least one checkbox should be checked
	if( countSelectedCheckboxes >= 1 ){
		charset[elem.id].checked = !charset[elem.id].checked;
	} else {
		elem.checked = !elem.checked;
	}
};

//shows "copied" notification
var showNotification = function(elem){
	if(document.getElementsByClassName( 'note-copied' ).length === 0){

		//creates notification message
		var elemCoords = elem.getBoundingClientRect();
		var popup = document.createElement('div');
		var timer;

		popup.classList.toggle( 'note-copied' );
		popup.appendChild( document.createTextNode( 'Copied' ) );

		//adds popup before changing position
		//because of popup have not coordinates before
		//it appended to document
		document.body.appendChild(popup);

		//sets notification coordinates
		popup.style.left = elemCoords.right
			- Math.floor( ( 1 + 1 / 10 ) * popup.offsetWidth ) 
			+ 'px';
		popup.style.top = elemCoords.top
			+ elem.offsetHeight / 2 
			- popup.offsetHeight / 2 
			+ 'px';

		//sets a notification display timeout
		timer = setTimeout(function(){
			document.body.removeChild(popup);
		}, 1000);

	}
};

//function to showing some debug messages
var showSomeDebugMessages = function(){

	//stores event's names
	var eventsToHandle = ['checking', 
						'noupdate', 
						'downloading', 
						'cached', 
						'updateready', 
						'obsolete', 
						'error'];

	//shows debugs messages for application cache
	eventsToHandle.forEach(function(key){
		window.applicationCache.addEventListener(key, function(event) {
			console.log(event.type);
		}, false);
	});
};
/**
 * end funstions desriptions section 
*/


/**
 * start describtion main loop
*/
var main = function(){
	window.addEventListener("load", function(){

		//shows notification after password was copied
		document.addEventListener('copy', function(e){
			var elem = e.target;
			showNotification(elem);
		});

		//handles click event on textarea field
		//contains generated password
		document.addEventListener('mouseup', function(e){

			var elem = e.target;

			//copies password to clipboard 
			if(elem.name === "output"){

				// selects password and copy it to clipboard
				// does not work on iOS devices
				elem.setSelectionRange(0, elem.value.length);
				document.execCommand('copy');
			}
		});

		// binds event handlers to click event 
		// on button "generate" and "reset" to
		// generate password and reset form
		document.addEventListener("click", function(e){

			var form = document.forms['passgen-form'];
			var elem = e.target;


			//generate password
			if(elem.type === "button" && elem.name === "generate-button") {

				var minLenPass = 6;
				var maxLenPass = 256;
				var tmpLenPass = +elem.form["pass-length"].value || defaultPasswordLength;

				//sets password length min and max
				if(tmpLenPass > maxLenPass || tmpLenPass < minLenPass){
					if(tmpLenPass < minLenPass) { tmpLenPass = minLenPass; }
					else { tmpLenPass = maxLenPass; }
				}

				charsetString = getCharsetString(charset);
				form["output"].value = generatePassword(charsetString, tmpLenPass);

				form["pass-length"].value = tmpLenPass;
			}

			//reset settings to default
			if(elem.type === "button" && elem.name === "reset-button") {
				resetCharset(charset);
				form["pass-length"].value = defaultPasswordLength;
				resetForm(form);
			}

			//processing of selected character sets
			if(elem.type === "checkbox") {
				checkForm(elem, form, charset);
			}

		}, false);

		// initiates generation's password at document loading
		document.forms["passgen-form"]["generate-button"].click();



		// assigns hadler to checks cache state
		// if there new data, updates up to date it.
		// btw applicationCache deprecated
		window.applicationCache.addEventListener('updateready', function(event) {
			window.applicationCache.swapCache();
		}, false);

		// shows some debugging info
		showSomeDebugMessages();

	});
}
/**
 * end describtion main loop
*/


//invokes main loop
main();

})();

