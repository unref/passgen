'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
	var PasswordGeneratorCore = function () {
		function PasswordGeneratorCore() {
			_classCallCheck(this, PasswordGeneratorCore);
		}

		_createClass(PasswordGeneratorCore, null, [{
			key: 'presets',
			value: function presets() {
				return {
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
				};
			}
		}, {
			key: 'getRandomChar',
			value: function getRandomChar(selectedCharTypes) {
				var types = selectedCharTypes && selectedCharTypes.length && selectedCharTypes || this.presets().charTypes;
				var randomCharType = types[Math.floor(Math.random() * types.length)];
				var charsetByType = this.presets().charset[randomCharType];
				var randomChar = charsetByType[Math.floor(Math.random() * charsetByType.length)];
				return randomChar;
			}
		}, {
			key: 'generatePassword',
			value: function generatePassword(len, selectedCharTypes) {
				var _this = this;

				len = len || this.presets().length;
				if (len > this.presets().maxLength) {
					len = this.presets().maxLength;
				}
				if (len < this.presets().minLength) {
					len = this.presets().minLength;
				}
				return Array.from(Array(len), function () {
					return _this.getRandomChar(selectedCharTypes);
				}).join('');
			}
		}]);

		return PasswordGeneratorCore;
	}();

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
				this.core = PasswordGeneratorCore;
				this.minLength = this.core.presets().minLength || 6;
				this.maxLength = this.core.presets().maxLength || 256;
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

					this.widget.querySelector('.password-generator__password').value = this.core.generatePassword(this.length);
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
					var charset = this.core.presets().charset;
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
				key: 'buttonClickHandler',
				value: function buttonClickHandler(e) {
					e.preventDefault();
					var passwordOut = this.widget.querySelector('.password-generator__password');
					passwordOut.value = this.core.generatePassword(this.length, this._getCharsetList());
				}
			}], [{
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
			}]);

			return PasswordGeneratorWidget;
		}();

		window.PasswordGeneratorWidget = PasswordGeneratorWidget;
	});
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3Bhc3NnZW4uanMiXSwibmFtZXMiOlsiUGFzc3dvcmRHZW5lcmF0b3JDb3JlIiwibGVuZ3RoIiwibWluTGVuZ3RoIiwibWF4TGVuZ3RoIiwiY2hhclR5cGVzIiwiY2hhcnNldCIsInNlbGVjdGVkQ2hhclR5cGVzIiwidHlwZXMiLCJwcmVzZXRzIiwicmFuZG9tQ2hhclR5cGUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjaGFyc2V0QnlUeXBlIiwicmFuZG9tQ2hhciIsImxlbiIsIkFycmF5IiwiZnJvbSIsImdldFJhbmRvbUNoYXIiLCJqb2luIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIlBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0Iiwib3B0aW9ucyIsImNvcmUiLCJpZCIsImVsIiwiaW5pdCIsInVybCIsImEiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwicHJvdG9jb2wiLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInF1ZXJ5Iiwic2VhcmNoIiwiaGFzaCIsImhvc3QiLCJtc2ciLCJyb3ciLCJjb2wiLCJlcnJvciIsImVyciIsIm1lc3NhZ2UiLCJjb25zb2xlIiwicmVuZGVyRXJyb3IiLCJjb250YWluZXIiLCJjbGFzc0xpc3QiLCJhZGQiLCJ0ZXh0Q29udGVudCIsInVybHBhcnNlciIsImJvZHkiLCJhcHBlbmRDaGlsZCIsIm9uZXJyb3IiLCJlcnJvckhhbmRsZXIiLCJiaW5kIiwid2lkZ2V0IiwiZ2VuZXJhdGVXaWRnZXRDb250ZW50IiwiYnV0dG9uIiwicXVlcnlTZWxlY3RvciIsInBhc3N3b3JkIiwiYnV0dG9uQ2xpY2tIYW5kbGVyIiwiX29uQ29weUV2ZW50SGFuZGxlciIsIl9wYXNzd29yZE9ubW91c2V1cEhhbmRsZXIiLCJfbGVuZ2hPbkNoYW5nZUhhbmRsZXIiLCJ2YWx1ZSIsImdlbmVyYXRlUGFzc3dvcmQiLCJ3aWRnZXRDb250YWluZXIiLCJnZXRFbGVtZW50QnlJZCIsInBhc3N3b3JkQ29udGFpbmVyIiwibGVuZ3RoQ29udGFpbmVyIiwiY2hhcnNldExpc3QiLCJ0eXBlIiwiX2dlbmVyYXRlTGVuZ3RoRWxlbWVudCIsIl9nZW5lcmF0ZUNoYXJzZXRMaXN0RWxlbWVudCIsImUiLCJlbGVtIiwidGFyZ2V0Iiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJleGVjQ29tbWFuZCIsImV2ZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImVsZW1Db29yZHMiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJwb3B1cCIsInRpbWVyIiwidG9nZ2xlIiwiY3JlYXRlVGV4dE5vZGUiLCJwYXNzd29yZEVsZW0iLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwibmV4dFNpYmxpbmciLCJzZXRUaW1lb3V0IiwicmVtb3ZlIiwicGFyc2VJbnQiLCJhcmdzIiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwiY29uc3RydWN0b3IiLCJfZ2V0Q2hhcnNldExpc3QiLCJhcHBseSIsImwiLCJvcHRpb24iLCJ2YWwiLCJpbm5lckhUTUwiLCJzZWxlY3RlZCIsInMiLCJpbnB1dCIsImxhYmVsIiwibmFtZSIsImNoZWNrZWQiLCJwcmV2ZW50RGVmYXVsdCIsInBhc3N3b3JkT3V0IiwibGlzdCIsInNlbGVjdG9yIiwicXVlcnlTZWxlY3RvckFsbCIsImlzQXJyYXkiLCJmaWx0ZXIiLCJpdGVtIiwibWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxDQUFFLENBQUMsWUFBWTtBQUFBLEtBRVJBLHFCQUZRO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw2QkFHSztBQUNoQixXQUFPO0FBQ05DLGFBQVEsRUFERjtBQUVOQyxnQkFBVyxDQUZMO0FBR05DLGdCQUFXLEdBSEw7QUFJTkMsZ0JBQVcsQ0FBQyxTQUFELEVBQVksV0FBWixFQUF5QixXQUF6QixFQUFzQyxTQUF0QyxDQUpMO0FBS05DLGNBQVM7QUFDUixpQkFBVyxZQURIO0FBRVIsbUJBQWEsNEJBRkw7QUFHUixtQkFBYSw0QkFITDtBQUlS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OU1xRDs7QUFBQTtBQUFBOztBQXVQdkRoRixTQUFPRSx1QkFBUCxHQUFpQ0EsdUJBQWpDO0FBRUEsRUF6UEQ7QUEwUEEsQ0E3UkMiLCJmaWxlIjoianMvcGFzc2dlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsgKGZ1bmN0aW9uICgpIHtcblxuXHRjbGFzcyBQYXNzd29yZEdlbmVyYXRvckNvcmUge1xuXHRcdFx0c3RhdGljIHByZXNldHMoKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0bGVuZ3RoOiAxNixcblx0XHRcdFx0XHRtaW5MZW5ndGg6IDYsXG5cdFx0XHRcdFx0bWF4TGVuZ3RoOiAyNTYsXG5cdFx0XHRcdFx0Y2hhclR5cGVzOiBbJ251bWJlcnMnLCAndXBwZXJjYXNlJywgJ2xvd2VyY2FzZScsICdzcGVjaWFsJ10sXG5cdFx0XHRcdFx0Y2hhcnNldDoge1xuXHRcdFx0XHRcdFx0J251bWJlcnMnOiAnMTIzNDU2Nzg5MCcsXG5cdFx0XHRcdFx0XHQndXBwZXJjYXNlJzogJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJyxcblx0XHRcdFx0XHRcdCdsb3dlcmNhc2UnOiAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLFxuXHRcdFx0XHRcdFx0J3NwZWNpYWwnOiAnISMkJSYoKSorLC0uLzo7PD0+P0BbXV5fe3x9fidcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBnZXRSYW5kb21DaGFyKHNlbGVjdGVkQ2hhclR5cGVzKSB7XG5cdFx0XHRcdGNvbnN0IHR5cGVzID0gc2VsZWN0ZWRDaGFyVHlwZXMgJiYgc2VsZWN0ZWRDaGFyVHlwZXMubGVuZ3RoICYmIHNlbGVjdGVkQ2hhclR5cGVzIHx8IHRoaXMucHJlc2V0cygpLmNoYXJUeXBlcztcblx0XHRcdFx0Y29uc3QgcmFuZG9tQ2hhclR5cGUgPSB0eXBlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0eXBlcy5sZW5ndGgpXTtcblx0XHRcdFx0Y29uc3QgY2hhcnNldEJ5VHlwZSA9IHRoaXMucHJlc2V0cygpLmNoYXJzZXRbcmFuZG9tQ2hhclR5cGVdO1xuXHRcdFx0XHRjb25zdCByYW5kb21DaGFyID0gY2hhcnNldEJ5VHlwZVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyc2V0QnlUeXBlLmxlbmd0aCldO1xuXHRcdFx0XHRyZXR1cm4gcmFuZG9tQ2hhcjtcblx0XHRcdH1cblxuXHRcdFx0c3RhdGljIGdlbmVyYXRlUGFzc3dvcmQgKGxlbiwgc2VsZWN0ZWRDaGFyVHlwZXMpIHtcblx0XHRcdFx0bGVuID0gbGVuIHx8IHRoaXMucHJlc2V0cygpLmxlbmd0aDtcblx0XHRcdFx0aWYgKGxlbiA+IHRoaXMucHJlc2V0cygpLm1heExlbmd0aCkgeyBsZW4gPSB0aGlzLnByZXNldHMoKS5tYXhMZW5ndGg7IH1cblx0XHRcdFx0aWYgKGxlbiA8IHRoaXMucHJlc2V0cygpLm1pbkxlbmd0aCkgeyBsZW4gPSB0aGlzLnByZXNldHMoKS5taW5MZW5ndGg7IH1cblx0XHRcdFx0cmV0dXJuIEFycmF5LmZyb20oQXJyYXkobGVuKSwgKCkgPT4gdGhpcy5nZXRSYW5kb21DaGFyKHNlbGVjdGVkQ2hhclR5cGVzKSkuam9pbignJyk7XG5cdFx0XHR9XG5cblx0fVxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0Ly8gbmV3IFBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0KHtcblx0XHQvLyAgICBsZW5ndGg6ICdsZW5ndGggb2YgcGFzc3dvcmQnLFxuXHRcdC8vICAgIGlkOiAnaWQgb2Ygd2lkZ2V0IGNvbnRhaW5lciBlbGVtZW50J1xuXHRcdC8vIH0pXG5cblxuXHRcdGNsYXNzIFBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0IHtcblx0XHRcdGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuXHRcdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0XHRcdFx0dGhpcy5sZW5ndGggPSBvcHRpb25zLmxlbmd0aCB8fCAxNjtcblx0XHRcdFx0dGhpcy5jb3JlID0gUGFzc3dvcmRHZW5lcmF0b3JDb3JlO1xuXHRcdFx0XHR0aGlzLm1pbkxlbmd0aCA9IHRoaXMuY29yZS5wcmVzZXRzKCkubWluTGVuZ3RoIHx8IDY7XG5cdFx0XHRcdHRoaXMubWF4TGVuZ3RoID0gdGhpcy5jb3JlLnByZXNldHMoKS5tYXhMZW5ndGggfHwgMjU2O1xuXHRcdFx0XHR0aGlzLmlkID0gb3B0aW9ucy5pZDtcblx0XHRcdFx0aWYgKCFvcHRpb25zLmlkKSB0aGlzLmVsID0gb3B0aW9ucy5lbCB8fCAnYm9keSc7XG5cdFx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR1cmxwYXJzZXIgKHVybCkge1xuXHRcdFx0XHRsZXQgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHRcdFx0YS5ocmVmID0gdXJsO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHByb3RvY29sOiBhLnByb3RvY29sLFxuXHRcdFx0XHRcdGhvc3RuYW1lOiBhLmhvc3RuYW1lLFxuXHRcdFx0XHRcdHBvcnQ6IGEucG9ydCxcblx0XHRcdFx0XHRwYXRobmFtZTogYS5wYXRobmFtZSxcblx0XHRcdFx0XHRxdWVyeTogYS5zZWFyY2gsXG5cdFx0XHRcdFx0aGFzaDogYS5oYXNoLFxuXHRcdFx0XHRcdGhvc3Q6IGEuaG9zdFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGVycm9ySGFuZGxlciAobXNnLCB1cmwsIHJvdywgY29sLCBlcnJvcikge1xuXHRcdFx0XHRsZXQgZXJyID0ge1xuXHRcdFx0XHRcdG1lc3NhZ2U6IG1zZyxcblx0XHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0XHRyb3c6IHJvdyxcblx0XHRcdFx0XHRjb2w6IGNvbFxuXHRcdFx0XHR9O1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRcdHRoaXMucmVuZGVyRXJyb3IoZXJyKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZW5kZXJFcnJvciAoZXJyKSB7XG5cdFx0XHRcdGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRjb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19lcnJvcicpO1xuXHRcdFx0XHRjb250YWluZXIudGV4dENvbnRlbnQgPSBbXG5cdFx0XHRcdFx0dGhpcy51cmxwYXJzZXIoZXJyLnVybCkucGF0aG5hbWUgfHwgJydcblx0XHRcdFx0XHQsIGVyci5yb3cgfHwgJydcblx0XHRcdFx0XHQsIGVyci5jb2wgfHwgJydcblx0XHRcdFx0XHQsIGVyci5tZXNzYWdlIHx8ICcnXG5cdFx0XHRcdF0uam9pbignOicpO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHR9XG5cblxuXHRcdFx0aW5pdCAoKSB7XG5cdFx0XHRcdHdpbmRvdy5vbmVycm9yID0gdGhpcy5lcnJvckhhbmRsZXIuYmluZCh0aGlzKTtcblxuXHRcdFx0XHR0aGlzLndpZGdldCA9IHRoaXMuZ2VuZXJhdGVXaWRnZXRDb250ZW50KHRoaXMuaWQpO1xuXG5cdFx0XHRcdGxldCBidXR0b24gPSB0aGlzLndpZGdldC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19idXR0b24nKTtcblx0XHRcdFx0bGV0IHBhc3N3b3JkID0gdGhpcy53aWRnZXQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKTtcblx0XHRcdFx0bGV0IGxlbmd0aCA9IHRoaXMud2lkZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1nZW5lcmF0b3JfX2xlbmd0aCcpO1xuXG5cdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnV0dG9uQ2xpY2tIYW5kbGVyLmJpbmQodGhpcykpO1xuXG5cdFx0XHRcdC8vc2hvd3Mgbm90aWZpY2F0aW9uIGFmdGVyIHBhc3N3b3JkIHdhcyBjb3BpZWRcblx0XHRcdFx0dGhpcy53aWRnZXQuYWRkRXZlbnRMaXN0ZW5lcignY29weScsIHRoaXMuX29uQ29weUV2ZW50SGFuZGxlci5iaW5kKHRoaXMpKTtcblxuXHRcdFx0XHRwYXNzd29yZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fcGFzc3dvcmRPbm1vdXNldXBIYW5kbGVyLmJpbmQodGhpcykpO1xuXHRcdFx0XHRsZW5ndGguYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5fbGVuZ2hPbkNoYW5nZUhhbmRsZXIuYmluZCh0aGlzKSk7XG5cblx0XHRcdFx0dGhpcy53aWRnZXRcblx0XHRcdFx0XHQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKVxuXHRcdFx0XHRcdC52YWx1ZSA9IHRoaXMuY29yZS5nZW5lcmF0ZVBhc3N3b3JkKHRoaXMubGVuZ3RoKTtcblx0XHRcdH1cblxuXHRcdFx0Z2VuZXJhdGVXaWRnZXRDb250ZW50IChpZCkge1xuXHRcdFx0XHRsZXQgd2lkZ2V0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXHRcdFx0XHRpZiAoIWlkICYmIHRoaXMuZWwpIHdpZGdldENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5lbCk7XG5cblx0XHRcdFx0Ly8gPGRpdiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvclwiPlxuXHRcdFx0XHQvLyAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwicGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZFwiPnBhc3N3b3JkPC9pbnB1dD5cblx0XHRcdFx0Ly8gICA8aW5wdXQgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX2J1dHRvblwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cImdlbmVyYXRlXCI+XG5cdFx0XHRcdC8vICAgPGRpdiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fdG9vbHNcIj5cblx0XHRcdFx0Ly8gICAgIDxkaXYgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX2xlbmd0aC1jb250YWluZXJcIj5cblx0XHRcdFx0Ly8gICAgICAgPHNlbGVjdCBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoXCI+XG5cdFx0XHRcdC8vICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjZcIj42PC9vcHRpb24+XG5cdFx0XHRcdC8vICAgICAgICAgPCEtLSAuLi4gLS0+XG5cdFx0XHRcdC8vICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjE2XCIgc2VsZWN0ZWQ+MTY8L29wdGlvbj5cblx0XHRcdFx0Ly8gICAgICAgICA8IS0tIC4uLiAtLT5cblx0XHRcdFx0Ly8gICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMjU2XCI+MjU2PC9vcHRpb24+XG5cdFx0XHRcdC8vICAgICAgIDwvc2VsZWN0PlxuXHRcdFx0XHQvLyAgICAgPC9kaXY+XG5cdFx0XHRcdC8vICAgICA8ZGl2IGNsYXNzPVwicGFzc3dvcmQtZ2VuZXJhdG9yX19jaGFyc2V0LWxpc3RcIj5cblx0XHRcdFx0Ly8gICAgICAgPGxhYmVsPlxuXHRcdFx0XHQvLyAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwidXBwZXJjYXNlXCIgdmFsdWU9XCJ1cHBlcmNhc2VcIj5cblx0XHRcdFx0Ly8gICAgICAgICB1cHBlcmNhc2Vcblx0XHRcdFx0Ly8gICAgICAgPC9sYWJlbD5cblx0XHRcdFx0Ly8gICAgICAgPGxhYmVsPlxuXHRcdFx0XHQvLyAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwibG93ZXJjYXNlXCIgdmFsdWU9XCJsb3dlcmNhc2VcIj5cblx0XHRcdFx0Ly8gICAgICAgICBsb3dlcmNhc2Vcblx0XHRcdFx0Ly8gICAgICAgPC9sYWJlbD5cblx0XHRcdFx0Ly8gICAgICAgPGxhYmVsPlxuXHRcdFx0XHQvLyAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwibnVtYmVyc1wiIHZhbHVlPVwibnVtYmVyc1wiPlxuXHRcdFx0XHQvLyAgICAgICAgIG51bWJlcnNcblx0XHRcdFx0Ly8gICAgICAgPC9sYWJlbD5cblx0XHRcdFx0Ly8gICAgIDwvZGl2PlxuXHRcdFx0XHQvLyAgIDwvZGl2PlxuXHRcdFx0XHQvLyA8L2Rpdj5cblxuXHRcdFx0XHRsZXQgd2lkZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGxldCBwYXNzd29yZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0XHRcdGxldCBwYXNzd29yZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRcdFx0bGV0IGxlbmd0aENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRsZXQgbGVuZ3RoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG5cdFx0XHRcdGxldCBjaGFyc2V0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0XHRcdHdpZGdldC5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3InKTtcblx0XHRcdFx0d2lkZ2V0LmNsYXNzTGlzdC5hZGQoJ2NsZWFyZml4Jyk7XG5cdFx0XHRcdHBhc3N3b3JkLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKTtcblx0XHRcdFx0cGFzc3dvcmQudHlwZSA9ICd0ZXh0Jztcblx0XHRcdFx0cGFzc3dvcmQudmFsdWUgPSAncGFzc3dvcmQnO1xuXHRcdFx0XHRwYXNzd29yZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkLWNvbnRhaW5lcicpO1xuXHRcdFx0XHRidXR0b24udHlwZSA9ICdidXR0b24nO1xuXHRcdFx0XHRidXR0b24udmFsdWUgPSAnZ2VuZXJhdGUnO1xuXHRcdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19idXR0b24nKTtcblx0XHRcdFx0bGVuZ3RoQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoLWNvbnRhaW5lcicpO1xuXHRcdFx0XHRsZW5ndGguY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19sZW5ndGgnKTtcblx0XHRcdFx0dGhpcy5fZ2VuZXJhdGVMZW5ndGhFbGVtZW50KGxlbmd0aCk7XG5cdFx0XHRcdGNoYXJzZXRMaXN0LmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fY2hhcnNldC1saXN0Jyk7XG5cdFx0XHRcdHRoaXMuX2dlbmVyYXRlQ2hhcnNldExpc3RFbGVtZW50KGNoYXJzZXRMaXN0KTtcblxuXHRcdFx0XHRwYXNzd29yZENvbnRhaW5lci5hcHBlbmRDaGlsZChwYXNzd29yZCk7XG5cdFx0XHRcdHdpZGdldC5hcHBlbmRDaGlsZChwYXNzd29yZENvbnRhaW5lcik7XG5cdFx0XHRcdHdpZGdldC5hcHBlbmRDaGlsZChidXR0b24pO1xuXHRcdFx0XHRsZW5ndGhDb250YWluZXIuYXBwZW5kQ2hpbGQobGVuZ3RoKTtcblx0XHRcdFx0d2lkZ2V0LmFwcGVuZENoaWxkKGxlbmd0aENvbnRhaW5lcik7XG5cdFx0XHRcdHdpZGdldENvbnRhaW5lci5hcHBlbmRDaGlsZCh3aWRnZXQpO1xuXHRcdFx0XHR3aWRnZXQuYXBwZW5kQ2hpbGQoY2hhcnNldExpc3QpO1xuXG5cdFx0XHRcdHJldHVybiB3aWRnZXQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vY29waWVzIHBhc3N3b3JkIHRvIGNsaXBib2FyZFxuXHRcdFx0X3Bhc3N3b3JkT25tb3VzZXVwSGFuZGxlcihlKSB7XG5cdFx0XHRcdGxldCBlbGVtID0gZS50YXJnZXQ7XG5cblx0XHRcdFx0Ly8gc2VsZWN0cyBwYXNzd29yZCBhbmQgY29weSBpdCB0byBjbGlwYm9hcmRcblx0XHRcdFx0Ly8gZG9lcyBub3Qgd29yayBvbiBpT1MgZGV2aWNlc1xuXHRcdFx0XHRlbGVtLnNldFNlbGVjdGlvblJhbmdlKDAsIGVsZW0udmFsdWUubGVuZ3RoKTtcblx0XHRcdFx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcblx0XHRcdH1cblxuXHRcdFx0Ly9zaG93cyBcImNvcGllZFwiIG5vdGlmaWNhdGlvblxuXHRcdFx0X29uQ29weUV2ZW50SGFuZGxlciAoZXZlbnQpIHtcblx0XHRcdFx0aWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fdG9vbHRpcCcpLmxlbmd0aCkgeyByZXR1cm47IH1cblxuXHRcdFx0XHQvL2VsZW1lbnQgYWJvdXQgd2hpY2ggeW91IHdhbnQgdG8gZHJhdyBhIHRvb2x0aXBcblx0XHRcdFx0bGV0IGVsZW0gPSBldmVudC50YXJnZXQ7XG5cblx0XHRcdFx0Ly9jcmVhdGVzIG5vdGlmaWNhdGlvbiBtZXNzYWdlXG5cdFx0XHRcdGxldCBlbGVtQ29vcmRzID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdFx0bGV0IHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGxldCB0aW1lcjtcblxuXHRcdFx0XHRwb3B1cC5jbGFzc0xpc3QudG9nZ2xlKCdwYXNzd29yZC1nZW5lcmF0b3JfX3Rvb2x0aXAnKTtcblx0XHRcdFx0cG9wdXAuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ2NvcGllZCcpKTtcblxuXHRcdFx0XHRsZXQgcGFzc3dvcmRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKVxuXHRcdFx0XHRwYXNzd29yZEVsZW0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG9wdXAsIHBhc3N3b3JkRWxlbS5uZXh0U2libGluZylcblxuXHRcdFx0XHQvL3NldHMgYSBub3RpZmljYXRpb24gZGlzcGxheSB0aW1lb3V0XG5cdFx0XHRcdHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHBvcHVwLnJlbW92ZSgpOyB9LCAxMDAwKTtcblxuXHRcdFx0fTtcblxuXHRcdFx0X2xlbmdoT25DaGFuZ2VIYW5kbGVyKGV2ZW50KSB7XG5cdFx0XHRcdGxldCBlbGVtID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0XHR0aGlzLmxlbmd0aCA9IHBhcnNlSW50KGVsZW0udmFsdWUpO1xuXHRcdFx0fVxuXG5cblxuXHRcdFx0c3RhdGljIF9nZXRDaGFyc2V0TGlzdCgpIHtcblx0XHRcdFx0bGV0IGxpc3QgPSBbXTtcblx0XHRcdFx0bGV0IHNlbGVjdG9yID0gJy5wYXNzd29yZC1nZW5lcmF0b3JfX2NoYXJzZXQtbGlzdCBpbnB1dCc7XG5cdFx0XHRcdGlmICh0aGlzLmlkKSB7XG5cdFx0XHRcdFx0bGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCMke3RoaXMuaWR9ICR7c2VsZWN0b3J9YClcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLmVsKSB7XG5cdFx0XHRcdFx0bGlzdCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bGlzdCA9IGxpc3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7XG5cdFx0XHRcdFx0bGlzdCA9IEFycmF5LnByb3RvdHlwZVxuXHRcdFx0XHRcdFx0LmZpbHRlci5hcHBseShsaXN0LCBbZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbS5jaGVja2VkOyB9XSlcblx0XHRcdFx0XHRcdC5tYXAoZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbS5uYW1lOyB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbGlzdC5zbGljZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRfZ2V0Q2hhcnNldExpc3QoKSB7XG5cdFx0XHRcdGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IuX2dldENoYXJzZXRMaXN0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHRfZ2VuZXJhdGVMZW5ndGhFbGVtZW50KGNvbnRhaW5lcikge1xuXHRcdFx0XHRmb3IgKGxldCBsID0gMDsgbCA8PSB0aGlzLm1heExlbmd0aCAtIHRoaXMubWluTGVuZ3RoOyBsKyspIHtcblx0XHRcdFx0XHRsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG5cdFx0XHRcdFx0bGV0IHZhbCA9IGwgKyB0aGlzLm1pbkxlbmd0aDtcblx0XHRcdFx0XHRvcHRpb24udmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0b3B0aW9uLmlubmVySFRNTCA9IHZhbDtcblx0XHRcdFx0XHRpZiAodmFsID09PSB0aGlzLmxlbmd0aCkgeyBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlOyB9XG5cdFx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKG9wdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0X2dlbmVyYXRlQ2hhcnNldExpc3RFbGVtZW50KGNvbnRhaW5lcikge1xuXHRcdFx0XHRsZXQgY2hhcnNldCA9IHRoaXMuY29yZS5wcmVzZXRzKCkuY2hhcnNldDtcblx0XHRcdFx0Zm9yIChsZXQgcyBpbiBjaGFyc2V0KXtcblx0XHRcdFx0XHRsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0XHRcdGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5cdFx0XHRcdFx0aW5wdXQudHlwZSA9IFwiY2hlY2tib3hcIjtcblx0XHRcdFx0XHRpbnB1dC5uYW1lID0gcztcblx0XHRcdFx0XHRpbnB1dC52YWx1ZSA9IHM7XG5cdFx0XHRcdFx0aW5wdXQuY2hlY2tlZCA9IHRydWU7XG5cdFx0XHRcdFx0bGFiZWwuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXHRcdFx0XHRcdGxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHMpKTtcblx0XHRcdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblxuXG5cdFx0XHRidXR0b25DbGlja0hhbmRsZXIgKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRsZXQgcGFzc3dvcmRPdXQgPSB0aGlzLndpZGdldC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpO1xuXHRcdFx0XHRwYXNzd29yZE91dC52YWx1ZSA9IHRoaXMuY29yZS5nZW5lcmF0ZVBhc3N3b3JkKHRoaXMubGVuZ3RoLCB0aGlzLl9nZXRDaGFyc2V0TGlzdCgpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0d2luZG93LlBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0ID0gUGFzc3dvcmRHZW5lcmF0b3JXaWRnZXQ7XG5cblx0fSk7XG59KSgpO1xuIl19
