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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3Bhc3NnZW4uanMiXSwibmFtZXMiOlsid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIlBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0Iiwib3B0aW9ucyIsImxlbmd0aCIsIm1pbkxlbmd0aCIsIl9kZWZhdWx0cyIsIm1heExlbmd0aCIsImlkIiwiZWwiLCJpbml0IiwidXJsIiwiYSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImhyZWYiLCJwcm90b2NvbCIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwicXVlcnkiLCJzZWFyY2giLCJoYXNoIiwiaG9zdCIsIm1zZyIsInJvdyIsImNvbCIsImVycm9yIiwiZXJyIiwibWVzc2FnZSIsImNvbnNvbGUiLCJyZW5kZXJFcnJvciIsImNvbnRhaW5lciIsImNsYXNzTGlzdCIsImFkZCIsInRleHRDb250ZW50IiwidXJscGFyc2VyIiwiam9pbiIsImJvZHkiLCJhcHBlbmRDaGlsZCIsIm9uZXJyb3IiLCJlcnJvckhhbmRsZXIiLCJiaW5kIiwid2lkZ2V0IiwiZ2VuZXJhdGVXaWRnZXRDb250ZW50IiwiYnV0dG9uIiwicXVlcnlTZWxlY3RvciIsInBhc3N3b3JkIiwiYnV0dG9uQ2xpY2tIYW5kbGVyIiwiX29uQ29weUV2ZW50SGFuZGxlciIsIl9wYXNzd29yZE9ubW91c2V1cEhhbmRsZXIiLCJfbGVuZ2hPbkNoYW5nZUhhbmRsZXIiLCJ2YWx1ZSIsImdlbmVyYXRlUGFzc3dvcmQiLCJ3aWRnZXRDb250YWluZXIiLCJnZXRFbGVtZW50QnlJZCIsInBhc3N3b3JkQ29udGFpbmVyIiwibGVuZ3RoQ29udGFpbmVyIiwiY2hhcnNldExpc3QiLCJ0eXBlIiwiX2dlbmVyYXRlTGVuZ3RoRWxlbWVudCIsIl9nZW5lcmF0ZUNoYXJzZXRMaXN0RWxlbWVudCIsImUiLCJlbGVtIiwidGFyZ2V0Iiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJleGVjQ29tbWFuZCIsImV2ZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImVsZW1Db29yZHMiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJwb3B1cCIsInRpbWVyIiwidG9nZ2xlIiwiY3JlYXRlVGV4dE5vZGUiLCJwYXNzd29yZEVsZW0iLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwibmV4dFNpYmxpbmciLCJzZXRUaW1lb3V0IiwicmVtb3ZlIiwicGFyc2VJbnQiLCJhcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJjb25zdHJ1Y3RvciIsImFwcGx5IiwiX2dldENoYXJzZXRMaXN0IiwibCIsIm9wdGlvbiIsInZhbCIsImlubmVySFRNTCIsInNlbGVjdGVkIiwiY2hhcnNldCIsInMiLCJpbnB1dCIsImxhYmVsIiwibmFtZSIsImNoZWNrZWQiLCJnZXRBU0NJSWFscGhhbnVtZXJpYyIsInByZXZlbnREZWZhdWx0IiwicGFzc3dvcmRPdXQiLCJsaXN0Iiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaXNBcnJheSIsImZpbHRlciIsIml0ZW0iLCJtYXAiLCJsb3dlcmNhc2UiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJ1cHBlcmNhc2UiLCJudW1iZXJzIiwia2V5cyIsIk9iamVjdCIsImxlbiIsIlN0cmluZyIsImZyb21DaGFyQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsQ0FBRSxDQUFDLFlBQVk7QUFDZEEsUUFBT0MsZ0JBQVAsQ0FBd0Isa0JBQXhCLEVBQTRDLFlBQVk7QUFDdkQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBTnVELE1BUWpEQyx1QkFSaUQ7QUFTdEQsb0NBQVlDLE9BQVosRUFBb0I7QUFBQTs7QUFDbkJBLGNBQVVBLFdBQVcsRUFBckI7QUFDQSxTQUFLQyxNQUFMLEdBQWNELFFBQVFDLE1BQVIsSUFBa0IsRUFBaEM7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLEtBQUtDLFNBQUwsR0FBaUJELFNBQWpCLElBQThCLENBQS9DO0FBQ0EsU0FBS0UsU0FBTCxHQUFpQixLQUFLRCxTQUFMLEdB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RSxTQUFJYSxhQUFKO0FBQ0EsU0FBSSxDQUFDYixLQUFLckcsTUFBVixFQUFrQjtBQUFFa0gsYUFBT0MsT0FBT0QsSUFBUCxDQUFZLEtBQUt0QixPQUFMLEVBQVosQ0FBUDtBQUFxQyxNQUF6RCxNQUNLO0FBQUVzQixhQUFPYixJQUFQO0FBQWM7O0FBRXJCLFlBQU8sS0FBS1QsT0FBTCxHQUFlc0IsS0FBS0wsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCRyxLQUFLbEgsTUFBaEMsQ0FBTCxDQUFmLENBQVA7QUFDQTtBQS9RcUQ7QUFBQTtBQUFBLHFDQXNSN0JvSCxHQXRSNkIsRUFzUnhCO0FBQzdCQSxXQUFNQSxPQUFPLEtBQUtsSCxTQUFMLEdBQWlCRixNQUE5QjtBQUNBLFNBQUkyQyxXQUFXLEVBQWY7QUFDQSxTQUFJVyxjQUFjLEtBQUtnQyxlQUFMLEVBQWxCO0FBQ0EsU0FBSThCLE1BQU0sS0FBS2xILFNBQUwsR0FBaUJDLFNBQTNCLEVBQXNDO0FBQUVpSCxZQUFNLEtBQUtsSCxTQUFMLEdBQWlCQyxTQUF2QjtBQUFtQztBQUMzRSxTQUFJaUgsTUFBTSxLQUFLbEgsU0FBTCxHQUFpQkQsU0FBM0IsRUFBc0M7QUFBRW1ILFlBQU0sS0FBS2xILFNBQUwsR0FBaUJELFNBQXZCO0FBQW1DO0FBQzNFLFlBQU9tSCxHQUFQLEVBQVlBLEtBQVo7QUFBbUJ6RSxrQkFBWTBFLE9BQU9DLFlBQVAsQ0FBb0IsS0FBS3BCLG9CQUFMLENBQTBCNUMsV0FBMUIsQ0FBcEIsQ0FBWjtBQUFuQixNQUNBLE9BQU9YLFFBQVA7QUFDQTtBQTlScUQ7O0FBQUE7QUFBQTs7QUEyU3ZEL0MsU0FBT0UsdUJBQVAsR0FBaUNBLHVCQUFqQztBQUVBLEVBN1NEO0FBOFNBLENBL1NDIiwiZmlsZSI6ImpzL3Bhc3NnZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyI7IChmdW5jdGlvbiAoKSB7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0Ly8gbmV3IFBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0KHtcblx0XHQvLyAgICBsZW5ndGg6ICdsZW5ndGggb2YgcGFzc3dvcmQnLFxuXHRcdC8vICAgIGlkOiAnaWQgb2Ygd2lkZ2V0IGNvbnRhaW5lciBlbGVtZW50J1xuXHRcdC8vIH0pXG5cblx0XHRjbGFzcyBQYXNzd29yZEdlbmVyYXRvcldpZGdldCB7XG5cdFx0XHRjb25zdHJ1Y3RvcihvcHRpb25zKXtcblx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdFx0XHRcdHRoaXMubGVuZ3RoID0gb3B0aW9ucy5sZW5ndGggfHwgMTY7XG5cdFx0XHRcdHRoaXMubWluTGVuZ3RoID0gdGhpcy5fZGVmYXVsdHMoKS5taW5MZW5ndGggfHwgNjtcblx0XHRcdFx0dGhpcy5tYXhMZW5ndGggPSB0aGlzLl9kZWZhdWx0cygpLm1heExlbmd0aCB8fCAyNTY7XG5cdFx0XHRcdHRoaXMuaWQgPSBvcHRpb25zLmlkO1xuXHRcdFx0XHRpZiAoIW9wdGlvbnMuaWQpIHRoaXMuZWwgPSBvcHRpb25zLmVsIHx8ICdib2R5Jztcblx0XHRcdFx0dGhpcy5pbml0KCk7XG5cdFx0XHR9XG5cblx0XHRcdHVybHBhcnNlciAodXJsKSB7XG5cdFx0XHRcdGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0XHRhLmhyZWYgPSB1cmw7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0cHJvdG9jb2w6IGEucHJvdG9jb2wsXG5cdFx0XHRcdFx0aG9zdG5hbWU6IGEuaG9zdG5hbWUsXG5cdFx0XHRcdFx0cG9ydDogYS5wb3J0LFxuXHRcdFx0XHRcdHBhdGhuYW1lOiBhLnBhdGhuYW1lLFxuXHRcdFx0XHRcdHF1ZXJ5OiBhLnNlYXJjaCxcblx0XHRcdFx0XHRoYXNoOiBhLmhhc2gsXG5cdFx0XHRcdFx0aG9zdDogYS5ob3N0XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZXJyb3JIYW5kbGVyIChtc2csIHVybCwgcm93LCBjb2wsIGVycm9yKSB7XG5cdFx0XHRcdGxldCBlcnIgPSB7XG5cdFx0XHRcdFx0bWVzc2FnZTogbXNnLFxuXHRcdFx0XHRcdHVybDogdXJsLFxuXHRcdFx0XHRcdHJvdzogcm93LFxuXHRcdFx0XHRcdGNvbDogY29sXG5cdFx0XHRcdH07XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdFx0dGhpcy5yZW5kZXJFcnJvcihlcnIpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHJlbmRlckVycm9yIChlcnIpIHtcblx0XHRcdFx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3JfX2Vycm9yJyk7XG5cdFx0XHRcdGNvbnRhaW5lci50ZXh0Q29udGVudCA9IFtcblx0XHRcdFx0XHR0aGlzLnVybHBhcnNlcihlcnIudXJsKS5wYXRobmFtZSB8fCAnJ1xuXHRcdFx0XHRcdCwgZXJyLnJvdyB8fCAnJ1xuXHRcdFx0XHRcdCwgZXJyLmNvbCB8fCAnJ1xuXHRcdFx0XHRcdCwgZXJyLm1lc3NhZ2UgfHwgJydcblx0XHRcdFx0XS5qb2luKCc6Jyk7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdH1cblxuXG5cdFx0XHRpbml0ICgpIHtcblx0XHRcdFx0d2luZG93Lm9uZXJyb3IgPSB0aGlzLmVycm9ySGFuZGxlci5iaW5kKHRoaXMpO1xuXG5cdFx0XHRcdHRoaXMud2lkZ2V0ID0gdGhpcy5nZW5lcmF0ZVdpZGdldENvbnRlbnQodGhpcy5pZCk7XG5cblx0XHRcdFx0bGV0IGJ1dHRvbiA9IHRoaXMud2lkZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1nZW5lcmF0b3JfX2J1dHRvbicpO1xuXHRcdFx0XHRsZXQgcGFzc3dvcmQgPSB0aGlzLndpZGdldC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpO1xuXHRcdFx0XHRsZXQgbGVuZ3RoID0gdGhpcy53aWRnZXQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoJyk7XG5cblx0XHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5idXR0b25DbGlja0hhbmRsZXIuYmluZCh0aGlzKSk7XG5cblx0XHRcdFx0Ly9zaG93cyBub3RpZmljYXRpb24gYWZ0ZXIgcGFzc3dvcmQgd2FzIGNvcGllZFxuXHRcdFx0XHR0aGlzLndpZGdldC5hZGRFdmVudExpc3RlbmVyKCdjb3B5JywgdGhpcy5fb25Db3B5RXZlbnRIYW5kbGVyLmJpbmQodGhpcykpO1xuXG5cdFx0XHRcdHBhc3N3b3JkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9wYXNzd29yZE9ubW91c2V1cEhhbmRsZXIuYmluZCh0aGlzKSk7XG5cdFx0XHRcdGxlbmd0aC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLl9sZW5naE9uQ2hhbmdlSGFuZGxlci5iaW5kKHRoaXMpKTtcblxuXHRcdFx0XHR0aGlzLndpZGdldFxuXHRcdFx0XHRcdC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpXG5cdFx0XHRcdFx0LnZhbHVlID0gdGhpcy5nZW5lcmF0ZVBhc3N3b3JkKHRoaXMubGVuZ3RoKTtcblx0XHRcdH1cblxuXHRcdFx0Z2VuZXJhdGVXaWRnZXRDb250ZW50IChpZCkge1xuXHRcdFx0XHRsZXQgd2lkZ2V0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHRcdFx0XHRpZiAoIWlkICYmIHRoaXMuZWwpIHdpZGdldENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5lbCk7XG5cblx0XHRcdFx0Ly8gPGRpdiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvclwiPlxuXHRcdFx0XHQvLyAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwicGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZFwiPnBhc3N3b3JkPC9pbnB1dD5cblx0XHRcdFx0Ly8gICA8aW5wdXQgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX2J1dHRvblwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cImdlbmVyYXRlXCI+XG5cdFx0XHRcdC8vICAgPGRpdiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fdG9vbHNcIj5cblx0XHRcdFx0Ly8gICAgIDxkaXYgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX2xlbmd0aC1jb250YWluZXJcIj5cblx0XHRcdFx0Ly8gICAgICAgPHNlbGVjdCBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoXCI+XG5cdFx0XHRcdC8vICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjZcIj42PC9vcHRpb24+XG5cdFx0XHRcdC8vICAgICAgICAgPCEtLSAuLi4gLS0+XG5cdFx0XHRcdC8vICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjE2XCIgc2VsZWN0ZWQ+MTY8L29wdGlvbj5cblx0XHRcdFx0Ly8gICAgICAgICA8IS0tIC4uLiAtLT5cblx0XHRcdFx0Ly8gICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMjU2XCI+MjU2PC9vcHRpb24+XG5cdFx0XHRcdC8vICAgICAgIDwvc2VsZWN0PlxuXHRcdFx0XHQvLyAgICAgPC9kaXY+XG5cdFx0XHRcdC8vICAgICA8ZGl2IGNsYXNzPVwicGFzc3dvcmQtZ2VuZXJhdG9yX19jaGFyc2V0LWxpc3RcIj5cblx0XHRcdFx0Ly8gICAgICAgPGxhYmVsPlxuXHRcdFx0XHQvLyAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwidXBwZXJjYXNlXCIgdmFsdWU9XCJ1cHBlcmNhc2VcIj5cblx0XHRcdFx0Ly8gICAgICAgICB1cHBlcmNhc2Vcblx0XHRcdFx0Ly8gICAgICAgPC9sYWJlbD5cblx0XHRcdFx0Ly8gICAgICAgPGxhYmVsPlxuXHRcdFx0XHQvLyAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwibG93ZXJjYXNlXCIgdmFsdWU9XCJsb3dlcmNhc2VcIj5cblx0XHRcdFx0Ly8gICAgICAgICBsb3dlcmNhc2Vcblx0XHRcdFx0Ly8gICAgICAgPC9sYWJlbD5cblx0XHRcdFx0Ly8gICAgICAgPGxhYmVsPlxuXHRcdFx0XHQvLyAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwibnVtYmVyc1wiIHZhbHVlPVwibnVtYmVyc1wiPlxuXHRcdFx0XHQvLyAgICAgICAgIG51bWJlcnNcblx0XHRcdFx0Ly8gICAgICAgPC9sYWJlbD5cblx0XHRcdFx0Ly8gICAgIDwvZGl2PlxuXHRcdFx0XHQvLyAgIDwvZGl2PlxuXHRcdFx0XHQvLyA8L2Rpdj5cblxuXHRcdFx0XHRsZXQgd2lkZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGxldCBwYXNzd29yZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0XHRcdGxldCBwYXNzd29yZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRcdFx0bGV0IGxlbmd0aENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRsZXQgbGVuZ3RoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG5cdFx0XHRcdGxldCBjaGFyc2V0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0XHRcdHdpZGdldC5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3InKTtcblx0XHRcdFx0d2lkZ2V0LmNsYXNzTGlzdC5hZGQoJ2NsZWFyZml4Jyk7XG5cdFx0XHRcdHBhc3N3b3JkLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKTtcblx0XHRcdFx0cGFzc3dvcmQudHlwZSA9ICd0ZXh0Jztcblx0XHRcdFx0cGFzc3dvcmQudmFsdWUgPSAncGFzc3dvcmQnO1xuXHRcdFx0XHRwYXNzd29yZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkLWNvbnRhaW5lcicpO1xuXHRcdFx0XHRidXR0b24udHlwZSA9ICdidXR0b24nO1xuXHRcdFx0XHRidXR0b24udmFsdWUgPSAnZ2VuZXJhdGUnO1xuXHRcdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19idXR0b24nKTtcblx0XHRcdFx0bGVuZ3RoQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoLWNvbnRhaW5lcicpO1xuXHRcdFx0XHRsZW5ndGguY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19sZW5ndGgnKTtcblx0XHRcdFx0dGhpcy5fZ2VuZXJhdGVMZW5ndGhFbGVtZW50KGxlbmd0aCk7XG5cdFx0XHRcdGNoYXJzZXRMaXN0LmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fY2hhcnNldC1saXN0Jyk7XG5cdFx0XHRcdHRoaXMuX2dlbmVyYXRlQ2hhcnNldExpc3RFbGVtZW50KGNoYXJzZXRMaXN0KTtcblxuXHRcdFx0XHRwYXNzd29yZENvbnRhaW5lci5hcHBlbmRDaGlsZChwYXNzd29yZCk7XG5cdFx0XHRcdHdpZGdldC5hcHBlbmRDaGlsZChwYXNzd29yZENvbnRhaW5lcik7XG5cdFx0XHRcdHdpZGdldC5hcHBlbmRDaGlsZChidXR0b24pO1xuXHRcdFx0XHRsZW5ndGhDb250YWluZXIuYXBwZW5kQ2hpbGQobGVuZ3RoKTtcblx0XHRcdFx0d2lkZ2V0LmFwcGVuZENoaWxkKGxlbmd0aENvbnRhaW5lcik7XG5cdFx0XHRcdHdpZGdldENvbnRhaW5lci5hcHBlbmRDaGlsZCh3aWRnZXQpO1xuXHRcdFx0XHR3aWRnZXQuYXBwZW5kQ2hpbGQoY2hhcnNldExpc3QpO1xuXG5cdFx0XHRcdHJldHVybiB3aWRnZXQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vY29waWVzIHBhc3N3b3JkIHRvIGNsaXBib2FyZFxuXHRcdFx0X3Bhc3N3b3JkT25tb3VzZXVwSGFuZGxlcihlKSB7XG5cdFx0XHRcdGxldCBlbGVtID0gZS50YXJnZXQ7XG5cblx0XHRcdFx0Ly8gc2VsZWN0cyBwYXNzd29yZCBhbmQgY29weSBpdCB0byBjbGlwYm9hcmRcblx0XHRcdFx0Ly8gZG9lcyBub3Qgd29yayBvbiBpT1MgZGV2aWNlc1xuXHRcdFx0XHRlbGVtLnNldFNlbGVjdGlvblJhbmdlKDAsIGVsZW0udmFsdWUubGVuZ3RoKTtcblx0XHRcdFx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcblx0XHRcdH1cblxuXHRcdFx0Ly9zaG93cyBcImNvcGllZFwiIG5vdGlmaWNhdGlvblxuXHRcdFx0X29uQ29weUV2ZW50SGFuZGxlciAoZXZlbnQpIHtcblx0XHRcdFx0aWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fdG9vbHRpcCcpLmxlbmd0aCkgeyByZXR1cm47IH1cblxuXHRcdFx0XHQvL2VsZW1lbnQgYWJvdXQgd2hpY2ggeW91IHdhbnQgdG8gZHJhdyBhIHRvb2x0aXBcblx0XHRcdFx0bGV0IGVsZW0gPSBldmVudC50YXJnZXQ7XG5cblx0XHRcdFx0Ly9jcmVhdGVzIG5vdGlmaWNhdGlvbiBtZXNzYWdlXG5cdFx0XHRcdGxldCBlbGVtQ29vcmRzID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdFx0bGV0IHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGxldCB0aW1lcjtcblxuXHRcdFx0XHRwb3B1cC5jbGFzc0xpc3QudG9nZ2xlKCdwYXNzd29yZC1nZW5lcmF0b3JfX3Rvb2x0aXAnKTtcblx0XHRcdFx0cG9wdXAuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ2NvcGllZCcpKTtcblxuXHRcdFx0XHRsZXQgcGFzc3dvcmRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKVxuXHRcdFx0XHRwYXNzd29yZEVsZW0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG9wdXAsIHBhc3N3b3JkRWxlbS5uZXh0U2libGluZylcblxuXHRcdFx0XHQvL3NldHMgYSBub3RpZmljYXRpb24gZGlzcGxheSB0aW1lb3V0XG5cdFx0XHRcdHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHBvcHVwLnJlbW92ZSgpOyB9LCAxMDAwKTtcblxuXHRcdFx0fTtcblxuXHRcdFx0X2xlbmdoT25DaGFuZ2VIYW5kbGVyKGV2ZW50KSB7XG5cdFx0XHRcdGxldCBlbGVtID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0XHR0aGlzLmxlbmd0aCA9IHBhcnNlSW50KGVsZW0udmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdGF0aWMgX2RlZmF1bHRzICgpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRsZW5ndGg6IDE2LFxuXHRcdFx0XHRcdG1pbkxlbmd0aDogNixcblx0XHRcdFx0XHRtYXhMZW5ndGg6IDI1NlxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdF9kZWZhdWx0cygpIHtcblx0XHRcdFx0bGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5fZGVmYXVsdHMuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBfZ2V0Q2hhcnNldExpc3QoKSB7XG5cdFx0XHRcdGxldCBsaXN0ID0gW107XG5cdFx0XHRcdGxldCBzZWxlY3RvciA9ICcucGFzc3dvcmQtZ2VuZXJhdG9yX19jaGFyc2V0LWxpc3QgaW5wdXQnO1xuXHRcdFx0XHRpZiAodGhpcy5pZCkge1xuXHRcdFx0XHRcdGxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHt0aGlzLmlkfSAke3NlbGVjdG9yfWApXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5lbCkge1xuXHRcdFx0XHRcdGxpc3QgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxpc3QgPSBsaXN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuXHRcdFx0XHRcdGxpc3QgPSBBcnJheS5wcm90b3R5cGVcblx0XHRcdFx0XHRcdC5maWx0ZXIuYXBwbHkobGlzdCwgW2Z1bmN0aW9uKGl0ZW0pIHsgcmV0dXJuIGl0ZW0uY2hlY2tlZDsgfV0pXG5cdFx0XHRcdFx0XHQubWFwKGZ1bmN0aW9uKGl0ZW0pIHsgcmV0dXJuIGl0ZW0ubmFtZTsgfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGxpc3Quc2xpY2UoKTtcblx0XHRcdH1cblxuXHRcdFx0X2dldENoYXJzZXRMaXN0KCkge1xuXHRcdFx0XHRsZXQgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLl9nZXRDaGFyc2V0TGlzdC5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0X2dlbmVyYXRlTGVuZ3RoRWxlbWVudChjb250YWluZXIpIHtcblx0XHRcdFx0Zm9yIChsZXQgbCA9IDA7IGwgPD0gdGhpcy5tYXhMZW5ndGggLSB0aGlzLm1pbkxlbmd0aDsgbCsrKSB7XG5cdFx0XHRcdFx0bGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXHRcdFx0XHRcdGxldCB2YWwgPSBsICsgdGhpcy5taW5MZW5ndGg7XG5cdFx0XHRcdFx0b3B0aW9uLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRcdG9wdGlvbi5pbm5lckhUTUwgPSB2YWw7XG5cdFx0XHRcdFx0aWYgKHZhbCA9PT0gdGhpcy5sZW5ndGgpIHsgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTsgfVxuXHRcdFx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChvcHRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdF9nZW5lcmF0ZUNoYXJzZXRMaXN0RWxlbWVudChjb250YWluZXIpIHtcblx0XHRcdFx0bGV0IGNoYXJzZXQgPSB0aGlzLmNvbnN0cnVjdG9yLmNoYXJzZXQoKTtcblx0XHRcdFx0Zm9yIChsZXQgcyBpbiBjaGFyc2V0KXtcblx0XHRcdFx0XHRsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0XHRcdGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5cdFx0XHRcdFx0aW5wdXQudHlwZSA9IFwiY2hlY2tib3hcIjtcblx0XHRcdFx0XHRpbnB1dC5uYW1lID0gcztcblx0XHRcdFx0XHRpbnB1dC52YWx1ZSA9IHM7XG5cdFx0XHRcdFx0aW5wdXQuY2hlY2tlZCA9IHRydWU7XG5cdFx0XHRcdFx0bGFiZWwuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXHRcdFx0XHRcdGxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHMpKTtcblx0XHRcdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBjaGFyc2V0KCkge1xuXHRcdFx0XHQvLyBBLVogNjUtOTBcblx0XHRcdFx0Ly8gYS16IDk3LTEyMlxuXHRcdFx0XHQvLyAwLTkgNDgtNTdcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGxvd2VyY2FzZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEyMiAtIDk3ICsgMSkpICsgOTcsXG5cdFx0XHRcdFx0dXBwZXJjYXNlOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTAgLSA2NSArIDEpKSArIDY1LFxuXHRcdFx0XHRcdG51bWJlcnM6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg1NyAtIDQ4ICsgMSkpICsgNDhcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0Y2hhcnNldCgpIHtcblx0XHRcdFx0bGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5jaGFyc2V0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdGF0aWMgZ2V0QVNDSUlhbHBoYW51bWVyaWMgKGxpc3Q9WydudW1iZXJzJywgJ3VwcGVyY2FzZScsICdsb3dlcmNhc2UnXSkge1xuXHRcdFx0XHRsZXQga2V5cztcblx0XHRcdFx0aWYgKCFsaXN0Lmxlbmd0aCkgeyBrZXlzID0gT2JqZWN0LmtleXModGhpcy5jaGFyc2V0KCkpOyB9XG5cdFx0XHRcdGVsc2UgeyBrZXlzID0gbGlzdDsgfVxuXG5cdFx0XHRcdHJldHVybiB0aGlzLmNoYXJzZXQoKVtrZXlzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGtleXMubGVuZ3RoKV1dO1xuXHRcdFx0fVxuXG5cdFx0XHRnZXRBU0NJSWFscGhhbnVtZXJpYyAoKSB7XG5cdFx0XHRcdGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZ2V0QVNDSUlhbHBoYW51bWVyaWMuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBnZW5lcmF0ZVBhc3N3b3JkIChsZW4pIHtcblx0XHRcdFx0bGVuID0gbGVuIHx8IHRoaXMuX2RlZmF1bHRzKCkubGVuZ3RoO1xuXHRcdFx0XHRsZXQgcGFzc3dvcmQgPSAnJztcblx0XHRcdFx0bGV0IGNoYXJzZXRMaXN0ID0gdGhpcy5fZ2V0Q2hhcnNldExpc3QoKTtcblx0XHRcdFx0aWYgKGxlbiA+IHRoaXMuX2RlZmF1bHRzKCkubWF4TGVuZ3RoKSB7IGxlbiA9IHRoaXMuX2RlZmF1bHRzKCkubWF4TGVuZ3RoOyB9XG5cdFx0XHRcdGlmIChsZW4gPCB0aGlzLl9kZWZhdWx0cygpLm1pbkxlbmd0aCkgeyBsZW4gPSB0aGlzLl9kZWZhdWx0cygpLm1pbkxlbmd0aDsgfVxuXHRcdFx0XHRmb3IgKDsgbGVuOyBsZW4tLSkgcGFzc3dvcmQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldEFTQ0lJYWxwaGFudW1lcmljKGNoYXJzZXRMaXN0KSk7XG5cdFx0XHRcdHJldHVybiBwYXNzd29yZDtcblx0XHRcdH1cblxuXHRcdFx0Z2VuZXJhdGVQYXNzd29yZCAoKSB7XG5cdFx0XHRcdGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZ2VuZXJhdGVQYXNzd29yZC5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0YnV0dG9uQ2xpY2tIYW5kbGVyIChlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0bGV0IHBhc3N3b3JkT3V0ID0gdGhpcy53aWRnZXQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKTtcblx0XHRcdFx0cGFzc3dvcmRPdXQudmFsdWUgPSB0aGlzLmdlbmVyYXRlUGFzc3dvcmQodGhpcy5sZW5ndGgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR3aW5kb3cuUGFzc3dvcmRHZW5lcmF0b3JXaWRnZXQgPSBQYXNzd29yZEdlbmVyYXRvcldpZGdldDtcblxuXHR9KTtcbn0pKCk7XG4iXX0=
