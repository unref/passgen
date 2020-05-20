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

	class PasswordGeneratorWidget {
		CSS_CLASS_NAMES = {
			BUTTON: 'password-generator__button',
			HIDE_BUTTON: 'password-generator__hide-button',
			COPY_BUTTON: 'password-generator__copy-button',
			PASSWORD: 'password-generator__password',
			PASSWORD_CONTAINER: 'password-generator__password-container',
			LENGTH: 'password-generator__length',
			LENGTH_CONTAINER: 'password-generator__length-container',
			TOOLBAR: 'password-generator__toolbar',
			PASSWORD_GENERATOR: 'password-generator',
			CLEARFIX: 'clearfix',
			TOOLTIP: 'password-generator__tooltip',
			CHARSET_LIST: 'password-generator__charset-list',
		};

		SELECTORS = {
			CONTAINER: '#password-generator',
		};

		elements = {};

		CONSTANTS = {DELAY: 1000};

		MESSAGES = {
			PASSWORD_COPIED: 'copied',
			HIDE: 'hide',
			SHOW: 'show',
		};

		constructor(options){
			options = options || {};
			this.core = PasswordGeneratorCore;
			this.createElement = createElement;
			this.length = options.length || this.core.presets.length;
			this.minLength = this.core.presets.minLength;
			this.maxLength = this.core.presets.maxLength;
			this.container = document.querySelector(options.selector || this.SELECTORS.CONTAINER);
			this.charset = options.charset || this.core.presets.charset;
			this.widget = this.generateWidgetContent(this.container);
			this.assignListeners();
			this.elements.password.value = this.core.generatePassword(this.length);
		}

		assignListeners() {
			this.elements.button.addEventListener('click', this.buttonClickHandler.bind(this));
			//shows notification after password was copied
			this.widget.addEventListener('copy', this.onCopyEventHandler.bind(this));
			this.elements.password.addEventListener('mouseup', this.passwordOnMouseUpHandler.bind(this));
			this.elements.length.addEventListener('change', this.lenghOnChangeHandler.bind(this));
		}

		generateWidgetContent(widgetContainer) {
			// const widgetContainer = document.querySelector(id);
			const password = this.createElement('input', {className: this.CSS_CLASS_NAMES.PASSWORD, type: 'text', value: 'password'});
			this.elements.password = password;
			const passwordContainer = this.createElement('div', {className: this.CSS_CLASS_NAMES.PASSWORD_CONTAINER}, [password]);
			const generateButton = this.createElement('input', {className: this.CSS_CLASS_NAMES.BUTTON, type: 'button', value: 'generate'});
			this.elements.button = generateButton;
			const toolbarContainer = this.createElement('div', {className: this.CSS_CLASS_NAMES.TOOLBAR}, [generateButton]);
			const length = this.generateLengthElement();
			const lengthContainer = this.createElement('div', {className: this.CSS_CLASS_NAMES.LENGTH_CONTAINER}, [length]);
			this.elements.length = length;
			const charsetList = this.generateCharsetListElement();
			this.elements.charsetList = charsetList;
			const widget = this.createElement('div', {className: `${this.CSS_CLASS_NAMES.PASSWORD_GENERATOR} ${this.CSS_CLASS_NAMES.CLEARFIX}`},
				[passwordContainer, toolbarContainer, lengthContainer, charsetList]);
			widgetContainer.appendChild(widget);
			return widget;
		}

		//copies password to clipboard
		passwordOnMouseUpHandler(e) {
			const elem = e.target;

			// selects password and copy it to clipboard
			// does not work on iOS devices
			elem.setSelectionRange(0, elem.value.length);
			document.execCommand('copy');
		}

		//shows "copied" notification
		onCopyEventHandler (event) {
			if (this.elements.tooltip) { return; }

			//creates notification message
			const tooltip = this.createElement('div', {className: this.CSS_CLASS_NAMES.TOOLTIP}, [this.MESSAGES.PASSWORD_COPIED]);
			this.elements.tooltip = tooltip;
			const passwordElem = this.elements.password;
			passwordElem.parentNode.insertBefore(tooltip, passwordElem.nextSibling)

			//sets a notification display timeout
			setTimeout(() => { tooltip.remove(); this.elements.tooltip = null; }, this.CONSTANTS.DELAY);
		};

		lenghOnChangeHandler(event) {
			const elem = event.target;
			this.length = parseInt(elem.value);
		}

		getCharsetList() {
			let list = this.elements.charsetList.items.slice() || [];
			list = list.filter(item => item.checked).map(item => item.name);
			return list;
		}

		generateLengthElement() {
			const container = this.createElement('select', {className: this.CSS_CLASS_NAMES.LENGTH});

			for (let l = 0; l <= this.maxLength - this.minLength; l++) {
				const value = l + this.minLength;
				const option = this.createElement('option', {value: value, innerHTML: value, selected: value === this.length ? true : false});
				container.appendChild(option);
			}

			return container;
		}

		generateCharsetListElement() {
			const container = this.createElement('div', {className: this.CSS_CLASS_NAMES.CHARSET_LIST, items: []});
			const charset = this.charset;

			for (let str in charset){
				const input = this.createElement('input', {type: 'checkbox', name: str, value: str, checked: true});
				const label = this.createElement('label', {}, [input, str]);
				container.items.push(input);
				container.appendChild(label);
			}

			return container;
		}

		buttonClickHandler (e) {
			e.preventDefault();
			this.elements.password.value = this.core.generatePassword(this.length, this.getCharsetList());
		}
	}

	window.PasswordGeneratorWidget = PasswordGeneratorWidget;
})();
