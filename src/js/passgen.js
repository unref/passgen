; (function () {
	"use strict";

	class PasswordGeneratorCore {
			static presets = {
				length: 16,
				minLength: 6,
				maxLength: 256,
				charTypes: ['numbers', 'uppercase', 'lowercase', 'special'],
				charset: {
					'numbers': '1234567890',
					'uppercase': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
					'lowercase': 'abcdefghijklmnopqrstuvwxyz',
					'special': '!#$%&()*+,-./:;<=>?@[]^_{|}~'
				}
			}

			static getRandomChar(selectedCharTypes) {
				const types = selectedCharTypes && selectedCharTypes.length && selectedCharTypes || this.presets.charTypes;
				const randomCharType = types[Math.floor(Math.random() * types.length)];
				const charsetByType = this.presets.charset[randomCharType];
				const randomChar = charsetByType[Math.floor(Math.random() * charsetByType.length)];
				return randomChar;
			}

			static generatePassword (len, selectedCharTypes) {
				len = len || this.presets.length;
				if (len > this.presets.maxLength) { len = this.presets.maxLength; }
				if (len < this.presets.minLength) { len = this.presets.minLength; }
				return Array.from(Array(len), () => this.getRandomChar(selectedCharTypes)).join('');
			}
	}


	// new PasswordGeneratorWidget({
	//    length: 'length of password',
	//    id: 'id of widget container element'
	// })


	class PasswordGeneratorWidget {
		constructor(options){
			options = options || {};
			this.length = options.length || 16;
			this.core = PasswordGeneratorCore;
			this.minLength = this.core.presets.minLength || 6;
			this.maxLength = this.core.presets.maxLength || 256;
			this.id = options.id;
			if (!options.id) this.el = options.el || 'body';
			this.init();
		}

		init () {
			this.widget = this.generateWidgetContent(this.id);

			let button = this.widget.querySelector('.password-generator__button');
			let password = this.widget.querySelector('.password-generator__password');
			let length = this.widget.querySelector('.password-generator__length');

			button.addEventListener('click', this.buttonClickHandler.bind(this));

			//shows notification after password was copied
			this.widget.addEventListener('copy', this.onCopyEventHandler.bind(this));

			password.addEventListener('mouseup', this.passwordOnmouseupHandler.bind(this));
			length.addEventListener('change', this.lenghOnChangeHandler.bind(this));

			this.widget
				.querySelector('.password-generator__password')
				.value = this.core.generatePassword(this.length);
		}

		generateWidgetContent (id) {
			let widgetContainer = document.getElementById(id);
			if (!id && this.el) widgetContainer = document.querySelector(this.el);

			// <div class="password-generator">
			//   <input type="text" class="password-generator__password">password</input>
			//   <input class="password-generator__button" type="button" value="generate">
			//   <div class="password-generator__tools">
			//     <div class="password-generator__length-container">
			//       <select class="password-generator__length">
			//         <option value="6">6</option>
			//         <!-- ... -->
			//         <option value="16" selected>16</option>
			//         <!-- ... -->
			//         <option value="256">256</option>
			//       </select>
			//     </div>
			//     <div class="password-generator__charset-list">
			//       <label>
			//         <input type="checkbox" name="uppercase" value="uppercase">
			//         uppercase
			//       </label>
			//       <label>
			//         <input type="checkbox" name="lowercase" value="lowercase">
			//         lowercase
			//       </label>
			//       <label>
			//         <input type="checkbox" name="numbers" value="numbers">
			//         numbers
			//       </label>
			//     </div>
			//   </div>
			// </div>

			let widget = document.createElement('div');
			let password = document.createElement('input');
			let passwordContainer = document.createElement('div');
			let button = document.createElement('input');
			let lengthContainer = document.createElement('div');
			let length = document.createElement('select');
			let charsetList = document.createElement('div');

			widget.classList.add('password-generator');
			widget.classList.add('clearfix');
			password.classList.add('password-generator__password');
			password.type = 'text';
			password.value = 'password';
			passwordContainer.classList.add('password-generator__password-container');
			button.type = 'button';
			button.value = 'generate';
			button.classList.add('password-generator__button');
			lengthContainer.classList.add('password-generator__length-container');
			length.classList.add('password-generator__length');
			this.generateLengthElement(length);
			charsetList.classList.add('password-generator__charset-list');
			this.generateCharsetListElement(charsetList);

			passwordContainer.appendChild(password);
			widget.appendChild(passwordContainer);
			widget.appendChild(button);
			lengthContainer.appendChild(length);
			widget.appendChild(lengthContainer);
			widgetContainer.appendChild(widget);
			widget.appendChild(charsetList);

			return widget;
		}

		//copies password to clipboard
		passwordOnmouseupHandler(e) {
			let elem = e.target;

			// selects password and copy it to clipboard
			// does not work on iOS devices
			elem.setSelectionRange(0, elem.value.length);
			document.execCommand('copy');
		}

		//shows "copied" notification
		onCopyEventHandler (event) {
			if (document.getElementsByClassName('password-generator__tooltip').length) { return; }

			//element about which you want to draw a tooltip
			let elem = event.target;

			//creates notification message
			let elemCoords = elem.getBoundingClientRect();
			let popup = document.createElement('div');
			let timer;

			popup.classList.toggle('password-generator__tooltip');
			popup.appendChild(document.createTextNode('copied'));

			let passwordElem = document.querySelector('.password-generator__password')
			passwordElem.parentNode.insertBefore(popup, passwordElem.nextSibling)

			//sets a notification display timeout
			timer = setTimeout(function () { popup.remove(); }, 1000);

		};

		lenghOnChangeHandler(event) {
			let elem = event.target;
			this.length = parseInt(elem.value);
		}

		getCharsetList() {
			let list = [];
			let selector = '.password-generator__charset-list input';
			if (this.id) {
				list = document.querySelectorAll(`#${this.id} ${selector}`)
			} else if (this.el) {
				list = this.el.querySelectorAll(selector);
			} else {
				list = list;
			}
			if (!Array.isArray(list)) {
				list = Array.prototype
					.filter.apply(list, [function(item) { return item.checked; }])
					.map(function(item) { return item.name; });
			}
			return list.slice();
		}

		generateLengthElement(container) {
			for (let l = 0; l <= this.maxLength - this.minLength; l++) {
				let option = document.createElement('option');
				let val = l + this.minLength;
				option.value = val;
				option.innerHTML = val;
				if (val === this.length) { option.selected = true; }
				container.appendChild(option);
			}
		}

		generateCharsetListElement(container) {
			let charset = this.core.presets.charset;
			for (let s in charset){
				let input = document.createElement('input');
				let label = document.createElement('label');
				input.type = "checkbox";
				input.name = s;
				input.value = s;
				input.checked = true;
				label.appendChild(input);
				label.appendChild(document.createTextNode(s));
				container.appendChild(label);
			}
		}

		buttonClickHandler (e) {
			e.preventDefault();
			let passwordOut = this.widget.querySelector('.password-generator__password');
			passwordOut.value = this.core.generatePassword(this.length, this.getCharsetList());
		}
	}
	window.PasswordGeneratorWidget = PasswordGeneratorWidget;

})();
