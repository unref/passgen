// instantiate widget
window.addEventListener('DOMContentLoaded', function () {
	window.onerror = this.errorHandler.bind(this);

	new PasswordGeneratorWidget({
		selector: '#password-generator',
		length: 16
	});
});
