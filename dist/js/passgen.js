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
			key: 'getRandomChar',
			value: function getRandomChar(selectedCharTypes) {
				var types = selectedCharTypes && selectedCharTypes.length && selectedCharTypes || this.presets.charTypes;
				var randomCharType = types[Math.floor(Math.random() * types.length)];
				var charsetByType = this.presets.charset[randomCharType];
				var randomChar = charsetByType[Math.floor(Math.random() * charsetByType.length)];
				return randomChar;
			}
		}, {
			key: 'generatePassword',
			value: function generatePassword(len, selectedCharTypes) {
				var _this = this;

				len = len || this.presets.length;
				if (len > this.presets.maxLength) {
					len = this.presets.maxLength;
				}
				if (len < this.presets.minLength) {
					len = this.presets.minLength;
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


	PasswordGeneratorCore.presets = {
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

	var PasswordGeneratorWidget = function () {
		function PasswordGeneratorWidget(options) {
			_classCallCheck(this, PasswordGeneratorWidget);

			options = options || {};
			this.length = options.length || 16;
			this.core = PasswordGeneratorCore;
			this.minLength = this.core.presets.minLength || 6;
			this.maxLength = this.core.presets.maxLength || 256;
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
				var charset = this.core.presets.charset;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3Bhc3NnZW4uanMiXSwibmFtZXMiOlsiUGFzc3dvcmRHZW5lcmF0b3JDb3JlIiwic2VsZWN0ZWRDaGFyVHlwZXMiLCJ0eXBlcyIsImxlbmd0aCIsInByZXNldHMiLCJjaGFyVHlwZXMiLCJyYW5kb21DaGFyVHlwZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNoYXJzZXRCeVR5cGUiLCJjaGFyc2V0IiwicmFuZG9tQ2hhciIsImxlbiIsIm1heExlbmd0aCIsIm1pbkxlbmd0aCIsIkFycmF5IiwiZnJvbSIsImdldFJhbmRvbUNoYXIiLCJqb2luIiwiUGFzc3dvcmRHZW5lcmF0b3JXaWRnZXQiLCJvcHRpb25zIiwiY29yZSIsImlkIiwiZWwiLCJpbml0Iiwid2lkZ2V0IiwiZ2VuZXJhdGVXaWRnZXRDb250ZW50IiwiYnV0dG9uIiwicXVlcnlTZWxlY3RvciIsInBhc3N3b3JkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJ1dHRvbkNsaWNrSGFuZGxlciIsImJpbmQiLCJvbkNvcHlFdmVudEhhbmRsZXIiLCJwYXNzd29yZE9ubW91c2V1cEhhbmRsZXIiLCJsZW5naE9uQ2hhbmdlSGFuZGxlciIsInZhbHVlIiwiZ2VuZXJhdGVQYXNzd29yZCIsIndpZGdldENvbnRhaW5lciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGVFbGVtZW50IiwicGFzc3dvcmRDb250YWluZXIiLCJsZW5ndGhDb250YWluZXIiLCJjaGFyc2V0TGlzdCIsImNsYXNzTGlzdCIsImFkZCIsInR5cGUiLCJnZW5lcmF0ZUxlbmd0aEVsZW1lbnQiLCJnZW5lcmF0ZUNoYXJzZXRMaXN0RWxlbWVudCIsImFwcGVuZENoaWxkIiwiZSIsImVsZW0iLCJ0YXJnZXQiLCJzZXRTZWxlY3Rpb25SYW5nZSIsImV4ZWNDb21tYW5kIiwiZXZlbnQiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiZWxlbUNvb3JkcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInBvcHVwIiwidGltZXIiLCJ0b2dnbGUiLCJjcmVhdGVUZXh0Tm9kZSIsInBhc3N3b3JkRWxlbSIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJuZXh0U2libGluZyIsInNldFRpbWVvdXQiLCJyZW1vdmUiLCJwYXJzZUludCIsImxpc3QiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpc0FycmF5IiwicHJvdG90eXBlIiwiZmlsdGVyIiwiYXBwbHkiLCJpdGVtIiwiY2hlY2tlZCIsIm1hcCIsIm5hbWUiLCJzbGljZSIsImNvbnRhaW5lciIsImwiLCJvcHRpb24iLCJ2YWwiLCJpbm5lckhUTUwiLCJzZWxlY3RlZCIsInMiLCJpbnB1dCIsImxhYmVsIiwicHJldmVudERlZmF1bHQiLCJwYXNzd29yZE91dCIsImdldENoYXJzZXRMaXN0Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxDQUFFLENBQUMsWUFBWTtBQUNkOztBQURjLEtBR1JBLHFCQUhRO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxpQ0FpQlNDLGlCQWpCVCxFQWlCNEI7QUFDdkMsUUFBTUMsUUFBUUQscUJBQXFCQSxrQkFBa0JFLE1BQXZDLElBQWlERixpQkFBakQsSUFBc0UsS0FBS0csT0FBTCxDQUFhQyxTQUFqRztBQUNBLFFBQU1DLGlCQUFpQkosTUFBTUssS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCUCxNQUFNQyxNQUFqQyxDQUFOLENBQXZCO0FBQ0EsUUFBTU8sZ0JBQWdCLEtBQUtOLE9BQUwsQ0FBYU8sT0FBYixDQUFxQkwsY0FBckIsQ0FBdEI7QUFDQSxRQUFNTSxhQUFhRixjQUFjSCxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JDLGNBQWNQLE1BQXpDLENBQWQsQ0FBbkI7QUFDQSxXQUFPUyxVQUFQO0FBQ0E7QUF2Qlc7QUFBQTtBQUFBLG9DQXlCYUMsR0F6QmIsRUF5QmtCWixpQkF6QmxCLEVBeUJxQztBQUFBOztBQUNoRFksVUFBTUEsT0FBTyxLQUFLVCxPQUFMLENBQWFELE1B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QnlDLEtBQXRCO0FBQ0E7QUFDRDtBQTVOWTtBQUFBO0FBQUEsc0NBOE5PeEMsQ0E5TlAsRUE4TlU7QUFDdEJBLE1BQUV5QyxjQUFGO0FBQ0EsUUFBSUMsY0FBYyxLQUFLcEUsTUFBTCxDQUFZRyxhQUFaLENBQTBCLCtCQUExQixDQUFsQjtBQUNBaUUsZ0JBQVl6RCxLQUFaLEdBQW9CLEtBQUtmLElBQUwsQ0FBVWdCLGdCQUFWLENBQTJCLEtBQUtuQyxNQUFoQyxFQUF3QyxLQUFLNEYsY0FBTCxFQUF4QyxDQUFwQjtBQUNBO0FBbE9ZOztBQUFBO0FBQUE7O0FBb09kQyxRQUFPNUUsdUJBQVAsR0FBaUNBLHVCQUFqQztBQUVBLENBdE9DIiwiZmlsZSI6ImpzL3Bhc3NnZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyI7IChmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGNsYXNzIFBhc3N3b3JkR2VuZXJhdG9yQ29yZSB7XG5cdFx0XHRzdGF0aWMgcHJlc2V0cyA9IHtcblx0XHRcdFx0bGVuZ3RoOiAxNixcblx0XHRcdFx0bWluTGVuZ3RoOiA2LFxuXHRcdFx0XHRtYXhMZW5ndGg6IDI1Nixcblx0XHRcdFx0Y2hhclR5cGVzOiBbJ251bWJlcnMnLCAndXBwZXJjYXNlJywgJ2xvd2VyY2FzZScsICdzcGVjaWFsJ10sXG5cdFx0XHRcdGNoYXJzZXQ6IHtcblx0XHRcdFx0XHQnbnVtYmVycyc6ICcxMjM0NTY3ODkwJyxcblx0XHRcdFx0XHQndXBwZXJjYXNlJzogJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJyxcblx0XHRcdFx0XHQnbG93ZXJjYXNlJzogJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jyxcblx0XHRcdFx0XHQnc3BlY2lhbCc6ICchIyQlJigpKissLS4vOjs8PT4/QFtdXl97fH1+J1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBnZXRSYW5kb21DaGFyKHNlbGVjdGVkQ2hhclR5cGVzKSB7XG5cdFx0XHRcdGNvbnN0IHR5cGVzID0gc2VsZWN0ZWRDaGFyVHlwZXMgJiYgc2VsZWN0ZWRDaGFyVHlwZXMubGVuZ3RoICYmIHNlbGVjdGVkQ2hhclR5cGVzIHx8IHRoaXMucHJlc2V0cy5jaGFyVHlwZXM7XG5cdFx0XHRcdGNvbnN0IHJhbmRvbUNoYXJUeXBlID0gdHlwZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdHlwZXMubGVuZ3RoKV07XG5cdFx0XHRcdGNvbnN0IGNoYXJzZXRCeVR5cGUgPSB0aGlzLnByZXNldHMuY2hhcnNldFtyYW5kb21DaGFyVHlwZV07XG5cdFx0XHRcdGNvbnN0IHJhbmRvbUNoYXIgPSBjaGFyc2V0QnlUeXBlW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJzZXRCeVR5cGUubGVuZ3RoKV07XG5cdFx0XHRcdHJldHVybiByYW5kb21DaGFyO1xuXHRcdFx0fVxuXG5cdFx0XHRzdGF0aWMgZ2VuZXJhdGVQYXNzd29yZCAobGVuLCBzZWxlY3RlZENoYXJUeXBlcykge1xuXHRcdFx0XHRsZW4gPSBsZW4gfHwgdGhpcy5wcmVzZXRzLmxlbmd0aDtcblx0XHRcdFx0aWYgKGxlbiA+IHRoaXMucHJlc2V0cy5tYXhMZW5ndGgpIHsgbGVuID0gdGhpcy5wcmVzZXRzLm1heExlbmd0aDsgfVxuXHRcdFx0XHRpZiAobGVuIDwgdGhpcy5wcmVzZXRzLm1pbkxlbmd0aCkgeyBsZW4gPSB0aGlzLnByZXNldHMubWluTGVuZ3RoOyB9XG5cdFx0XHRcdHJldHVybiBBcnJheS5mcm9tKEFycmF5KGxlbiksICgpID0+IHRoaXMuZ2V0UmFuZG9tQ2hhcihzZWxlY3RlZENoYXJUeXBlcykpLmpvaW4oJycpO1xuXHRcdFx0fVxuXHR9XG5cblxuXHQvLyBuZXcgUGFzc3dvcmRHZW5lcmF0b3JXaWRnZXQoe1xuXHQvLyAgICBsZW5ndGg6ICdsZW5ndGggb2YgcGFzc3dvcmQnLFxuXHQvLyAgICBpZDogJ2lkIG9mIHdpZGdldCBjb250YWluZXIgZWxlbWVudCdcblx0Ly8gfSlcblxuXG5cdGNsYXNzIFBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0IHtcblx0XHRjb25zdHJ1Y3RvcihvcHRpb25zKXtcblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdFx0dGhpcy5sZW5ndGggPSBvcHRpb25zLmxlbmd0aCB8fCAxNjtcblx0XHRcdHRoaXMuY29yZSA9IFBhc3N3b3JkR2VuZXJhdG9yQ29yZTtcblx0XHRcdHRoaXMubWluTGVuZ3RoID0gdGhpcy5jb3JlLnByZXNldHMubWluTGVuZ3RoIHx8IDY7XG5cdFx0XHR0aGlzLm1heExlbmd0aCA9IHRoaXMuY29yZS5wcmVzZXRzLm1heExlbmd0aCB8fCAyNTY7XG5cdFx0XHR0aGlzLmlkID0gb3B0aW9ucy5pZDtcblx0XHRcdGlmICghb3B0aW9ucy5pZCkgdGhpcy5lbCA9IG9wdGlvbnMuZWwgfHwgJ2JvZHknO1xuXHRcdFx0dGhpcy5pbml0KCk7XG5cdFx0fVxuXG5cdFx0aW5pdCAoKSB7XG5cdFx0XHR0aGlzLndpZGdldCA9IHRoaXMuZ2VuZXJhdGVXaWRnZXRDb250ZW50KHRoaXMuaWQpO1xuXG5cdFx0XHRsZXQgYnV0dG9uID0gdGhpcy53aWRnZXQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fYnV0dG9uJyk7XG5cdFx0XHRsZXQgcGFzc3dvcmQgPSB0aGlzLndpZGdldC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpO1xuXHRcdFx0bGV0IGxlbmd0aCA9IHRoaXMud2lkZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1nZW5lcmF0b3JfX2xlbmd0aCcpO1xuXG5cdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJ1dHRvbkNsaWNrSGFuZGxlci5iaW5kKHRoaXMpKTtcblxuXHRcdFx0Ly9zaG93cyBub3RpZmljYXRpb24gYWZ0ZXIgcGFzc3dvcmQgd2FzIGNvcGllZFxuXHRcdFx0dGhpcy53aWRnZXQuYWRkRXZlbnRMaXN0ZW5lcignY29weScsIHRoaXMub25Db3B5RXZlbnRIYW5kbGVyLmJpbmQodGhpcykpO1xuXG5cdFx0XHRwYXNzd29yZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5wYXNzd29yZE9ubW91c2V1cEhhbmRsZXIuYmluZCh0aGlzKSk7XG5cdFx0XHRsZW5ndGguYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5sZW5naE9uQ2hhbmdlSGFuZGxlci5iaW5kKHRoaXMpKTtcblxuXHRcdFx0dGhpcy53aWRnZXRcblx0XHRcdFx0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkJylcblx0XHRcdFx0LnZhbHVlID0gdGhpcy5jb3JlLmdlbmVyYXRlUGFzc3dvcmQodGhpcy5sZW5ndGgpO1xuXHRcdH1cblxuXHRcdGdlbmVyYXRlV2lkZ2V0Q29udGVudCAoaWQpIHtcblx0XHRcdGxldCB3aWRnZXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cdFx0XHRpZiAoIWlkICYmIHRoaXMuZWwpIHdpZGdldENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5lbCk7XG5cblx0XHRcdC8vIDxkaXYgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JcIj5cblx0XHRcdC8vICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkXCI+cGFzc3dvcmQ8L2lucHV0PlxuXHRcdFx0Ly8gICA8aW5wdXQgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX2J1dHRvblwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cImdlbmVyYXRlXCI+XG5cdFx0XHQvLyAgIDxkaXYgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX3Rvb2xzXCI+XG5cdFx0XHQvLyAgICAgPGRpdiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoLWNvbnRhaW5lclwiPlxuXHRcdFx0Ly8gICAgICAgPHNlbGVjdCBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoXCI+XG5cdFx0XHQvLyAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI2XCI+Njwvb3B0aW9uPlxuXHRcdFx0Ly8gICAgICAgICA8IS0tIC4uLiAtLT5cblx0XHRcdC8vICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjE2XCIgc2VsZWN0ZWQ+MTY8L29wdGlvbj5cblx0XHRcdC8vICAgICAgICAgPCEtLSAuLi4gLS0+XG5cdFx0XHQvLyAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIyNTZcIj4yNTY8L29wdGlvbj5cblx0XHRcdC8vICAgICAgIDwvc2VsZWN0PlxuXHRcdFx0Ly8gICAgIDwvZGl2PlxuXHRcdFx0Ly8gICAgIDxkaXYgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX2NoYXJzZXQtbGlzdFwiPlxuXHRcdFx0Ly8gICAgICAgPGxhYmVsPlxuXHRcdFx0Ly8gICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInVwcGVyY2FzZVwiIHZhbHVlPVwidXBwZXJjYXNlXCI+XG5cdFx0XHQvLyAgICAgICAgIHVwcGVyY2FzZVxuXHRcdFx0Ly8gICAgICAgPC9sYWJlbD5cblx0XHRcdC8vICAgICAgIDxsYWJlbD5cblx0XHRcdC8vICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJsb3dlcmNhc2VcIiB2YWx1ZT1cImxvd2VyY2FzZVwiPlxuXHRcdFx0Ly8gICAgICAgICBsb3dlcmNhc2Vcblx0XHRcdC8vICAgICAgIDwvbGFiZWw+XG5cdFx0XHQvLyAgICAgICA8bGFiZWw+XG5cdFx0XHQvLyAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwibnVtYmVyc1wiIHZhbHVlPVwibnVtYmVyc1wiPlxuXHRcdFx0Ly8gICAgICAgICBudW1iZXJzXG5cdFx0XHQvLyAgICAgICA8L2xhYmVsPlxuXHRcdFx0Ly8gICAgIDwvZGl2PlxuXHRcdFx0Ly8gICA8L2Rpdj5cblx0XHRcdC8vIDwvZGl2PlxuXG5cdFx0XHRsZXQgd2lkZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRsZXQgcGFzc3dvcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0bGV0IHBhc3N3b3JkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRcdGxldCBsZW5ndGhDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGxldCBsZW5ndGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcblx0XHRcdGxldCBjaGFyc2V0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0XHR3aWRnZXQuY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yJyk7XG5cdFx0XHR3aWRnZXQuY2xhc3NMaXN0LmFkZCgnY2xlYXJmaXgnKTtcblx0XHRcdHBhc3N3b3JkLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKTtcblx0XHRcdHBhc3N3b3JkLnR5cGUgPSAndGV4dCc7XG5cdFx0XHRwYXNzd29yZC52YWx1ZSA9ICdwYXNzd29yZCc7XG5cdFx0XHRwYXNzd29yZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkLWNvbnRhaW5lcicpO1xuXHRcdFx0YnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcblx0XHRcdGJ1dHRvbi52YWx1ZSA9ICdnZW5lcmF0ZSc7XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19idXR0b24nKTtcblx0XHRcdGxlbmd0aENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3JfX2xlbmd0aC1jb250YWluZXInKTtcblx0XHRcdGxlbmd0aC5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3JfX2xlbmd0aCcpO1xuXHRcdFx0dGhpcy5nZW5lcmF0ZUxlbmd0aEVsZW1lbnQobGVuZ3RoKTtcblx0XHRcdGNoYXJzZXRMaXN0LmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fY2hhcnNldC1saXN0Jyk7XG5cdFx0XHR0aGlzLmdlbmVyYXRlQ2hhcnNldExpc3RFbGVtZW50KGNoYXJzZXRMaXN0KTtcblxuXHRcdFx0cGFzc3dvcmRDb250YWluZXIuYXBwZW5kQ2hpbGQocGFzc3dvcmQpO1xuXHRcdFx0d2lkZ2V0LmFwcGVuZENoaWxkKHBhc3N3b3JkQ29udGFpbmVyKTtcblx0XHRcdHdpZGdldC5hcHBlbmRDaGlsZChidXR0b24pO1xuXHRcdFx0bGVuZ3RoQ29udGFpbmVyLmFwcGVuZENoaWxkKGxlbmd0aCk7XG5cdFx0XHR3aWRnZXQuYXBwZW5kQ2hpbGQobGVuZ3RoQ29udGFpbmVyKTtcblx0XHRcdHdpZGdldENvbnRhaW5lci5hcHBlbmRDaGlsZCh3aWRnZXQpO1xuXHRcdFx0d2lkZ2V0LmFwcGVuZENoaWxkKGNoYXJzZXRMaXN0KTtcblxuXHRcdFx0cmV0dXJuIHdpZGdldDtcblx0XHR9XG5cblx0XHQvL2NvcGllcyBwYXNzd29yZCB0byBjbGlwYm9hcmRcblx0XHRwYXNzd29yZE9ubW91c2V1cEhhbmRsZXIoZSkge1xuXHRcdFx0bGV0IGVsZW0gPSBlLnRhcmdldDtcblxuXHRcdFx0Ly8gc2VsZWN0cyBwYXNzd29yZCBhbmQgY29weSBpdCB0byBjbGlwYm9hcmRcblx0XHRcdC8vIGRvZXMgbm90IHdvcmsgb24gaU9TIGRldmljZXNcblx0XHRcdGVsZW0uc2V0U2VsZWN0aW9uUmFuZ2UoMCwgZWxlbS52YWx1ZS5sZW5ndGgpO1xuXHRcdFx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcblx0XHR9XG5cblx0XHQvL3Nob3dzIFwiY29waWVkXCIgbm90aWZpY2F0aW9uXG5cdFx0b25Db3B5RXZlbnRIYW5kbGVyIChldmVudCkge1xuXHRcdFx0aWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fdG9vbHRpcCcpLmxlbmd0aCkgeyByZXR1cm47IH1cblxuXHRcdFx0Ly9lbGVtZW50IGFib3V0IHdoaWNoIHlvdSB3YW50IHRvIGRyYXcgYSB0b29sdGlwXG5cdFx0XHRsZXQgZWxlbSA9IGV2ZW50LnRhcmdldDtcblxuXHRcdFx0Ly9jcmVhdGVzIG5vdGlmaWNhdGlvbiBtZXNzYWdlXG5cdFx0XHRsZXQgZWxlbUNvb3JkcyA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRsZXQgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGxldCB0aW1lcjtcblxuXHRcdFx0cG9wdXAuY2xhc3NMaXN0LnRvZ2dsZSgncGFzc3dvcmQtZ2VuZXJhdG9yX190b29sdGlwJyk7XG5cdFx0XHRwb3B1cC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnY29waWVkJykpO1xuXG5cdFx0XHRsZXQgcGFzc3dvcmRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKVxuXHRcdFx0cGFzc3dvcmRFbGVtLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBvcHVwLCBwYXNzd29yZEVsZW0ubmV4dFNpYmxpbmcpXG5cblx0XHRcdC8vc2V0cyBhIG5vdGlmaWNhdGlvbiBkaXNwbGF5IHRpbWVvdXRcblx0XHRcdHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHBvcHVwLnJlbW92ZSgpOyB9LCAxMDAwKTtcblxuXHRcdH07XG5cblx0XHRsZW5naE9uQ2hhbmdlSGFuZGxlcihldmVudCkge1xuXHRcdFx0bGV0IGVsZW0gPSBldmVudC50YXJnZXQ7XG5cdFx0XHR0aGlzLmxlbmd0aCA9IHBhcnNlSW50KGVsZW0udmFsdWUpO1xuXHRcdH1cblxuXHRcdGdldENoYXJzZXRMaXN0KCkge1xuXHRcdFx0bGV0IGxpc3QgPSBbXTtcblx0XHRcdGxldCBzZWxlY3RvciA9ICcucGFzc3dvcmQtZ2VuZXJhdG9yX19jaGFyc2V0LWxpc3QgaW5wdXQnO1xuXHRcdFx0aWYgKHRoaXMuaWQpIHtcblx0XHRcdFx0bGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCMke3RoaXMuaWR9ICR7c2VsZWN0b3J9YClcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5lbCkge1xuXHRcdFx0XHRsaXN0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxpc3QgPSBsaXN0O1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7XG5cdFx0XHRcdGxpc3QgPSBBcnJheS5wcm90b3R5cGVcblx0XHRcdFx0XHQuZmlsdGVyLmFwcGx5KGxpc3QsIFtmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtLmNoZWNrZWQ7IH1dKVxuXHRcdFx0XHRcdC5tYXAoZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbS5uYW1lOyB9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBsaXN0LnNsaWNlKCk7XG5cdFx0fVxuXG5cdFx0Z2VuZXJhdGVMZW5ndGhFbGVtZW50KGNvbnRhaW5lcikge1xuXHRcdFx0Zm9yIChsZXQgbCA9IDA7IGwgPD0gdGhpcy5tYXhMZW5ndGggLSB0aGlzLm1pbkxlbmd0aDsgbCsrKSB7XG5cdFx0XHRcdGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcblx0XHRcdFx0bGV0IHZhbCA9IGwgKyB0aGlzLm1pbkxlbmd0aDtcblx0XHRcdFx0b3B0aW9uLnZhbHVlID0gdmFsO1xuXHRcdFx0XHRvcHRpb24uaW5uZXJIVE1MID0gdmFsO1xuXHRcdFx0XHRpZiAodmFsID09PSB0aGlzLmxlbmd0aCkgeyBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlOyB9XG5cdFx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChvcHRpb24pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGdlbmVyYXRlQ2hhcnNldExpc3RFbGVtZW50KGNvbnRhaW5lcikge1xuXHRcdFx0bGV0IGNoYXJzZXQgPSB0aGlzLmNvcmUucHJlc2V0cy5jaGFyc2V0O1xuXHRcdFx0Zm9yIChsZXQgcyBpbiBjaGFyc2V0KXtcblx0XHRcdFx0bGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRcdFx0bGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcblx0XHRcdFx0aW5wdXQudHlwZSA9IFwiY2hlY2tib3hcIjtcblx0XHRcdFx0aW5wdXQubmFtZSA9IHM7XG5cdFx0XHRcdGlucHV0LnZhbHVlID0gcztcblx0XHRcdFx0aW5wdXQuY2hlY2tlZCA9IHRydWU7XG5cdFx0XHRcdGxhYmVsLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRcdFx0bGFiZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocykpO1xuXHRcdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGJ1dHRvbkNsaWNrSGFuZGxlciAoZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IHBhc3N3b3JkT3V0ID0gdGhpcy53aWRnZXQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQnKTtcblx0XHRcdHBhc3N3b3JkT3V0LnZhbHVlID0gdGhpcy5jb3JlLmdlbmVyYXRlUGFzc3dvcmQodGhpcy5sZW5ndGgsIHRoaXMuZ2V0Q2hhcnNldExpc3QoKSk7XG5cdFx0fVxuXHR9XG5cdHdpbmRvdy5QYXNzd29yZEdlbmVyYXRvcldpZGdldCA9IFBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0O1xuXG59KSgpO1xuIl19
