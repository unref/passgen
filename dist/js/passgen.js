'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
	"use strict";

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
			key: 'init',
			value: function init() {
				this.widget = this.generateWidgetContent(this.id);

				var button = this.widget.querySelector('.password-generator__button');
				var password = this.widget.querySelector('.password-generator__password');
				var length = this.widget.querySelector('.password-generator__length');

				button.addEventListener('click', this.buttonClickHandler.bind(this));

				//shows notification after password was copied
				this.widget.addEventListener('copy', this.onCopyEventHandler.bind(this));

				password.addEventListener('mouseup', this.passwordOnmouseupHandler.bind(this));
				length.addEventListener('change', this.lenghOnChangeHandler.bind(this));

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

		}, {
			key: 'passwordOnmouseupHandler',
			value: function passwordOnmouseupHandler(e) {
				var elem = e.target;

				// selects password and copy it to clipboard
				// does not work on iOS devices
				elem.setSelectionRange(0, elem.value.length);
				document.execCommand('copy');
			}

			//shows "copied" notification

		}, {
			key: 'onCopyEventHandler',
			value: function onCopyEventHandler(event) {
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
			key: 'lenghOnChangeHandler',
			value: function lenghOnChangeHandler(event) {
				var elem = event.target;
				this.length = parseInt(elem.value);
			}
		}, {
			key: 'getCharsetList',
			value: function getCharsetList() {
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
			key: 'generateLengthElement',
			value: function generateLengthElement(container) {
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
			key: 'generateCharsetListElement',
			value: function generateCharsetListElement(container) {
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
				passwordOut.value = this.core.generatePassword(this.length, this.getCharsetList());
			}
		}]);

		return PasswordGeneratorWidget;
	}();

	window.PasswordGeneratorWidget = PasswordGeneratorWidget;
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3Bhc3NnZW4uanMiXSwibmFtZXMiOlsiUGFzc3dvcmRHZW5lcmF0b3JDb3JlIiwibGVuZ3RoIiwibWluTGVuZ3RoIiwibWF4TGVuZ3RoIiwiY2hhclR5cGVzIiwiY2hhcnNldCIsInNlbGVjdGVkQ2hhclR5cGVzIiwidHlwZXMiLCJwcmVzZXRzIiwicmFuZG9tQ2hhclR5cGUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjaGFyc2V0QnlUeXBlIiwicmFuZG9tQ2hhciIsImxlbiIsIkFycmF5IiwiZnJvbSIsImdldFJhbmRvbUNoYXIiLCJqb2luIiwiUGFzc3dvcmRHZW5lcmF0b3JXaWRnZXQiLCJvcHRpb25zIiwiY29yZSIsImlkIiwiZWwiLCJpbml0Iiwid2lkZ2V0IiwiZ2VuZXJhdGVXaWRnZXRDb250ZW50IiwiYnV0dG9uIiwicXVlcnlTZWxlY3RvciIsInBhc3N3b3JkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJ1dHRvbkNsaWNrSGFuZGxlciIsImJpbmQiLCJvbkNvcHlFdmVudEhhbmRsZXIiLCJwYXNzd29yZE9ubW91c2V1cEhhbmRsZXIiLCJsZW5naE9uQ2hhbmdlSGFuZGxlciIsInZhbHVlIiwiZ2VuZXJhdGVQYXNzd29yZCIsIndpZGdldENvbnRhaW5lciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGVFbGVtZW50IiwicGFzc3dvcmRDb250YWluZXIiLCJsZW5ndGhDb250YWluZXIiLCJjaGFyc2V0TGlzdCIsImNsYXNzTGlzdCIsImFkZCIsInR5cGUiLCJnZW5lcmF0ZUxlbmd0aEVsZW1lbnQiLCJnZW5lcmF0ZUNoYXJzZXRMaXN0RWxlbWVudCIsImFwcGVuZENoaWxkIiwiZSIsImVsZW0iLCJ0YXJnZXQiLCJzZXRTZWxlY3Rpb25SYW5nZSIsImV4ZWNDb21tYW5kIiwiZXZlbnQiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiZWxlbUNvb3JkcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInBvcHVwIiwidGltZXIiLCJ0b2dnbGUiLCJjcmVhdGVUZXh0Tm9kZSIsInBhc3N3b3JkRWxlbSIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJuZXh0U2libGluZyIsInNldFRpbWVvdXQiLCJyZW1vdmUiLCJwYXJzZUludCIsImxpc3QiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpc0FycmF5IiwicHJvdG90eXBlIiwiZmlsdGVyIiwiYXBwbHkiLCJpdGVtIiwiY2hlY2tlZCIsIm1hcCIsIm5hbWUiLCJzbGljZSIsImNvbnRhaW5lciIsImwiLCJvcHRpb24iLCJ2YWwiLCJpbm5lckhUTUwiLCJzZWxlY3RlZCIsInMiLCJpbnB1dCIsImxhYmVsIiwicHJldmVudERlZmF1bHQiLCJwYXNzd29yZE91dCIsImdldENoYXJzZXRMaXN0Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxDQUFFLENBQUMsWUFBWTtBQUNkOztBQURjLEtBR1JBLHFCQUhRO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw2QkFJSztBQUNoQixXQUFPO0FBQ05DLGFBQVEsRUFERjtBQUVOQyxnQkFBVyxDQUZMO0FBR05DLGdCQUFXLEdBSEw7QUFJTkMsZ0JBQVcsQ0FBQyxTQUFELEVBQVksV0FBWixFQUF5QixXQUF6QixFQUFzQyxTQUF0QyxDQUpMO0FBS05DLGNBQVM7QUFDUixpQkFBVyxZQURIO0FBRVIsbUJBQWEsNEJBRkw7QUFHUixtQkFBYSw0QkFITDtBQUlSLGlCQUFXO0FBSkg7QUFMSCxLQUFQO0FBWUE7QUFqQlc7QUFBQTtBQUFBLGlDQW1CU0MsaUJBbkJULEVBbUI0QjtBQUN2QyxRQUFNQyxRQUFRRCxxQkFBcUJBLGtCQUFrQkwsTUFBdkMsSUFBaURLLGlCQUFqRCxJQUFzRSxLQUFLRSxPQUFMLEdBQWVKLFNBQW5HO0FBQ0EsUUFBTUssaUJBQWlCRixNQUFNRyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JMLE1BQU1OLE1BQWpDLENBQU4sQ0FBdkI7QUFDQSxRQUFNWSxnQkFBZ0IsS0FB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QVYsQ0FBc0J5QyxLQUF0QjtBQUNBO0FBQ0Q7QUEvTlk7QUFBQTtBQUFBLHNDQWlPT3hDLENBak9QLEVBaU9VO0FBQ3RCQSxNQUFFeUMsY0FBRjtBQUNBLFFBQUlDLGNBQWMsS0FBS3BFLE1BQUwsQ0FBWUcsYUFBWixDQUEwQiwrQkFBMUIsQ0FBbEI7QUFDQWlFLGdCQUFZekQsS0FBWixHQUFvQixLQUFLZixJQUFMLENBQVVnQixnQkFBVixDQUEyQixLQUFLckMsTUFBaEMsRUFBd0MsS0FBSzhGLGNBQUwsRUFBeEMsQ0FBcEI7QUFDQTtBQXJPWTs7QUFBQTtBQUFBOztBQXVPZEMsUUFBTzVFLHVCQUFQLEdBQWlDQSx1QkFBakM7QUFFQSxDQXpPQyIsImZpbGUiOiJqcy9wYXNzZ2VuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiOyAoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRjbGFzcyBQYXNzd29yZEdlbmVyYXRvckNvcmUge1xuXHRcdFx0c3RhdGljIHByZXNldHMoKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0bGVuZ3RoOiAxNixcblx0XHRcdFx0XHRtaW5MZW5ndGg6IDYsXG5cdFx0XHRcdFx0bWF4TGVuZ3RoOiAyNTYsXG5cdFx0XHRcdFx0Y2hhclR5cGVzOiBbJ251bWJlcnMnLCAndXBwZXJjYXNlJywgJ2xvd2VyY2FzZScsICdzcGVjaWFsJ10sXG5cdFx0XHRcdFx0Y2hhcnNldDoge1xuXHRcdFx0XHRcdFx0J251bWJlcnMnOiAnMTIzNDU2Nzg5MCcsXG5cdFx0XHRcdFx0XHQndXBwZXJjYXNlJzogJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJyxcblx0XHRcdFx0XHRcdCdsb3dlcmNhc2UnOiAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLFxuXHRcdFx0XHRcdFx0J3NwZWNpYWwnOiAnISMkJSYoKSorLC0uLzo7PD0+P0BbXV5fe3x9fidcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBnZXRSYW5kb21DaGFyKHNlbGVjdGVkQ2hhclR5cGVzKSB7XG5cdFx0XHRcdGNvbnN0IHR5cGVzID0gc2VsZWN0ZWRDaGFyVHlwZXMgJiYgc2VsZWN0ZWRDaGFyVHlwZXMubGVuZ3RoICYmIHNlbGVjdGVkQ2hhclR5cGVzIHx8IHRoaXMucHJlc2V0cygpLmNoYXJUeXBlcztcblx0XHRcdFx0Y29uc3QgcmFuZG9tQ2hhclR5cGUgPSB0eXBlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0eXBlcy5sZW5ndGgpXTtcblx0XHRcdFx0Y29uc3QgY2hhcnNldEJ5VHlwZSA9IHRoaXMucHJlc2V0cygpLmNoYXJzZXRbcmFuZG9tQ2hhclR5cGVdO1xuXHRcdFx0XHRjb25zdCByYW5kb21DaGFyID0gY2hhcnNldEJ5VHlwZVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyc2V0QnlUeXBlLmxlbmd0aCldO1xuXHRcdFx0XHRyZXR1cm4gcmFuZG9tQ2hhcjtcblx0XHRcdH1cblxuXHRcdFx0c3RhdGljIGdlbmVyYXRlUGFzc3dvcmQgKGxlbiwgc2VsZWN0ZWRDaGFyVHlwZXMpIHtcblx0XHRcdFx0bGVuID0gbGVuIHx8IHRoaXMucHJlc2V0cygpLmxlbmd0aDtcblx0XHRcdFx0aWYgKGxlbiA+IHRoaXMucHJlc2V0cygpLm1heExlbmd0aCkgeyBsZW4gPSB0aGlzLnByZXNldHMoKS5tYXhMZW5ndGg7IH1cblx0XHRcdFx0aWYgKGxlbiA8IHRoaXMucHJlc2V0cygpLm1pbkxlbmd0aCkgeyBsZW4gPSB0aGlzLnByZXNldHMoKS5taW5MZW5ndGg7IH1cblx0XHRcdFx0cmV0dXJuIEFycmF5LmZyb20oQXJyYXkobGVuKSwgKCkgPT4gdGhpcy5nZXRSYW5kb21DaGFyKHNlbGVjdGVkQ2hhclR5cGVzKSkuam9pbignJyk7XG5cdFx0XHR9XG5cblx0fVxuXG5cblx0Ly8gbmV3IFBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0KHtcblx0Ly8gICAgbGVuZ3RoOiAnbGVuZ3RoIG9mIHBhc3N3b3JkJyxcblx0Ly8gICAgaWQ6ICdpZCBvZiB3aWRnZXQgY29udGFpbmVyIGVsZW1lbnQnXG5cdC8vIH0pXG5cblxuXHRjbGFzcyBQYXNzd29yZEdlbmVyYXRvcldpZGdldCB7XG5cdFx0Y29uc3RydWN0b3Iob3B0aW9ucyl7XG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0XHRcdHRoaXMubGVuZ3RoID0gb3B0aW9ucy5sZW5ndGggfHwgMTY7XG5cdFx0XHR0aGlzLmNvcmUgPSBQYXNzd29yZEdlbmVyYXRvckNvcmU7XG5cdFx0XHR0aGlzLm1pbkxlbmd0aCA9IHRoaXMuY29yZS5wcmVzZXRzKCkubWluTGVuZ3RoIHx8IDY7XG5cdFx0XHR0aGlzLm1heExlbmd0aCA9IHRoaXMuY29yZS5wcmVzZXRzKCkubWF4TGVuZ3RoIHx8IDI1Njtcblx0XHRcdHRoaXMuaWQgPSBvcHRpb25zLmlkO1xuXHRcdFx0aWYgKCFvcHRpb25zLmlkKSB0aGlzLmVsID0gb3B0aW9ucy5lbCB8fCAnYm9keSc7XG5cdFx0XHR0aGlzLmluaXQoKTtcblx0XHR9XG5cblx0XHRpbml0ICgpIHtcblx0XHRcdHRoaXMud2lkZ2V0ID0gdGhpcy5nZW5lcmF0ZVdpZGdldENvbnRlbnQodGhpcy5pZCk7XG5cblx0XHRcdGxldCBidXR0b24gPSB0aGlzLndpZGdldC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19idXR0b24nKTtcblx0XHRcdGxldCBwYXNzd29yZCA9IHRoaXMud2lkZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkJyk7XG5cdFx0XHRsZXQgbGVuZ3RoID0gdGhpcy53aWRnZXQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoJyk7XG5cblx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnV0dG9uQ2xpY2tIYW5kbGVyLmJpbmQodGhpcykpO1xuXG5cdFx0XHQvL3Nob3dzIG5vdGlmaWNhdGlvbiBhZnRlciBwYXNzd29yZCB3YXMgY29waWVkXG5cdFx0XHR0aGlzLndpZGdldC5hZGRFdmVudExpc3RlbmVyKCdjb3B5JywgdGhpcy5vbkNvcHlFdmVudEhhbmRsZXIuYmluZCh0aGlzKSk7XG5cblx0XHRcdHBhc3N3b3JkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnBhc3N3b3JkT25tb3VzZXVwSGFuZGxlci5iaW5kKHRoaXMpKTtcblx0XHRcdGxlbmd0aC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmxlbmdoT25DaGFuZ2VIYW5kbGVyLmJpbmQodGhpcykpO1xuXG5cdFx0XHR0aGlzLndpZGdldFxuXHRcdFx0XHQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKVxuXHRcdFx0XHQudmFsdWUgPSB0aGlzLmNvcmUuZ2VuZXJhdGVQYXNzd29yZCh0aGlzLmxlbmd0aCk7XG5cdFx0fVxuXG5cdFx0Z2VuZXJhdGVXaWRnZXRDb250ZW50IChpZCkge1xuXHRcdFx0bGV0IHdpZGdldENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblx0XHRcdGlmICghaWQgJiYgdGhpcy5lbCkgd2lkZ2V0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsKTtcblxuXHRcdFx0Ly8gPGRpdiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvclwiPlxuXHRcdFx0Ly8gICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmRcIj5wYXNzd29yZDwvaW5wdXQ+XG5cdFx0XHQvLyAgIDxpbnB1dCBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiZ2VuZXJhdGVcIj5cblx0XHRcdC8vICAgPGRpdiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fdG9vbHNcIj5cblx0XHRcdC8vICAgICA8ZGl2IGNsYXNzPVwicGFzc3dvcmQtZ2VuZXJhdG9yX19sZW5ndGgtY29udGFpbmVyXCI+XG5cdFx0XHQvLyAgICAgICA8c2VsZWN0IGNsYXNzPVwicGFzc3dvcmQtZ2VuZXJhdG9yX19sZW5ndGhcIj5cblx0XHRcdC8vICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjZcIj42PC9vcHRpb24+XG5cdFx0XHQvLyAgICAgICAgIDwhLS0gLi4uIC0tPlxuXHRcdFx0Ly8gICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMTZcIiBzZWxlY3RlZD4xNjwvb3B0aW9uPlxuXHRcdFx0Ly8gICAgICAgICA8IS0tIC4uLiAtLT5cblx0XHRcdC8vICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjI1NlwiPjI1Njwvb3B0aW9uPlxuXHRcdFx0Ly8gICAgICAgPC9zZWxlY3Q+XG5cdFx0XHQvLyAgICAgPC9kaXY+XG5cdFx0XHQvLyAgICAgPGRpdiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fY2hhcnNldC1saXN0XCI+XG5cdFx0XHQvLyAgICAgICA8bGFiZWw+XG5cdFx0XHQvLyAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwidXBwZXJjYXNlXCIgdmFsdWU9XCJ1cHBlcmNhc2VcIj5cblx0XHRcdC8vICAgICAgICAgdXBwZXJjYXNlXG5cdFx0XHQvLyAgICAgICA8L2xhYmVsPlxuXHRcdFx0Ly8gICAgICAgPGxhYmVsPlxuXHRcdFx0Ly8gICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImxvd2VyY2FzZVwiIHZhbHVlPVwibG93ZXJjYXNlXCI+XG5cdFx0XHQvLyAgICAgICAgIGxvd2VyY2FzZVxuXHRcdFx0Ly8gICAgICAgPC9sYWJlbD5cblx0XHRcdC8vICAgICAgIDxsYWJlbD5cblx0XHRcdC8vICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJudW1iZXJzXCIgdmFsdWU9XCJudW1iZXJzXCI+XG5cdFx0XHQvLyAgICAgICAgIG51bWJlcnNcblx0XHRcdC8vICAgICAgIDwvbGFiZWw+XG5cdFx0XHQvLyAgICAgPC9kaXY+XG5cdFx0XHQvLyAgIDwvZGl2PlxuXHRcdFx0Ly8gPC9kaXY+XG5cblx0XHRcdGxldCB3aWRnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGxldCBwYXNzd29yZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0XHRsZXQgcGFzc3dvcmRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0bGV0IGxlbmd0aENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0bGV0IGxlbmd0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuXHRcdFx0bGV0IGNoYXJzZXRMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRcdHdpZGdldC5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3InKTtcblx0XHRcdHdpZGdldC5jbGFzc0xpc3QuYWRkKCdjbGVhcmZpeCcpO1xuXHRcdFx0cGFzc3dvcmQuY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpO1xuXHRcdFx0cGFzc3dvcmQudHlwZSA9ICd0ZXh0Jztcblx0XHRcdHBhc3N3b3JkLnZhbHVlID0gJ3Bhc3N3b3JkJztcblx0XHRcdHBhc3N3b3JkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQtY29udGFpbmVyJyk7XG5cdFx0XHRidXR0b24udHlwZSA9ICdidXR0b24nO1xuXHRcdFx0YnV0dG9uLnZhbHVlID0gJ2dlbmVyYXRlJztcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3JfX2J1dHRvbicpO1xuXHRcdFx0bGVuZ3RoQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoLWNvbnRhaW5lcicpO1xuXHRcdFx0bGVuZ3RoLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoJyk7XG5cdFx0XHR0aGlzLmdlbmVyYXRlTGVuZ3RoRWxlbWVudChsZW5ndGgpO1xuXHRcdFx0Y2hhcnNldExpc3QuY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19jaGFyc2V0LWxpc3QnKTtcblx0XHRcdHRoaXMuZ2VuZXJhdGVDaGFyc2V0TGlzdEVsZW1lbnQoY2hhcnNldExpc3QpO1xuXG5cdFx0XHRwYXNzd29yZENvbnRhaW5lci5hcHBlbmRDaGlsZChwYXNzd29yZCk7XG5cdFx0XHR3aWRnZXQuYXBwZW5kQ2hpbGQocGFzc3dvcmRDb250YWluZXIpO1xuXHRcdFx0d2lkZ2V0LmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cdFx0XHRsZW5ndGhDb250YWluZXIuYXBwZW5kQ2hpbGQobGVuZ3RoKTtcblx0XHRcdHdpZGdldC5hcHBlbmRDaGlsZChsZW5ndGhDb250YWluZXIpO1xuXHRcdFx0d2lkZ2V0Q29udGFpbmVyLmFwcGVuZENoaWxkKHdpZGdldCk7XG5cdFx0XHR3aWRnZXQuYXBwZW5kQ2hpbGQoY2hhcnNldExpc3QpO1xuXG5cdFx0XHRyZXR1cm4gd2lkZ2V0O1xuXHRcdH1cblxuXHRcdC8vY29waWVzIHBhc3N3b3JkIHRvIGNsaXBib2FyZFxuXHRcdHBhc3N3b3JkT25tb3VzZXVwSGFuZGxlcihlKSB7XG5cdFx0XHRsZXQgZWxlbSA9IGUudGFyZ2V0O1xuXG5cdFx0XHQvLyBzZWxlY3RzIHBhc3N3b3JkIGFuZCBjb3B5IGl0IHRvIGNsaXBib2FyZFxuXHRcdFx0Ly8gZG9lcyBub3Qgd29yayBvbiBpT1MgZGV2aWNlc1xuXHRcdFx0ZWxlbS5zZXRTZWxlY3Rpb25SYW5nZSgwLCBlbGVtLnZhbHVlLmxlbmd0aCk7XG5cdFx0XHRkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuXHRcdH1cblxuXHRcdC8vc2hvd3MgXCJjb3BpZWRcIiBub3RpZmljYXRpb25cblx0XHRvbkNvcHlFdmVudEhhbmRsZXIgKGV2ZW50KSB7XG5cdFx0XHRpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFzc3dvcmQtZ2VuZXJhdG9yX190b29sdGlwJykubGVuZ3RoKSB7IHJldHVybjsgfVxuXG5cdFx0XHQvL2VsZW1lbnQgYWJvdXQgd2hpY2ggeW91IHdhbnQgdG8gZHJhdyBhIHRvb2x0aXBcblx0XHRcdGxldCBlbGVtID0gZXZlbnQudGFyZ2V0O1xuXG5cdFx0XHQvL2NyZWF0ZXMgbm90aWZpY2F0aW9uIG1lc3NhZ2Vcblx0XHRcdGxldCBlbGVtQ29vcmRzID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdGxldCBwb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0bGV0IHRpbWVyO1xuXG5cdFx0XHRwb3B1cC5jbGFzc0xpc3QudG9nZ2xlKCdwYXNzd29yZC1nZW5lcmF0b3JfX3Rvb2x0aXAnKTtcblx0XHRcdHBvcHVwLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdjb3BpZWQnKSk7XG5cblx0XHRcdGxldCBwYXNzd29yZEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpXG5cdFx0XHRwYXNzd29yZEVsZW0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG9wdXAsIHBhc3N3b3JkRWxlbS5uZXh0U2libGluZylcblxuXHRcdFx0Ly9zZXRzIGEgbm90aWZpY2F0aW9uIGRpc3BsYXkgdGltZW91dFxuXHRcdFx0dGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcG9wdXAucmVtb3ZlKCk7IH0sIDEwMDApO1xuXG5cdFx0fTtcblxuXHRcdGxlbmdoT25DaGFuZ2VIYW5kbGVyKGV2ZW50KSB7XG5cdFx0XHRsZXQgZWxlbSA9IGV2ZW50LnRhcmdldDtcblx0XHRcdHRoaXMubGVuZ3RoID0gcGFyc2VJbnQoZWxlbS52YWx1ZSk7XG5cdFx0fVxuXG5cdFx0Z2V0Q2hhcnNldExpc3QoKSB7XG5cdFx0XHRsZXQgbGlzdCA9IFtdO1xuXHRcdFx0bGV0IHNlbGVjdG9yID0gJy5wYXNzd29yZC1nZW5lcmF0b3JfX2NoYXJzZXQtbGlzdCBpbnB1dCc7XG5cdFx0XHRpZiAodGhpcy5pZCkge1xuXHRcdFx0XHRsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgIyR7dGhpcy5pZH0gJHtzZWxlY3Rvcn1gKVxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLmVsKSB7XG5cdFx0XHRcdGxpc3QgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGlzdCA9IGxpc3Q7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcblx0XHRcdFx0bGlzdCA9IEFycmF5LnByb3RvdHlwZVxuXHRcdFx0XHRcdC5maWx0ZXIuYXBwbHkobGlzdCwgW2Z1bmN0aW9uKGl0ZW0pIHsgcmV0dXJuIGl0ZW0uY2hlY2tlZDsgfV0pXG5cdFx0XHRcdFx0Lm1hcChmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtLm5hbWU7IH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGxpc3Quc2xpY2UoKTtcblx0XHR9XG5cblx0XHRnZW5lcmF0ZUxlbmd0aEVsZW1lbnQoY29udGFpbmVyKSB7XG5cdFx0XHRmb3IgKGxldCBsID0gMDsgbCA8PSB0aGlzLm1heExlbmd0aCAtIHRoaXMubWluTGVuZ3RoOyBsKyspIHtcblx0XHRcdFx0bGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXHRcdFx0XHRsZXQgdmFsID0gbCArIHRoaXMubWluTGVuZ3RoO1xuXHRcdFx0XHRvcHRpb24udmFsdWUgPSB2YWw7XG5cdFx0XHRcdG9wdGlvbi5pbm5lckhUTUwgPSB2YWw7XG5cdFx0XHRcdGlmICh2YWwgPT09IHRoaXMubGVuZ3RoKSB7IG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7IH1cblx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKG9wdGlvbik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Z2VuZXJhdGVDaGFyc2V0TGlzdEVsZW1lbnQoY29udGFpbmVyKSB7XG5cdFx0XHRsZXQgY2hhcnNldCA9IHRoaXMuY29yZS5wcmVzZXRzKCkuY2hhcnNldDtcblx0XHRcdGZvciAobGV0IHMgaW4gY2hhcnNldCl7XG5cdFx0XHRcdGxldCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0XHRcdGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5cdFx0XHRcdGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCI7XG5cdFx0XHRcdGlucHV0Lm5hbWUgPSBzO1xuXHRcdFx0XHRpbnB1dC52YWx1ZSA9IHM7XG5cdFx0XHRcdGlucHV0LmNoZWNrZWQgPSB0cnVlO1xuXHRcdFx0XHRsYWJlbC5hcHBlbmRDaGlsZChpbnB1dCk7XG5cdFx0XHRcdGxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHMpKTtcblx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRidXR0b25DbGlja0hhbmRsZXIgKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBwYXNzd29yZE91dCA9IHRoaXMud2lkZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkJyk7XG5cdFx0XHRwYXNzd29yZE91dC52YWx1ZSA9IHRoaXMuY29yZS5nZW5lcmF0ZVBhc3N3b3JkKHRoaXMubGVuZ3RoLCB0aGlzLmdldENoYXJzZXRMaXN0KCkpO1xuXHRcdH1cblx0fVxuXHR3aW5kb3cuUGFzc3dvcmRHZW5lcmF0b3JXaWRnZXQgPSBQYXNzd29yZEdlbmVyYXRvcldpZGdldDtcblxufSkoKTtcbiJdfQ==
