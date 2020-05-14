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
				key: 'init',
				value: function init() {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3Bhc3NnZW4uanMiXSwibmFtZXMiOlsiUGFzc3dvcmRHZW5lcmF0b3JDb3JlIiwibGVuZ3RoIiwibWluTGVuZ3RoIiwibWF4TGVuZ3RoIiwiY2hhclR5cGVzIiwiY2hhcnNldCIsInNlbGVjdGVkQ2hhclR5cGVzIiwidHlwZXMiLCJwcmVzZXRzIiwicmFuZG9tQ2hhclR5cGUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjaGFyc2V0QnlUeXBlIiwicmFuZG9tQ2hhciIsImxlbiIsIkFycmF5IiwiZnJvbSIsImdldFJhbmRvbUNoYXIiLCJqb2luIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIlBhc3N3b3JkR2VuZXJhdG9yV2lkZ2V0Iiwib3B0aW9ucyIsImNvcmUiLCJpZCIsImVsIiwiaW5pdCIsIndpZGdldCIsImdlbmVyYXRlV2lkZ2V0Q29udGVudCIsImJ1dHRvbiIsInF1ZXJ5U2VsZWN0b3IiLCJwYXNzd29yZCIsImJ1dHRvbkNsaWNrSGFuZGxlciIsImJpbmQiLCJfb25Db3B5RXZlbnRIYW5kbGVyIiwiX3Bhc3N3b3JkT25tb3VzZXVwSGFuZGxlciIsIl9sZW5naE9uQ2hhbmdlSGFuZGxlciIsInZhbHVlIiwiZ2VuZXJhdGVQYXNzd29yZCIsIndpZGdldENvbnRhaW5lciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGVFbGVtZW50IiwicGFzc3dvcmRDb250YWluZXIiLCJsZW5ndGhDb250YWluZXIiLCJjaGFyc2V0TGlzdCIsImNsYXNzTGlzdCIsImFkZCIsInR5cGUiLCJfZ2VuZXJhdGVMZW5ndGhFbGVtZW50IiwiX2dlbmVyYXRlQ2hhcnNldExpc3RFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJlIiwiZWxlbSIsInRhcmdldCIsInNldFNlbGVjdGlvblJhbmdlIiwiZXhlY0NvbW1hbmQiLCJldmVudCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJlbGVtQ29vcmRzIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicG9wdXAiLCJ0aW1lciIsInRvZ2dsZSIsImNyZWF0ZVRleHROb2RlIiwicGFzc3dvcmRFbGVtIiwicGFyZW50Tm9kZSIsImluc2VydEJlZm9yZSIsIm5leHRTaWJsaW5nIiwic2V0VGltZW91dCIsInJlbW92ZSIsInBhcnNlSW50IiwiYXJncyIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsImNvbnN0cnVjdG9yIiwiX2dldENoYXJzZXRMaXN0IiwiYXBwbHkiLCJjb250YWluZXIiLCJsIiwib3B0aW9uIiwidmFsIiwiaW5uZXJIVE1MIiwic2VsZWN0ZWQiLCJzIiwiaW5wdXQiLCJsYWJlbCIsIm5hbWUiLCJjaGVja2VkIiwicHJldmVudERlZmF1bHQiLCJwYXNzd29yZE91dCIsImxpc3QiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpc0FycmF5IiwiZmlsdGVyIiwiaXRlbSIsIm1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsQ0FBRSxDQUFDLFlBQVk7QUFBQSxLQUVSQSxxQkFGUTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBR0s7QUFDaEIsV0FBTztBQUNOQyxhQUFRLEVBREY7QUFFTkMsZ0JBQVcsQ0FGTDtBQUdOQyxnQkFBVyxHQUhMO0FBSU5DLGdCQUFXLENBQUMsU0FBRCxFQUFZLFdBQVosRUFBeUIsV0FBekIsRUFBc0MsU0FBdEMsQ0FKTDtBQUtOQyxjQUFTO0FBQ1IsaUJBQVcsWUFESDtBQUVSLG1CQUFhLDRCQUZMO0FBR1IsbUJBQWEsNEJBSEw7QUFJUixpQkFBVztBQUpIO0FBTEgsS0FBUDtBQVlBO0FBaEJXO0FBQUE7QUFBQSxpQ0FrQlNDLGlCQWxCVCxFQWtCNEI7QUFDdkMsUUFBTUMsUUFBUUQscUJBQXFCQSxrQkFBa0JMLE1BQXZDLElBQWlESyxpQkFBakQsSUFBc0UsS0FBS0UsT0FBTCxHQUFlSixTQUFuRztBQUNBLFFBQU1LLGlCQUFpQkYsTUFBTUcsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCTCxNQUFN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QixTQUFJZSxPQUFPLEVBQVg7QUFDQSxTQUFJQyxXQUFXLHlDQUFmO0FBQ0EsU0FBSSxLQUFLdEUsRUFBVCxFQUFhO0FBQ1pxRSxhQUFPckQsU0FBU3VELGdCQUFULE9BQThCLEtBQUt2RSxFQUFuQyxTQUF5Q3NFLFFBQXpDLENBQVA7QUFDQSxNQUZELE1BRU8sSUFBSSxLQUFLckUsRUFBVCxFQUFhO0FBQ25Cb0UsYUFBTyxLQUFLcEUsRUFBTCxDQUFRc0UsZ0JBQVIsQ0FBeUJELFFBQXpCLENBQVA7QUFDQSxNQUZNLE1BRUE7QUFDTkQsYUFBT0EsSUFBUDtBQUNBO0FBQ0QsU0FBSSxDQUFDOUUsTUFBTWlGLE9BQU4sQ0FBY0gsSUFBZCxDQUFMLEVBQTBCO0FBQ3pCQSxhQUFPOUUsTUFBTTBELFNBQU4sQ0FDTHdCLE1BREssQ0FDRWxCLEtBREYsQ0FDUWMsSUFEUixFQUNjLENBQUMsVUFBU0ssSUFBVCxFQUFlO0FBQUUsY0FBT0EsS0FBS1IsT0FBWjtBQUFzQixPQUF4QyxDQURkLEVBRUxTLEdBRkssQ0FFRCxVQUFTRCxJQUFULEVBQWU7QUFBRSxjQUFPQSxLQUFLVCxJQUFaO0FBQW1CLE9BRm5DLENBQVA7QUFHQTtBQUNELFlBQU9JLEtBQUtuQixLQUFMLEVBQVA7QUFDQTtBQXJLcUQ7O0FBQUE7QUFBQTs7QUE4TXZEdkQsU0FBT0UsdUJBQVAsR0FBaUNBLHVCQUFqQztBQUVBLEVBaE5EO0FBaU5BLENBcFBDIiwiZmlsZSI6ImpzL3Bhc3NnZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyI7IChmdW5jdGlvbiAoKSB7XG5cblx0Y2xhc3MgUGFzc3dvcmRHZW5lcmF0b3JDb3JlIHtcblx0XHRcdHN0YXRpYyBwcmVzZXRzKCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGxlbmd0aDogMTYsXG5cdFx0XHRcdFx0bWluTGVuZ3RoOiA2LFxuXHRcdFx0XHRcdG1heExlbmd0aDogMjU2LFxuXHRcdFx0XHRcdGNoYXJUeXBlczogWydudW1iZXJzJywgJ3VwcGVyY2FzZScsICdsb3dlcmNhc2UnLCAnc3BlY2lhbCddLFxuXHRcdFx0XHRcdGNoYXJzZXQ6IHtcblx0XHRcdFx0XHRcdCdudW1iZXJzJzogJzEyMzQ1Njc4OTAnLFxuXHRcdFx0XHRcdFx0J3VwcGVyY2FzZSc6ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWicsXG5cdFx0XHRcdFx0XHQnbG93ZXJjYXNlJzogJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jyxcblx0XHRcdFx0XHRcdCdzcGVjaWFsJzogJyEjJCUmKCkqKywtLi86Ozw9Pj9AW11eX3t8fX4nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRzdGF0aWMgZ2V0UmFuZG9tQ2hhcihzZWxlY3RlZENoYXJUeXBlcykge1xuXHRcdFx0XHRjb25zdCB0eXBlcyA9IHNlbGVjdGVkQ2hhclR5cGVzICYmIHNlbGVjdGVkQ2hhclR5cGVzLmxlbmd0aCAmJiBzZWxlY3RlZENoYXJUeXBlcyB8fCB0aGlzLnByZXNldHMoKS5jaGFyVHlwZXM7XG5cdFx0XHRcdGNvbnN0IHJhbmRvbUNoYXJUeXBlID0gdHlwZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdHlwZXMubGVuZ3RoKV07XG5cdFx0XHRcdGNvbnN0IGNoYXJzZXRCeVR5cGUgPSB0aGlzLnByZXNldHMoKS5jaGFyc2V0W3JhbmRvbUNoYXJUeXBlXTtcblx0XHRcdFx0Y29uc3QgcmFuZG9tQ2hhciA9IGNoYXJzZXRCeVR5cGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcnNldEJ5VHlwZS5sZW5ndGgpXTtcblx0XHRcdFx0cmV0dXJuIHJhbmRvbUNoYXI7XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBnZW5lcmF0ZVBhc3N3b3JkIChsZW4sIHNlbGVjdGVkQ2hhclR5cGVzKSB7XG5cdFx0XHRcdGxlbiA9IGxlbiB8fCB0aGlzLnByZXNldHMoKS5sZW5ndGg7XG5cdFx0XHRcdGlmIChsZW4gPiB0aGlzLnByZXNldHMoKS5tYXhMZW5ndGgpIHsgbGVuID0gdGhpcy5wcmVzZXRzKCkubWF4TGVuZ3RoOyB9XG5cdFx0XHRcdGlmIChsZW4gPCB0aGlzLnByZXNldHMoKS5taW5MZW5ndGgpIHsgbGVuID0gdGhpcy5wcmVzZXRzKCkubWluTGVuZ3RoOyB9XG5cdFx0XHRcdHJldHVybiBBcnJheS5mcm9tKEFycmF5KGxlbiksICgpID0+IHRoaXMuZ2V0UmFuZG9tQ2hhcihzZWxlY3RlZENoYXJUeXBlcykpLmpvaW4oJycpO1xuXHRcdFx0fVxuXG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcInVzZSBzdHJpY3RcIjtcblxuXHRcdC8vIG5ldyBQYXNzd29yZEdlbmVyYXRvcldpZGdldCh7XG5cdFx0Ly8gICAgbGVuZ3RoOiAnbGVuZ3RoIG9mIHBhc3N3b3JkJyxcblx0XHQvLyAgICBpZDogJ2lkIG9mIHdpZGdldCBjb250YWluZXIgZWxlbWVudCdcblx0XHQvLyB9KVxuXG5cblx0XHRjbGFzcyBQYXNzd29yZEdlbmVyYXRvcldpZGdldCB7XG5cdFx0XHRjb25zdHJ1Y3RvcihvcHRpb25zKXtcblx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdFx0XHRcdHRoaXMubGVuZ3RoID0gb3B0aW9ucy5sZW5ndGggfHwgMTY7XG5cdFx0XHRcdHRoaXMuY29yZSA9IFBhc3N3b3JkR2VuZXJhdG9yQ29yZTtcblx0XHRcdFx0dGhpcy5taW5MZW5ndGggPSB0aGlzLmNvcmUucHJlc2V0cygpLm1pbkxlbmd0aCB8fCA2O1xuXHRcdFx0XHR0aGlzLm1heExlbmd0aCA9IHRoaXMuY29yZS5wcmVzZXRzKCkubWF4TGVuZ3RoIHx8IDI1Njtcblx0XHRcdFx0dGhpcy5pZCA9IG9wdGlvbnMuaWQ7XG5cdFx0XHRcdGlmICghb3B0aW9ucy5pZCkgdGhpcy5lbCA9IG9wdGlvbnMuZWwgfHwgJ2JvZHknO1xuXHRcdFx0XHR0aGlzLmluaXQoKTtcblx0XHRcdH1cblxuXHRcdFx0aW5pdCAoKSB7XG5cdFx0XHRcdHRoaXMud2lkZ2V0ID0gdGhpcy5nZW5lcmF0ZVdpZGdldENvbnRlbnQodGhpcy5pZCk7XG5cblx0XHRcdFx0bGV0IGJ1dHRvbiA9IHRoaXMud2lkZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1nZW5lcmF0b3JfX2J1dHRvbicpO1xuXHRcdFx0XHRsZXQgcGFzc3dvcmQgPSB0aGlzLndpZGdldC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpO1xuXHRcdFx0XHRsZXQgbGVuZ3RoID0gdGhpcy53aWRnZXQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoJyk7XG5cblx0XHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5idXR0b25DbGlja0hhbmRsZXIuYmluZCh0aGlzKSk7XG5cblx0XHRcdFx0Ly9zaG93cyBub3RpZmljYXRpb24gYWZ0ZXIgcGFzc3dvcmQgd2FzIGNvcGllZFxuXHRcdFx0XHR0aGlzLndpZGdldC5hZGRFdmVudExpc3RlbmVyKCdjb3B5JywgdGhpcy5fb25Db3B5RXZlbnRIYW5kbGVyLmJpbmQodGhpcykpO1xuXG5cdFx0XHRcdHBhc3N3b3JkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9wYXNzd29yZE9ubW91c2V1cEhhbmRsZXIuYmluZCh0aGlzKSk7XG5cdFx0XHRcdGxlbmd0aC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLl9sZW5naE9uQ2hhbmdlSGFuZGxlci5iaW5kKHRoaXMpKTtcblxuXHRcdFx0XHR0aGlzLndpZGdldFxuXHRcdFx0XHRcdC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpXG5cdFx0XHRcdFx0LnZhbHVlID0gdGhpcy5jb3JlLmdlbmVyYXRlUGFzc3dvcmQodGhpcy5sZW5ndGgpO1xuXHRcdFx0fVxuXG5cdFx0XHRnZW5lcmF0ZVdpZGdldENvbnRlbnQgKGlkKSB7XG5cdFx0XHRcdGxldCB3aWRnZXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cdFx0XHRcdGlmICghaWQgJiYgdGhpcy5lbCkgd2lkZ2V0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsKTtcblxuXHRcdFx0XHQvLyA8ZGl2IGNsYXNzPVwicGFzc3dvcmQtZ2VuZXJhdG9yXCI+XG5cdFx0XHRcdC8vICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkXCI+cGFzc3dvcmQ8L2lucHV0PlxuXHRcdFx0XHQvLyAgIDxpbnB1dCBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiZ2VuZXJhdGVcIj5cblx0XHRcdFx0Ly8gICA8ZGl2IGNsYXNzPVwicGFzc3dvcmQtZ2VuZXJhdG9yX190b29sc1wiPlxuXHRcdFx0XHQvLyAgICAgPGRpdiBjbGFzcz1cInBhc3N3b3JkLWdlbmVyYXRvcl9fbGVuZ3RoLWNvbnRhaW5lclwiPlxuXHRcdFx0XHQvLyAgICAgICA8c2VsZWN0IGNsYXNzPVwicGFzc3dvcmQtZ2VuZXJhdG9yX19sZW5ndGhcIj5cblx0XHRcdFx0Ly8gICAgICAgICA8b3B0aW9uIHZhbHVlPVwiNlwiPjY8L29wdGlvbj5cblx0XHRcdFx0Ly8gICAgICAgICA8IS0tIC4uLiAtLT5cblx0XHRcdFx0Ly8gICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMTZcIiBzZWxlY3RlZD4xNjwvb3B0aW9uPlxuXHRcdFx0XHQvLyAgICAgICAgIDwhLS0gLi4uIC0tPlxuXHRcdFx0XHQvLyAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIyNTZcIj4yNTY8L29wdGlvbj5cblx0XHRcdFx0Ly8gICAgICAgPC9zZWxlY3Q+XG5cdFx0XHRcdC8vICAgICA8L2Rpdj5cblx0XHRcdFx0Ly8gICAgIDxkaXYgY2xhc3M9XCJwYXNzd29yZC1nZW5lcmF0b3JfX2NoYXJzZXQtbGlzdFwiPlxuXHRcdFx0XHQvLyAgICAgICA8bGFiZWw+XG5cdFx0XHRcdC8vICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJ1cHBlcmNhc2VcIiB2YWx1ZT1cInVwcGVyY2FzZVwiPlxuXHRcdFx0XHQvLyAgICAgICAgIHVwcGVyY2FzZVxuXHRcdFx0XHQvLyAgICAgICA8L2xhYmVsPlxuXHRcdFx0XHQvLyAgICAgICA8bGFiZWw+XG5cdFx0XHRcdC8vICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJsb3dlcmNhc2VcIiB2YWx1ZT1cImxvd2VyY2FzZVwiPlxuXHRcdFx0XHQvLyAgICAgICAgIGxvd2VyY2FzZVxuXHRcdFx0XHQvLyAgICAgICA8L2xhYmVsPlxuXHRcdFx0XHQvLyAgICAgICA8bGFiZWw+XG5cdFx0XHRcdC8vICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJudW1iZXJzXCIgdmFsdWU9XCJudW1iZXJzXCI+XG5cdFx0XHRcdC8vICAgICAgICAgbnVtYmVyc1xuXHRcdFx0XHQvLyAgICAgICA8L2xhYmVsPlxuXHRcdFx0XHQvLyAgICAgPC9kaXY+XG5cdFx0XHRcdC8vICAgPC9kaXY+XG5cdFx0XHRcdC8vIDwvZGl2PlxuXG5cdFx0XHRcdGxldCB3aWRnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0bGV0IHBhc3N3b3JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRcdFx0bGV0IHBhc3N3b3JkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0XHRsZXQgbGVuZ3RoQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGxldCBsZW5ndGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcblx0XHRcdFx0bGV0IGNoYXJzZXRMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRcdFx0d2lkZ2V0LmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcicpO1xuXHRcdFx0XHR3aWRnZXQuY2xhc3NMaXN0LmFkZCgnY2xlYXJmaXgnKTtcblx0XHRcdFx0cGFzc3dvcmQuY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpO1xuXHRcdFx0XHRwYXNzd29yZC50eXBlID0gJ3RleHQnO1xuXHRcdFx0XHRwYXNzd29yZC52YWx1ZSA9ICdwYXNzd29yZCc7XG5cdFx0XHRcdHBhc3N3b3JkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fcGFzc3dvcmQtY29udGFpbmVyJyk7XG5cdFx0XHRcdGJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG5cdFx0XHRcdGJ1dHRvbi52YWx1ZSA9ICdnZW5lcmF0ZSc7XG5cdFx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3JfX2J1dHRvbicpO1xuXHRcdFx0XHRsZW5ndGhDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19sZW5ndGgtY29udGFpbmVyJyk7XG5cdFx0XHRcdGxlbmd0aC5jbGFzc0xpc3QuYWRkKCdwYXNzd29yZC1nZW5lcmF0b3JfX2xlbmd0aCcpO1xuXHRcdFx0XHR0aGlzLl9nZW5lcmF0ZUxlbmd0aEVsZW1lbnQobGVuZ3RoKTtcblx0XHRcdFx0Y2hhcnNldExpc3QuY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQtZ2VuZXJhdG9yX19jaGFyc2V0LWxpc3QnKTtcblx0XHRcdFx0dGhpcy5fZ2VuZXJhdGVDaGFyc2V0TGlzdEVsZW1lbnQoY2hhcnNldExpc3QpO1xuXG5cdFx0XHRcdHBhc3N3b3JkQ29udGFpbmVyLmFwcGVuZENoaWxkKHBhc3N3b3JkKTtcblx0XHRcdFx0d2lkZ2V0LmFwcGVuZENoaWxkKHBhc3N3b3JkQ29udGFpbmVyKTtcblx0XHRcdFx0d2lkZ2V0LmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cdFx0XHRcdGxlbmd0aENvbnRhaW5lci5hcHBlbmRDaGlsZChsZW5ndGgpO1xuXHRcdFx0XHR3aWRnZXQuYXBwZW5kQ2hpbGQobGVuZ3RoQ29udGFpbmVyKTtcblx0XHRcdFx0d2lkZ2V0Q29udGFpbmVyLmFwcGVuZENoaWxkKHdpZGdldCk7XG5cdFx0XHRcdHdpZGdldC5hcHBlbmRDaGlsZChjaGFyc2V0TGlzdCk7XG5cblx0XHRcdFx0cmV0dXJuIHdpZGdldDtcblx0XHRcdH1cblxuXHRcdFx0Ly9jb3BpZXMgcGFzc3dvcmQgdG8gY2xpcGJvYXJkXG5cdFx0XHRfcGFzc3dvcmRPbm1vdXNldXBIYW5kbGVyKGUpIHtcblx0XHRcdFx0bGV0IGVsZW0gPSBlLnRhcmdldDtcblxuXHRcdFx0XHQvLyBzZWxlY3RzIHBhc3N3b3JkIGFuZCBjb3B5IGl0IHRvIGNsaXBib2FyZFxuXHRcdFx0XHQvLyBkb2VzIG5vdCB3b3JrIG9uIGlPUyBkZXZpY2VzXG5cdFx0XHRcdGVsZW0uc2V0U2VsZWN0aW9uUmFuZ2UoMCwgZWxlbS52YWx1ZS5sZW5ndGgpO1xuXHRcdFx0XHRkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuXHRcdFx0fVxuXG5cdFx0XHQvL3Nob3dzIFwiY29waWVkXCIgbm90aWZpY2F0aW9uXG5cdFx0XHRfb25Db3B5RXZlbnRIYW5kbGVyIChldmVudCkge1xuXHRcdFx0XHRpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFzc3dvcmQtZ2VuZXJhdG9yX190b29sdGlwJykubGVuZ3RoKSB7IHJldHVybjsgfVxuXG5cdFx0XHRcdC8vZWxlbWVudCBhYm91dCB3aGljaCB5b3Ugd2FudCB0byBkcmF3IGEgdG9vbHRpcFxuXHRcdFx0XHRsZXQgZWxlbSA9IGV2ZW50LnRhcmdldDtcblxuXHRcdFx0XHQvL2NyZWF0ZXMgbm90aWZpY2F0aW9uIG1lc3NhZ2Vcblx0XHRcdFx0bGV0IGVsZW1Db29yZHMgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHRsZXQgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0bGV0IHRpbWVyO1xuXG5cdFx0XHRcdHBvcHVwLmNsYXNzTGlzdC50b2dnbGUoJ3Bhc3N3b3JkLWdlbmVyYXRvcl9fdG9vbHRpcCcpO1xuXHRcdFx0XHRwb3B1cC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnY29waWVkJykpO1xuXG5cdFx0XHRcdGxldCBwYXNzd29yZEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtZ2VuZXJhdG9yX19wYXNzd29yZCcpXG5cdFx0XHRcdHBhc3N3b3JkRWxlbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwb3B1cCwgcGFzc3dvcmRFbGVtLm5leHRTaWJsaW5nKVxuXG5cdFx0XHRcdC8vc2V0cyBhIG5vdGlmaWNhdGlvbiBkaXNwbGF5IHRpbWVvdXRcblx0XHRcdFx0dGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcG9wdXAucmVtb3ZlKCk7IH0sIDEwMDApO1xuXG5cdFx0XHR9O1xuXG5cdFx0XHRfbGVuZ2hPbkNoYW5nZUhhbmRsZXIoZXZlbnQpIHtcblx0XHRcdFx0bGV0IGVsZW0gPSBldmVudC50YXJnZXQ7XG5cdFx0XHRcdHRoaXMubGVuZ3RoID0gcGFyc2VJbnQoZWxlbS52YWx1ZSk7XG5cdFx0XHR9XG5cblxuXG5cdFx0XHRzdGF0aWMgX2dldENoYXJzZXRMaXN0KCkge1xuXHRcdFx0XHRsZXQgbGlzdCA9IFtdO1xuXHRcdFx0XHRsZXQgc2VsZWN0b3IgPSAnLnBhc3N3b3JkLWdlbmVyYXRvcl9fY2hhcnNldC1saXN0IGlucHV0Jztcblx0XHRcdFx0aWYgKHRoaXMuaWQpIHtcblx0XHRcdFx0XHRsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgIyR7dGhpcy5pZH0gJHtzZWxlY3Rvcn1gKVxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuZWwpIHtcblx0XHRcdFx0XHRsaXN0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsaXN0ID0gbGlzdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcblx0XHRcdFx0XHRsaXN0ID0gQXJyYXkucHJvdG90eXBlXG5cdFx0XHRcdFx0XHQuZmlsdGVyLmFwcGx5KGxpc3QsIFtmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtLmNoZWNrZWQ7IH1dKVxuXHRcdFx0XHRcdFx0Lm1hcChmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtLm5hbWU7IH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBsaXN0LnNsaWNlKCk7XG5cdFx0XHR9XG5cblx0XHRcdF9nZXRDaGFyc2V0TGlzdCgpIHtcblx0XHRcdFx0bGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5fZ2V0Q2hhcnNldExpc3QuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdF9nZW5lcmF0ZUxlbmd0aEVsZW1lbnQoY29udGFpbmVyKSB7XG5cdFx0XHRcdGZvciAobGV0IGwgPSAwOyBsIDw9IHRoaXMubWF4TGVuZ3RoIC0gdGhpcy5taW5MZW5ndGg7IGwrKykge1xuXHRcdFx0XHRcdGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcblx0XHRcdFx0XHRsZXQgdmFsID0gbCArIHRoaXMubWluTGVuZ3RoO1xuXHRcdFx0XHRcdG9wdGlvbi52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHRvcHRpb24uaW5uZXJIVE1MID0gdmFsO1xuXHRcdFx0XHRcdGlmICh2YWwgPT09IHRoaXMubGVuZ3RoKSB7IG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7IH1cblx0XHRcdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQob3B0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRfZ2VuZXJhdGVDaGFyc2V0TGlzdEVsZW1lbnQoY29udGFpbmVyKSB7XG5cdFx0XHRcdGxldCBjaGFyc2V0ID0gdGhpcy5jb3JlLnByZXNldHMoKS5jaGFyc2V0O1xuXHRcdFx0XHRmb3IgKGxldCBzIGluIGNoYXJzZXQpe1xuXHRcdFx0XHRcdGxldCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0XHRcdFx0bGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcblx0XHRcdFx0XHRpbnB1dC50eXBlID0gXCJjaGVja2JveFwiO1xuXHRcdFx0XHRcdGlucHV0Lm5hbWUgPSBzO1xuXHRcdFx0XHRcdGlucHV0LnZhbHVlID0gcztcblx0XHRcdFx0XHRpbnB1dC5jaGVja2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRsYWJlbC5hcHBlbmRDaGlsZChpbnB1dCk7XG5cdFx0XHRcdFx0bGFiZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocykpO1xuXHRcdFx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cblx0XHRcdGJ1dHRvbkNsaWNrSGFuZGxlciAoZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGxldCBwYXNzd29yZE91dCA9IHRoaXMud2lkZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1nZW5lcmF0b3JfX3Bhc3N3b3JkJyk7XG5cdFx0XHRcdHBhc3N3b3JkT3V0LnZhbHVlID0gdGhpcy5jb3JlLmdlbmVyYXRlUGFzc3dvcmQodGhpcy5sZW5ndGgsIHRoaXMuX2dldENoYXJzZXRMaXN0KCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR3aW5kb3cuUGFzc3dvcmRHZW5lcmF0b3JXaWRnZXQgPSBQYXNzd29yZEdlbmVyYXRvcldpZGdldDtcblxuXHR9KTtcbn0pKCk7XG4iXX0=
