'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
	window.addEventListener('DOMContentLoaded', function () {
		"use strict";

		// new PasswordGeneratorWidget({
		//    length: 'length of password',
		//    id: 'id of widget container element'
		// })

		var PasswordGeneratorWidget = function () {
			function PasswordGeneratorWidget(options) {
				_classCallCheck(this, PasswordGeneratorWidget);

				options = options || {};
				this.length = options.length || 16;
				this.minLength = this._defaults().minLength || 6;
				this.maxLength = this._defaults().maxLength || 256;
				this.id = options.id;
				if (!options.id) this.el = options.el || 'body';
				this.init();
			}

			_createClass(PasswordGeneratorWidget, [{
				key: 'urlparser',
				value: function urlparser(url) {
					var a = document.createElement('a');
					a.href = url;
					return {
						protocol: a.protocol,
						hostname: a.hostname,
						port: a.port,
						pathname: a.pathname,
						query: a.search,
						hash: a.hash,
						host: a.host
					};
				}
			}, {
				key: 'errorHandler',
				value: function errorHandler(msg, url, row, col, error) {
					var err = {
						message: msg,
						url: url,
						row: row,
						col: col
					};
					console.error(err);
					this.renderError(err);
					return false;
				}
			}, {
				key: 'renderError',
				value: function renderError(err) {
					var container = document.createElement('div');
					container.classList.add('password-generator__error');
					container.textContent = [this.urlparser(err.url).pathname || '', err.row || '', err.col || '', err.message || ''].join(':');
					document.body.appendChild(container);
				}
			}, {
				key: 'init',
				value: function init() {
					window.onerror = this.errorHandler.bind(this);

					this.widget = this.generateWidgetContent(this.id);

					var button = this.widget.querySelector('.password-generator__button');
					var password = this.widget.querySelector('.password-generator__password');
					var length = this.widget.querySelector('.password-generator__length');

					button.addEventListener('click', this.buttonClickHandler.bind(this));

					//shows notification after password was copied
					this.widget.addEventListener('copy', this._onCopyEventHandler.bind(this));

					password.addEventListener('mouseup', this._passwordOnmouseupHandler.bind(this));
					length.addEventListener('change', this._lenghOnChangeHandler.bind(this));

					this.widget.querySelector('.password-generator__password').value = this.generatePassword(this.length);
				}
			}, {
				key: 'generateWidgetContent',
				value: function generateWidgetContent(id) {
					var widgetContainer = document.getElementById(id);
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

					var widget = document.createElement('div');
					var password = document.createElement('input');
					var passwordContainer = document.createElement('div');
					var button = document.createElement('input');
					var lengthContainer = document.createElement('div');
					var length = document.createElement('select');
					var charsetList = document.createElement('div');

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
					this._generateLengthElement(length);
					charsetList.classList.add('password-generator__charset-list');
					this._generateCharsetListElement(charsetList);

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

			}, {
				key: '_passwordOnmouseupHandler',
				value: function _passwordOnmouseupHandler(e) {
					var elem = e.target;

					// selects password and copy it to clipboard
					// does not work on iOS devices
					elem.setSelectionRange(0, elem.value.length);
					document.execCommand('copy');
				}

				//shows "copied" notification

			}, {
				key: '_onCopyEventHandler',
				value: function _onCopyEventHandler(event) {
					if (document.getElementsByClassName('password-generator__tooltip').length) {
						return;
					}

					//element about which you want to draw a tooltip
					var elem = event.target;

					//creates notification message
					var elemCoords = elem.getBoundingClientRect();
					var popup = document.createElement('div');
					var timer = void 0;

					popup.classList.toggle('password-generator__tooltip');
					popup.appendChild(document.createTextNode('copied'));

					var passwordElem = document.querySelector('.password-generator__password');
					passwordElem.parentNode.insertBefore(popup, passwordElem.nextSibling);

					//sets a notification display timeout
					timer = setTimeout(function () {
						popup.remove();
					}, 1000);
				}
			}, {
				key: '_lenghOnChangeHandler',
				value: function _lenghOnChangeHandler(event) {
					var elem = event.target;
					this.length = parseInt(elem.value);
				}
			}, {
				key: '_defaults',
				value: function _defaults() {
					var args = Array.prototype.slice.call(arguments);
					return this.constructor._defaults.apply(this, args);
				}
			}, {
				key: '_getCharsetList',
				value: function _getCharsetList() {
					var args = Array.prototype.slice.call(arguments);
					return this.constructor._getCharsetList.apply(this, args);
				}
			}, {
				key: '_generateLengthElement',
				value: function _generateLengthElement(container) {
					for (var l = 0; l <= this.maxLength - this.minLength; l++) {
						var option = document.createElement('option');
						var val = l + this.minLength;
						option.value = val;
						option.innerHTML = val;
						if (val === this.length) {
							option.selected = true;
						}
						container.appendChild(option);
					}
				}
			}, {
				key: '_generateCharsetListElement',
				value: function _generateCharsetListElement(container) {
					var charset = this.constructor.charset();
					for (var s in charset) {
						var input = document.createElement('input');
						var label = document.createElement('label');
						input.type = "checkbox";
						input.name = s;
						input.value = s;
						input.checked = true;
						label.appendChild(input);
						label.appendChild(document.createTextNode(s));
						container.appendChild(label);
					}
				}
			}, {
				key: 'charset',
				value: function charset() {
					var args = Array.prototype.slice.call(arguments);
					return this.constructor.charset.apply(this, args);
				}
			}, {
				key: 'getASCIIalphanumeric',
				value: function getASCIIalphanumeric() {
					var args = Array.prototype.slice.call(arguments);
					return this.constructor.getASCIIalphanumeric.apply(this, args);
				}
			}, {
				key: 'generatePassword',
				value: function generatePassword() {
					var args = Array.prototype.slice.call(arguments);
					return this.constructor.generatePassword.apply(this, args);
				}
			}, {
				key: 'buttonClickHandler',
				value: function buttonClickHandler(e) {
					e.preventDefault();
					var passwordOut = this.widget.querySelector('.password-generator__password');
					passwordOut.value = this.generatePassword(this.length);
				}
			}], [{
				key: '_defaults',
				value: function _defaults() {
					return {
						length: 16,
						minLength: 6,
						maxLength: 256
					};
				}
			}, {
				key: '_getCharsetList',
				value: function _getCharsetList() {
					var list = [];
					var selector = '.password-generator__charset-list input';
					if (this.id) {
						list = document.querySelectorAll('#' + this.id + ' ' + selector);
					} else if (this.el) {
						list = this.el.querySelectorAll(selector);
					} else {
						list = list;
					}
					if (!Array.isArray(list)) {
						list = Array.prototype.filter.apply(list, [function (item) {
							return item.checked;
						}]).map(function (item) {
							return item.name;
						});
					}
					return list.slice();
				}
			}, {
				key: 'charset',
				value: function charset() {
					// A-Z 65-90
					// a-z 97-122
					// 0-9 48-57

					return {
						lowercase: Math.floor(Math.random() * (122 - 97 + 1)) + 97,
						uppercase: Math.floor(Math.random() * (90 - 65 + 1)) + 65,
						numbers: Math.floor(Math.random() * (57 - 48 + 1)) + 48
					};
				}
			}, {
				key: 'getASCIIalphanumeric',
				value: function getASCIIalphanumeric() {
					var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['numbers', 'uppercase', 'lowercase'];

					var keys = void 0;
					if (!list.length) {
						keys = Object.keys(this.charset());
					} else {
						keys = list;
					}

					return this.charset()[keys[Math.floor(Math.random() * keys.length)]];
				}
			}, {
				key: 'generatePassword',
				value: function generatePassword(len) {
					len = len || this._defaults().length;
					var password = '';
					var charsetList = this._getCharsetList();
					if (len > this._defaults().maxLength) {
						len = this._defaults().maxLength;
					}
					if (len < this._defaults().minLength) {
						len = this._defaults().minLength;
					}
					for (; len; len--) {
						password += String.fromCharCode(this.getASCIIalphanumeric(charsetList));
					}return password;
				}
			}]);

			return PasswordGeneratorWidget;
		}();

		window.PasswordGeneratorWidget = PasswordGeneratorWidget;
	});
})();